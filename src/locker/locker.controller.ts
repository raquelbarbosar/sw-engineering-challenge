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
import { LockerService } from './locker.service';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Locker } from './entities/locker.entity';
import { UpdateStatusLockerDto } from './dto/update-status-locker.dto';

@Controller('locker')
export class LockerController {
  private readonly logger = new Logger(LockerController.name);

  constructor(private readonly lockerService: LockerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new locker' })
  @ApiResponse({ status: 201, description: 'Locker successfully created' })
  create(@Body() createLockerDto: CreateLockerDto) {
    this.logger.log('Creating locker');
    return this.lockerService.create(createLockerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lockers' })
  @ApiResponse({
    status: 200,
    description: 'List of lockers',
    type: [Locker],
  })
  findAll() {
    this.logger.log('Searching all lockers');
    return this.lockerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a locker' })
  @ApiResponse({
    status: 200,
    description: 'Locker founded',
    type: Locker,
  })
  findOne(@Param('id') id: string) {
    this.logger.log(`Searching locker ${id}`);
    return this.lockerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update locker status' })
  @ApiResponse({
    status: 200,
    description: 'Locker updated',
    type: Locker,
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusLockerDto: UpdateStatusLockerDto,
  ) {
    this.logger.log(`Updating locker ${id} status`);
    return this.lockerService.updateStatus(id, updateStatusLockerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a locker' })
  @ApiResponse({
    status: 200,
    description: 'Locker deleted',
  })
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting locker ${id}`);
    return this.lockerService.delete(id);
  }
}
