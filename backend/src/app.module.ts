import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CustomersModule } from '@/customers/customers.module';
import { DriversModule } from '@/drivers/drivers.module';
import { GoogleModule } from '@/google/google.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RidesModule } from '@/rides/rides.module';

@Module({
  imports: [
    PrismaModule,
    RidesModule,
    DriversModule,
    CustomersModule,
    GoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
