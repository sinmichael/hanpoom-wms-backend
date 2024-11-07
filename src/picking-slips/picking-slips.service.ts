import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickingSlip } from './entities/picking-slip.entity';
import { PickingSlipDate } from 'src/picking-slip-dates/entities/picking-slip-date.entity';
import { PickingSlipItem } from 'src/picking-slip-items/entities/picking-slip-item.entity';
import { PaginateDto } from './dto/paginate-dto';
import { PickingSlipStatus } from 'src/constants/status.constants';

@Injectable()
export class PickingSlipsService {
  constructor(
    @InjectRepository(PickingSlip)
    private pickingSlip: Repository<PickingSlip>,
  ) {}

  /**
   * Finds picking slips based on the provided pagination and status filter.
   *
   * @param {PaginateDto} paginateDto - The pagination and filter data.
   * @param {number} [paginateDto.limit] - Optional number of items per page.
   * @param {number} [paginateDto.page] - Optional page number for pagination (1-based index).
   * @param {string} [paginateDto.status] - Optional status filter, can be one of 'not printed', 'printed', or 'held'. If not provided, all statuses will be included.
   *
   * @returns {Promise<Object>} The result object containing the paginated picking slips and metadata.
   * @returns {Object} result.data - An array of picking slips, each with the following fields:
   *  - order_id: The order ID (number).
   *  - picking_slip_id: The picking slip ID (number).
   *  - picking_slip_status: The status of the picking slip (string: 'not printed', 'printed', or 'held').
   *  - has_pre_order_item: A boolean indicating if the picking slip has pre-order items.
   * @returns {Object} result.meta - Metadata for pagination, including:
   *  - itemsPerPage: The number of items per page.
   *  - totalItems: The total number of items matching the filters.
   *  - currentPage: The current page number.
   *  - totalPages: The total number of pages based on the items per page.
   *  - filter: An object containing the applied status filter (if any).
   */
  async find(paginateDto: PaginateDto): Promise<object> {
    const { status } = paginateDto;
    const { limit = 10, page = 1 } = paginateDto;
    const offset = (page - 1) * limit;

    /**
     * order_id
     * picking_slip_id
     * picking_slip_status (return only results that are in not printed, printed and held status according to the conditions in II. Querying)
     * has_pre_order_item (this is true if picking_slip_items, at least one record’s is_pre_order is 1)
     * Allow changing number of returned items for pagination using parameter
     * Allow filtering of picking_slip_status by status (not printed, printed and held) using parameter
     */
    const queryBuilder = await this.pickingSlip
      .createQueryBuilder('ps')
      .leftJoin(PickingSlipDate, 'psd', 'ps.id = psd.picking_slip_id')
      .leftJoin(PickingSlipItem, 'psi', 'ps.id = psi.picking_slip_id')
      .select([
        'ps.order_id',
        'ps.id AS picking_slip_id',
        'CASE ' +
          '  WHEN psd.printed_at IS NULL ' +
          '       AND psd.inspected_at IS NULL ' +
          '       AND psd.shipped_at IS NULL ' +
          '       AND psd.held_at IS NULL THEN :notPrinted ' +
          '  WHEN psd.printed_at IS NOT NULL ' +
          '       AND psd.inspected_at IS NULL ' +
          '       AND psd.shipped_at IS NULL ' +
          '       AND psd.held_at IS NULL THEN :printed ' +
          '  WHEN psd.held_at IS NOT NULL THEN :held ' +
          'END AS picking_slip_status',
        'CASE ' +
          '  WHEN MAX(psi.is_pre_order) = 1 THEN TRUE ' +
          '  ELSE FALSE ' +
          'END AS has_pre_order_item',
      ]);

    if (status === PickingSlipStatus.NOT_PRINTED) {
      queryBuilder
        .andWhere('psd.printed_at IS NULL')
        .andWhere('psd.inspected_at IS NULL')
        .andWhere('psd.shipped_at IS NULL')
        .andWhere('psd.held_at IS NULL');
    } else if (status === PickingSlipStatus.PRINTED) {
      queryBuilder
        .andWhere('psd.printed_at IS NOT NULL')
        .andWhere('psd.inspected_at IS NULL')
        .andWhere('psd.shipped_at IS NULL')
        .andWhere('psd.held_at IS NULL');
    } else if (status === PickingSlipStatus.HELD) {
      queryBuilder.andWhere('psd.held_at IS NOT NULL');
    } else if (!status) {
      queryBuilder
        .where(
          'psd.printed_at IS NULL AND psd.inspected_at IS NULL AND psd.shipped_at IS NULL AND psd.held_at IS NULL',
        )
        .orWhere(
          'psd.printed_at IS NOT NULL AND psd.inspected_at IS NULL AND psd.shipped_at IS NULL AND psd.held_at IS NULL',
        )
        .orWhere('psd.held_at IS NOT NULL');
    }

    queryBuilder
      .groupBy(
        'ps.order_id, ps.id, psd.printed_at, psd.inspected_at, psd.shipped_at, psd.held_at',
      )
      .setParameters({
        notPrinted: 'not printed',
        printed: 'printed',
        held: 'held',
      })
      .limit(limit)
      .offset(offset);

    const [pickingSlips, { totalItems, totalPages }] = await Promise.all([
      queryBuilder.getRawMany(),
      this.findMetadata(paginateDto),
    ]);

    const result = {
      data: pickingSlips.map((pickingSlip) => ({
        ...pickingSlip,
        order_id: Number(pickingSlip.order_id),
        picking_slip_id: Number(pickingSlip.picking_slip_id),
        has_pre_order_item: pickingSlip.has_pre_order_item === '1',
      })),
      // Add metadata for frontend consumption
      meta: {
        itemsPerPage: Number(limit),
        totalItems: Number(totalItems),
        currentPage: Number(page),
        totalPages: Number(totalPages),
        filter: {
          status: status || null,
        },
      },
    };

    return result;
  }

  /**
   * Retrieves the total number of picking slips based on the provided pagination and status filters.
   * This function calculates the total items and the total pages based on the specified limit and status.
   *
   * @param {PaginateDto} paginateDto - The pagination and filter parameters.
   * @param {number} [paginateDto.limit=10] - The number of items per page. Defaults to 10 if not provided.
   * @param {string} [paginateDto.status] - The status filter for picking slips.
   *                                      Can be one of the following values:
   *                                      - 'not printed': Filters for picking slips that are not printed.
   *                                      - 'printed': Filters for picking slips that are printed but not inspected, shipped, or held.
   *                                      - 'held': Filters for picking slips that are held.
   *                                      - `null` or not provided: Includes picking slips with any of the statuses 'not printed', 'printed', or 'held'.
   *
   * @returns {Promise<{ totalItems: number, totalPages: number }>}
   * Returns an object containing:
   * - `totalItems` (number): The total number of picking slips that match the filter criteria.
   * - `totalPages` (number): The total number of pages, calculated based on the total items and the provided limit.
   */
  private async findMetadata(paginateDto: PaginateDto) {
    const { limit = 10, status } = paginateDto;

    const queryBuilder = await this.pickingSlip
      .createQueryBuilder('ps')
      .leftJoin(PickingSlipDate, 'psd', 'ps.id = psd.picking_slip_id')
      .leftJoin(PickingSlipItem, 'psi', 'ps.id = psi.picking_slip_id')
      .select('COUNT(DISTINCT ps.id)', 'total');

    if (status === PickingSlipStatus.NOT_PRINTED) {
      queryBuilder
        .andWhere('psd.printed_at IS NULL')
        .andWhere('psd.inspected_at IS NULL')
        .andWhere('psd.shipped_at IS NULL')
        .andWhere('psd.held_at IS NULL');
    } else if (status === PickingSlipStatus.PRINTED) {
      queryBuilder
        .andWhere('psd.printed_at IS NOT NULL')
        .andWhere('psd.inspected_at IS NULL')
        .andWhere('psd.shipped_at IS NULL')
        .andWhere('psd.held_at IS NULL');
    } else if (status === PickingSlipStatus.HELD) {
      queryBuilder.andWhere('psd.held_at IS NOT NULL');
    } else if (!status) {
      queryBuilder
        .where(
          'psd.printed_at IS NULL AND psd.inspected_at IS NULL AND psd.shipped_at IS NULL AND psd.held_at IS NULL',
        )
        .orWhere(
          'psd.printed_at IS NOT NULL AND psd.inspected_at IS NULL AND psd.shipped_at IS NULL AND psd.held_at IS NULL',
        )
        .orWhere('psd.held_at IS NOT NULL');
    }

    const totalItemsResult = await queryBuilder.getRawOne();
    const totalItems = totalItemsResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages };
  }
}
