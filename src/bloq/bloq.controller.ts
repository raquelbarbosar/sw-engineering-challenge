import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { BloqService } from './bloq.service';
import { CreateBloqDto } from './dto/create-bloq.dto';
import { UpdateBloqDto } from './dto/update-bloq.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Bloq } from './entities/bloq.entity';

@Controller('bloq')
export class BloqController {
  private readonly logger = new Logger(BloqController.name);

  constructor(private readonly bloqService: BloqService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bloq' })
  @ApiResponse({ status: 201, description: 'Bloq successfully created' })
  create(@Body() createBloqDto: CreateBloqDto): Promise<Bloq> {
    this.logger.log('Creating bloq');
    return this.bloqService.create(createBloqDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bloqs' })
  @ApiResponse({
    status: 200,
    description: 'List of bloqs',
    type: [Bloq],
  })
  findAll() {
    this.logger.log('Searching all bloqs');
    return this.bloqService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bloq' })
  @ApiResponse({
    status: 200,
    description: 'Bloq founded',
    type: Bloq,
  })
  findOne(@Param('id') id: string) {
    this.logger.log(`Searching bloq ${id}`);
    return this.bloqService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bloq' })
  @ApiResponse({
    status: 200,
    description: 'Bloq updated',
  })
  update(@Param('id') id: string, @Body() updateBloqDto: UpdateBloqDto) {
    this.logger.log(`Updating bloq ${id}`);
    return this.bloqService.update(id, updateBloqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bloq' })
  @ApiResponse({
    status: 200,
    description: 'Bloq deleted',
  })
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting bloq ${id}`);
    return this.bloqService.delete(id);
  }
}
