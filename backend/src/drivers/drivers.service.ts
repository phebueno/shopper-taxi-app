import { Injectable } from '@nestjs/common';
import { DriverDto } from '@/drivers/dto/driver.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async getDriverById(id: number) {
    return await this.prisma.driver.findUnique({ where: { id } });
  }

  async getAvailableDrivers(currentDistance: number): Promise<DriverDto[]> {
    const kmDistance = currentDistance / 1000;

    const drivers = await this.prisma.driver.findMany({
      where: { minKm: { lte: kmDistance } },
      select: {
        id: true,
        name: true,
        description: true,
        vehicle: true,
        review: {
          select: {
            rating: true,
            comment: true,
          },
        },
        costPerKm: true,
      },
      orderBy: { costPerKm: 'asc' },
    });

    return drivers.map(({ costPerKm, ...driver }) => ({
      ...driver,
      value: costPerKm * kmDistance,
    }));
  }
}
