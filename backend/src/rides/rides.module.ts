import { Module } from '@nestjs/common';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { GoogleService } from '../google/google.service';
import { DriversService } from '../drivers/drivers.service';
import { CustomersService } from '../customers/customers.service';

@Module({
  controllers: [RidesController],
  providers: [RidesService, GoogleService, DriversService, CustomersService],
})
export class RidesModule {}
