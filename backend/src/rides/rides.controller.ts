import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
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
  async confirmRide(@Body() updateRideDto: UpdateRideDto) {
    return await this.ridesService.confirmRide(updateRideDto);
  }

  @Get(':customer_id')
  async viewRides(
    @Param('customer_id') customerId: string,
    @Query('driver_id') driverId: string,
  ) {
    return await this.ridesService.getRides(customerId, driverId);
  }
}
