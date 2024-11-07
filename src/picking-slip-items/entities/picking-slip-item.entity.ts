import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PickingSlip } from 'src/picking-slips/entities/picking-slip.entity';

@Entity('picking_slip_items')
export class PickingSlipItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @ManyToOne(() => PickingSlip, (pickingSlip) => pickingSlip.pickingSlipItems)
  @JoinColumn({ name: 'picking_slip_id' })
  pickingSlip: PickingSlip;

  @Column({ name: 'item_id', type: 'bigint' })
  itemId: number;

  @Column({ name: 'stock_id', type: 'bigint', nullable: true })
  stockId?: number;

  @Column({ name: 'order_fulfillment_product_id', type: 'bigint' })
  orderFulfillmentProductId: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'refunded_quantity', type: 'int' })
  refundedQuantity: number;

  @Column({ name: 'location_id', type: 'bigint', nullable: true })
  locationId?: number;

  @Column({
    name: 'location_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  locationCode?: string;

  @Column({ name: 'is_pre_order', type: 'tinyint', width: 1 })
  isPreOrder: boolean;

  @Column({ name: 'is_sales_only', type: 'tinyint', width: 1 })
  isSalesOnly: boolean;

  @Column({ name: 'pre_order_shipping_at', type: 'timestamp', nullable: true })
  preOrderShippingAt?: Date;

  @Column({ name: 'pre_order_deadline_at', type: 'timestamp', nullable: true })
  preOrderDeadlineAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
