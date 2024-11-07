import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PickingSlip } from 'src/picking-slips/entities/picking-slip.entity';

@Entity('picking_slip_dates')
export class PickingSlipDate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @OneToOne(() => PickingSlip)
  @JoinColumn({ name: 'picking_slip_id' })
  pickingSlip: PickingSlip;

  @Column({
    name: 'printed_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  printedUsername?: string;

  @Column({
    name: 'inspected_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  inspectedUsername?: string;

  @Column({
    name: 'packed_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  packedUsername?: string;

  @Column({
    name: 'shipped_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  shippedUsername?: string;

  @Column({
    name: 'held_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  heldUsername?: string;

  @Column({
    name: 'cancelled_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  cancelledUsername?: string;

  @Column({
    name: 'refunded_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  refundedUsername?: string;

  @Column({
    name: 'confirmed_username',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  confirmedUsername?: string;

  @Index()
  @Column({ name: 'printed_at', type: 'timestamp', nullable: true })
  printedAt?: Date;

  @Index()
  @Column({ name: 'inspected_at', type: 'timestamp', nullable: true })
  inspectedAt?: Date;

  @Column({ name: 'packed_at', type: 'timestamp', nullable: true })
  packedAt?: Date;

  @Index()
  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
  returnedAt?: Date;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ name: 'refunded_at', type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @Index()
  @Column({ name: 'held_at', type: 'timestamp', nullable: true })
  heldAt?: Date;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ name: 'held_reason', type: 'varchar', length: 20, nullable: true })
  heldReason?: string;
}
