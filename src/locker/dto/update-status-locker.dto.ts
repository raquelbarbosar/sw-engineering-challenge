/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LOCKER_STATUS } from '../interfaces/locker.interface';

export class UpdateStatusLockerDto {
  @ApiProperty({
    description: 'Locker status',
    enum: LOCKER_STATUS,
    example: LOCKER_STATUS.CLOSED,
  })
  @IsEnum(LOCKER_STATUS)
  @IsNotEmpty()
  status: LOCKER_STATUS;

  @ApiProperty({
    description: 'If locker is occupied or not',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isOccupied?: boolean;
}
