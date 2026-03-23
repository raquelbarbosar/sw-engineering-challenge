/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBloqDto {
  @ApiProperty({
    description: 'Bloq name/title',
    type: String,
    example: 'Bloq Name',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Bloq address',
    type: String,
    example: '101 Av. des Champs-Élysées, 75008 Paris, France',
  })
  @IsNotEmpty()
  address: string;
}
