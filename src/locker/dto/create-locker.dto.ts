/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { LOCKER_STATUS } from '../interfaces/locker.interface';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLockerDto {
  @ApiProperty({
    description: 'Bloq Id (UUID)',
    type: String,
    example: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
  })
  @IsNotEmpty()
  bloqId: string;

  @ApiProperty({
    description: 'Locker status',
    enum: LOCKER_STATUS,
    default: LOCKER_STATUS.OPEN,
    example: LOCKER_STATUS.CLOSED,
  })
  @IsEnum(LOCKER_STATUS)
  @IsOptional()
  status?: LOCKER_STATUS;

  @ApiProperty({
    description: 'If locker is occupied or not',
    type: Boolean,
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isOccupied?: boolean;
}
