import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(id: string) {
    return await this.prisma.customer.upsert({
      where: { id },
      update: {},
      create: { id },
    });
  }
}
