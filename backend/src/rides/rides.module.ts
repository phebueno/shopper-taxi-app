import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { GoogleService } from '../google/google.service';
import { DriversService } from '../drivers/drivers.service';

@Module({
  controllers: [RidesController],
  providers: [RidesService, GoogleService, DriversService],
})
export class RidesModule {}
