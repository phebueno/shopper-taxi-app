import { Test, TestingModule } from '@nestjs/testing';
import { RidesService } from './rides.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { DriversService } from '../drivers/drivers.service';
import { CustomersService } from '../customers/customers.service';

describe('RidesService', () => {
  let service: RidesService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        GoogleService,
        DriversService,
        CustomersService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    service = module.get<RidesService>(RidesService);
    prismaService = module.get(PrismaService);
  });

  describe('getRides', () => {
    const mockRides = [
      {
        id: 1,
        createdAt: new Date(),
        origin: 'Origin A',
        destination: 'Destination A',
        distance: 1000,
        duration: '1000s',
        driver: { id: 1, name: 'Driver 1' },
        value: 100,
        customerId: 'customer1',
        driverId: 1,
        updatedAt: new Date(),
      },
      {
        id: 2,
        createdAt: new Date(),
        origin: 'Origin B',
        destination: 'Destination B',
        distance: 2000,
        duration: '2000s',
        driver: { id: 2, name: 'Driver 2' },
        value: 100,
        customerId: 'customer1',
        driverId: 1,
        updatedAt: new Date(),
      },
    ];

    it('should return rides for a customer', async () => {
      prismaService.ride.findMany.mockResolvedValue(mockRides);

      const result = await service.getRides('customer1');

      const formattedRide = mockRides.map(({ createdAt, ...ride }) => ({
        ...ride,
        date: createdAt,
      }));

      expect(result).toEqual({
        customer_id: 'customer1',
        rides: formattedRide,
      });

      expect(prismaService.ride.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer1' },
        select: {
          id: true,
          createdAt: true,
          origin: true,
          destination: true,
          distance: true,
          duration: true,
          driver: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter rides by driverId when provided', async () => {
      prismaService.ride.findMany.mockResolvedValue([mockRides[0]]);

      const result = await service.getRides('customer1', 1);

      const formattedRide = mockRides.map(({ createdAt, ...ride }) => ({
        ...ride,
        date: createdAt,
      }));

      expect(result).toEqual({
        customer_id: 'customer1',
        rides: [formattedRide[0]],
      });

      expect(prismaService.ride.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer1', driverId: 1 },
        select: {
          id: true,
          createdAt: true,
          origin: true,
          destination: true,
          distance: true,
          duration: true,
          driver: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw NotFoundException when no rides are found', async () => {
      prismaService.ride.findMany.mockResolvedValue([]);

      await expect(service.getRides('customer1')).rejects.toThrowError(
        new NotFoundException({
          error_code: 'NO_RIDES_FOUND',
          error_description:
            'There were no rides found for customer ID customer1.',
        }),
      );

      expect(prismaService.ride.findMany).toHaveBeenCalledWith({
        where: { customerId: 'customer1' },
        select: {
          id: true,
          createdAt: true,
          origin: true,
          destination: true,
          distance: true,
          duration: true,
          driver: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
