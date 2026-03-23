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
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Rent } from './entities/rent.entity';

@Controller('rent')
export class RentController {
  private readonly logger = new Logger(RentController.name);

  constructor(private readonly rentService: RentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rent' })
  @ApiResponse({ status: 201, description: 'Rent successfully created' })
  create(@Body() createRentDto: CreateRentDto): Promise<Rent> {
    this.logger.log('Creating rent');
    return this.rentService.create(createRentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rents' })
  @ApiResponse({
    status: 200,
    description: 'List of rents',
    type: [Rent],
  })
  findAll() {
    this.logger.log('Searching all rents');
    return this.rentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rent' })
  @ApiResponse({
    status: 200,
    description: 'Rent founded',
    type: Rent,
  })
  findOne(@Param('id') id: string) {
    this.logger.log(`Searching rent ${id}`);
    return this.rentService.findOne(id);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    this.logger.log(`Updating rent ${id} status`);
    return this.rentService.updateStatus(id, updateRentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rent' })
  @ApiResponse({
    status: 200,
    description: 'Rent deleted',
  })
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting rent ${id}`);
    return this.rentService.delete(id);
  }
}
