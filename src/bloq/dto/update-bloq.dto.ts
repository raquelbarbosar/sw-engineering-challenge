import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBloqDto {
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
