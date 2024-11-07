import { Module } from '@nestjs/common';
import { PickingSlipsService } from './picking-slips.service';
import { PickingSlipsController } from './picking-slips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickingSlip } from './entities/picking-slip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PickingSlip])],
  controllers: [PickingSlipsController],
  providers: [PickingSlipsService],
})
export class PickingSlipsModule {}
