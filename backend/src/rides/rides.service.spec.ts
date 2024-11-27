import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Driver, Ride } from '@prisma/client';
import { RidesService } from '@/rides/rides.service';
import { GoogleService } from '@/google/google.service';
import { DriversService } from '@/drivers/drivers.service';
import { CustomersService } from '@/customers/customers.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRideDto } from '@/rides/dto/create-ride.dto';
import {
  GoogleRoute,
  Leg,
  Route,
} from '@/google/interfaces/google-route.interface';
import { RideEstimate } from '@/rides/interfaces/rides.interface';
import { DriverDto } from '@/drivers/dto/driver.dto';

describe('RidesService', () => {
  let ridesService: RidesService;
  let googleService: DeepMockProxy<GoogleService>;
  let driversService: DeepMockProxy<DriversService>;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidesService,
        { provide: GoogleService, useValue: mockDeep<GoogleService>() },
        { provide: DriversService, useValue: mockDeep<DriversService>() },
        { provide: CustomersService, useValue: mockDeep<CustomersService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    ridesService = module.get<RidesService>(RidesService);
    googleService = module.get(GoogleService);
    driversService = module.get(DriversService);
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

      const result = await ridesService.getRides('customer1');

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

      const result = await ridesService.getRides('customer1', 1);

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

      await expect(ridesService.getRides('customer1')).rejects.toThrow(
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

  describe('confirmRide', () => {
    it('should create a ride with the correct data', async () => {
      driversService.getDriverById.mockResolvedValue({ minKm: 0.5 } as Driver);
      prismaService.ride.create.mockResolvedValue({} as Ride);

      const updateRideDto = {
        origin: 'Point A',
        destination: 'Point B',
        distance: 2000,
        duration: '30 mins',
        value: 25,
        customer_id: 'customer123',
        driver: { id: 1 },
      };

      await ridesService.confirmRide(updateRideDto as any);

      expect(prismaService.ride.create).toHaveBeenCalledWith({
        data: {
          origin: 'Point A',
          destination: 'Point B',
          distance: 2000,
          duration: '30 mins',
          value: 25,
          customerId: 'customer123',
          driverId: 1,
        },
      });
    });

    it('should return success when the ride is created successfully', async () => {
      driversService.getDriverById.mockResolvedValue({ minKm: 0.5 } as Driver);
      prismaService.ride.create.mockResolvedValue({} as Ride);

      const updateRideDto = {
        origin: 'Point A',
        destination: 'Point B',
        distance: 2000,
        customer_id: 'customer123',
        driver: { id: 1 },
      };

      const result = await ridesService.confirmRide(updateRideDto as any);

      expect(result).toEqual({ success: true });
    });

    it('should throw BadRequestException if origin and destination are the same', async () => {
      const updateRideDto = {
        origin: 'Point A',
        destination: 'Point A',
        distance: 1000,
        duration: '100s',
        customer_id: 'customer123',
        driver: { id: 1, name: 'Driver 1' },
      };

      await expect(
        ridesService.confirmRide(updateRideDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if driver is not found', async () => {
      driversService.getDriverById.mockResolvedValue(null);

      const updateRideDto = {
        origin: 'Point A',
        destination: 'Point B',
        distance: 1000,
        customer_id: 'customer123',
        driver: { id: 1 },
      };

      await expect(
        ridesService.confirmRide(updateRideDto as any),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if distance is less than the driver's minimum", async () => {
      driversService.getDriverById.mockResolvedValue({ minKm: 2 } as Driver);

      const updateRideDto = {
        origin: 'Point A',
        destination: 'Point B',
        distance: 1000,
        customer_id: 'customer123',
        driver: { id: 1 },
      };

      await expect(
        ridesService.confirmRide(updateRideDto as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('estimateRide', () => {
    it('should return a ride estimate if available drivers are found', async () => {
      const createRideDto: CreateRideDto = {
        customer_id: 'customer123',
        origin: 'Origin A',
        destination: 'Destination A',
      };

      const googleRoute: Partial<GoogleRoute> = {
        routes: [
          {
            distanceMeters: 1234,
            duration: '10 mins',
            legs: [
              {
                distanceMeters: 1234,
                duration: '10 mins',
                startLocation: {
                  latLng: { latitude: 40.7128, longitude: -74.006 },
                },
                endLocation: {
                  latLng: { latitude: 40.7138, longitude: -74.007 },
                },
              } as Partial<Leg>,
            ],
          },
        ] as Partial<Route[]>,
      };

      const availableDrivers = [{ id: 1, name: 'Driver 1' }];

      googleService.getApiRouteData.mockResolvedValue(
        googleRoute as GoogleRoute,
      );
      driversService.getAvailableDrivers.mockResolvedValue(
        availableDrivers as DriverDto[],
      );

      const mappedRide = {
        origin: {
          latitude: googleRoute.routes[0].legs[0].startLocation.latLng.latitude,
          longitude:
            googleRoute.routes[0].legs[0].startLocation.latLng.longitude,
        },
        destination: {
          latitude: googleRoute.routes[0].legs[0].endLocation.latLng.latitude,
          longitude: googleRoute.routes[0].legs[0].endLocation.latLng.longitude,
        },
        distance: googleRoute.routes[0].distanceMeters,
        options: availableDrivers,
        duration: googleRoute.routes[0].duration,
        routeResponse: googleRoute,
      } as RideEstimate;

      const result = await ridesService.estimateRide(createRideDto);

      expect(result).toEqual(mappedRide);

      expect(googleService.getApiRouteData).toHaveBeenCalledWith(createRideDto);
      expect(driversService.getAvailableDrivers).toHaveBeenCalledWith(
        googleRoute.routes[0].distanceMeters,
      );
    });

    it('should throw NotFoundException if no route is found by Google', async () => {
      const createRideDto: CreateRideDto = {
        customer_id: 'customer123',
        origin: 'Origin A',
        destination: 'Destination A',
      };

      googleService.getApiRouteData.mockResolvedValue({
        routes: [],
      } as GoogleRoute);

      await expect(ridesService.estimateRide(createRideDto)).rejects.toThrow(
        new NotFoundException({
          error_code: 'ROUTE_NOT_FOUND',
          error_description:
            'Google could not find a route for the provided coordinates.',
        }),
      );
    });

    it('should throw NotAcceptableException if Google cannot calculate the distance', async () => {
      const createRideDto: CreateRideDto = {
        customer_id: 'customer123',
        origin: 'Origin A',
        destination: 'Destination A',
      };

      googleService.getApiRouteData.mockResolvedValue({
        routes: [{ distanceMeters: null }],
      } as GoogleRoute);

      await expect(ridesService.estimateRide(createRideDto)).rejects.toThrow(
        new NotAcceptableException({
          error_code: 'INVALID_DISTANCE',
          error_description:
            'Google could not calculate the distance for the provided coordinates.',
        }),
      );
    });
  });
});
