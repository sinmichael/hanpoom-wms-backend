import { PickingSlipItem } from 'src/picking-slip-items/entities/picking-slip-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('picking_slips')
export class PickingSlip {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ name: 'order_id', type: 'bigint', nullable: true })
  orderId: number;

  @Column({
    name: 'order_fulfillment_order_id',
    type: 'bigint',
    nullable: true,
  })
  orderFulfillmentOrderId: number;

  @Column({
    name: 'is_contained_single_product',
    type: 'tinyint',
    width: 1,
    default: 0,
  })
  isContainedSingleProduct: boolean;

  @OneToMany(
    () => PickingSlipItem,
    (pickingSlipItem) => pickingSlipItem.pickingSlip,
  )
  pickingSlipItems: PickingSlipItem;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
