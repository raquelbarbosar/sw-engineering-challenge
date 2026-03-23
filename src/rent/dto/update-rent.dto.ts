/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RENT_STATUS } from '../interfaces/rent.interface';

export class UpdateRentDto {
  @ApiProperty({
    description: 'Rent status',
    enum: RENT_STATUS,
    default: RENT_STATUS.CREATED,
    example: RENT_STATUS.CREATED,
  })
  @IsNotEmpty()
  @IsEnum(RENT_STATUS)
  status: RENT_STATUS;
}
