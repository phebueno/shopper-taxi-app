import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RidesModule } from './rides/rides.module';
import { DriversModule } from './drivers/drivers.module';
import { CustomersModule } from './customers/customers.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [PrismaModule, RidesModule, DriversModule, CustomersModule, GoogleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
