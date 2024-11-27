import { Module } from '@nestjs/common';
import { CustomersService } from '@/customers/customers.service';
import { DriversService } from '@/drivers/drivers.service';
import { GoogleService } from '@/google/google.service';
import { RidesController } from '@/rides/rides.controller';
import { RidesService } from '@/rides/rides.service';

@Module({
  controllers: [RidesController],
  providers: [RidesService, GoogleService, DriversService, CustomersService],
})
export class RidesModule {}
