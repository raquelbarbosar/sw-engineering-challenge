/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateLockerDto } from './create-locker.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LOCKER_STATUS } from '../interfaces/locker.interface';

export class UpdateLockerDto {
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
    example: LOCKER_STATUS.CLOSED,
  })
  @IsNotEmpty()
  status: LOCKER_STATUS;

  @ApiProperty({
    description: 'If locker is occupied or not',
    type: Boolean,
    example: false,
  })
  @IsNotEmpty()
  isOccupied: boolean;
}
