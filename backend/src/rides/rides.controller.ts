import { RidesService } from '@/rides/rides.service';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';
import { ParseToStringPipe } from '@/common/pipes/parse-to-string.pipe';
import { CreateRideDto } from '@/rides/dto/create-ride.dto';
import { UpdateRideDto } from '@/rides/dto/update-ride.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';

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
    @Param('customer_id', ParseToStringPipe) customerId: string,
    @Query('driver_id', CustomParseIntPipe) driverId?: number,
  ) {
    return await this.ridesService.getRides(customerId, driverId);
  }
}
