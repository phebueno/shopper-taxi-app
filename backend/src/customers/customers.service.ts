import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
