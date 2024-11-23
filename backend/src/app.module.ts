import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user.service';
import { RidesModule } from './rides/rides.module';
import { DriversModule } from './drivers/drivers.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [PrismaModule, RidesModule, DriversModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
