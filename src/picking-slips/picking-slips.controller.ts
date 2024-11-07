import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PickingSlipsService } from './picking-slips.service';
import { PaginateDto } from './dto/paginate-dto';

@ApiTags('picking-slips')
@Controller('picking-slips')
export class PickingSlipsController {
  constructor(private readonly pickingSlipsService: PickingSlipsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Retrieve a list of picking slips with pagination and optional filtering by status.',
    description:
      'This endpoint returns a paginated list of picking slips, filtered by status (optional). It can also return information about whether a picking slip has pre-order items.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The number of items per page.',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number for pagination.',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter by the status of the picking slip. Options include "not printed", "printed", and "held".',
    enum: ['not printed', 'printed', 'held'],
    example: 'printed',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved the list of picking slips with pagination and optional filtering.',
    schema: {
      example: {
        data: [
          {
            order_id: 18,
            picking_slip_id: 19,
            picking_slip_status: 'printed',
            has_pre_order_item: false,
          },
        ],
        meta: {
          itemsPerPage: 1,
          totalItems: 1322,
          currentPage: 1,
          totalPages: 1322,
          filter: {
            status: null,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request if invalid parameters are provided.',
  })
  find(@Query() paginateDto: PaginateDto) {
    return this.pickingSlipsService.find(paginateDto);
  }
}
