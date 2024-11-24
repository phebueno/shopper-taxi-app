import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';

@Controller('ride')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post('estimate')
  async create(@Body() createRideDto: CreateRideDto) {
    return await this.ridesService.estimateRide(createRideDto);
  }
  
  @Patch('confirm')
  confirmRide(@Body() updateRideDto: UpdateRideDto) {
    return this.ridesService.confirmRide(updateRideDto);
  }

  @Get(':customer_id')
  viewRides(
    @Param('customer_id') customerId: string,
    @Query('driver_id') driverId: string,
  ) {
    return this.ridesService.getRides(customerId, driverId);
  }
}
