import { DriversService } from '@/drivers/drivers.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [DriversService],
})
export class DriversModule {}
