import { DriversService } from '@/drivers/drivers.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import driversDefaultData from 'prisma/seed/data/driver.data';

describe('DriversService', () => {
  let service: DriversService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
    prismaService = module.get(PrismaService);
  });
  describe('getDriverById', () => {
    it('should return a driver by ID', async () => {
      const mockDriver = {
        ...driversDefaultData[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.driver.findUnique.mockResolvedValue(mockDriver);

      const result = await service.getDriverById(1);

      expect(prismaService.driver.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDriver);
    });

    it('should return null if driver is not found', async () => {
      prismaService.driver.findUnique.mockResolvedValue(null);

      const result = await service.getDriverById(2);

      expect(prismaService.driver.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(result).toBeNull();
    });
  });

  describe('getAvailableDrivers', () => {
    it('should return a list of available drivers with calculated values', async () => {
      const mockDrivers = driversDefaultData.map((driver) => ({
        ...driver,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      prismaService.driver.findMany.mockResolvedValue(mockDrivers);

      const currentDistance = 7000;
      const result = await service.getAvailableDrivers(currentDistance);

      expect(prismaService.driver.findMany).toHaveBeenCalledWith({
        where: { minKm: { lte: 7 } },
        select: {
          id: true,
          name: true,
          description: true,
          vehicle: true,
          review: {
            select: { rating: true, comment: true },
          },
          costPerKm: true,
        },
        orderBy: { costPerKm: 'asc' },
      });

      const estimatedDrivers = mockDrivers.map(({ costPerKm, ...driver }) => ({
        ...driver,
        value: (costPerKm * currentDistance) / 1000,
      }));

      expect(result).toEqual(estimatedDrivers);
    });

    it('should return an empty array if no drivers are available', async () => {
      prismaService.driver.findMany.mockResolvedValue([]);

      const currentDistance = 3000;
      const result = await service.getAvailableDrivers(currentDistance);

      expect(prismaService.driver.findMany).toHaveBeenCalledWith({
        where: { minKm: { lte: 3 } },
        select: {
          id: true,
          name: true,
          description: true,
          vehicle: true,
          review: {
            select: { rating: true, comment: true },
          },
          costPerKm: true,
        },
        orderBy: { costPerKm: 'asc' },
      });

      expect(result).toEqual([]);
    });
  });
});
