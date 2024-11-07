import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';
import { PickingSlipStatus } from 'src/constants/status.constants';

export class PaginateDto {
  @ApiPropertyOptional({
    description: 'The number of items to retrieve per page.',
    example: 10,
    type: Number,
    default: 10,
  })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    description: 'The page number to retrieve.',
    example: 1,
    type: Number,
    default: 1,
  })
  @IsNumberString()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    description: 'The status of the picking slip.',
    example: 'printed',
    enum: PickingSlipStatus.ALL,
  })
  @IsOptional()
  @IsIn([...PickingSlipStatus.ALL])
  status: string;
}
