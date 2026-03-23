/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RENT_SIZE, RENT_STATUS } from '../interfaces/rent.interface';

export class CreateRentDto {
  @ApiProperty({
    description: 'Locker Id (UUID)',
    type: String,
    example: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
  })
  @IsNotEmpty()
  lockerId: string;

  @ApiProperty({
    description: 'Rent weight',
    type: Number,
    example: 4,
  })
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    description: 'Rent size',
    enum: RENT_SIZE,
    example: RENT_SIZE.S,
  })
  @IsNotEmpty()
  @IsEnum(RENT_SIZE)
  size: RENT_SIZE;

  @ApiProperty({
    description: 'Rent status',
    enum: RENT_STATUS,
    default: RENT_STATUS.CREATED,
    example: RENT_STATUS.CREATED,
  })
  @IsEnum(RENT_STATUS)
  @IsOptional()
  status?: RENT_STATUS;
}
