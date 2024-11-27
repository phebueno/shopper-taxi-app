import { GoogleService } from '@/google/google.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [GoogleService],
})
export class GoogleModule {}
