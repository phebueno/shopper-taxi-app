import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { GoogleService } from '../google/google.service';
import { RideEstimate } from './interfaces/rides.interface';
import { GoogleRoute } from '../google/interfaces/google-route.interface';
import { DriversService } from '../drivers/drivers.service';
import { DriverDto } from '../drivers/dto/driver.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class RidesService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly driversService: DriversService,
    private readonly prismaService: PrismaService,
    private readonly customersService: CustomersService,
  ) {}

  private prepareRideData(updateRideDto: UpdateRideDto) {
    return {
      origin: updateRideDto.origin,
      destination: updateRideDto.destination,
      distance: updateRideDto.distance,
      duration: updateRideDto.duration,
      value: updateRideDto.value,
      customerId: updateRideDto.customer_id,
      driverId: updateRideDto.driver.id,
    };
  }

  private mapGoogleRouteToRideEstimate(
    googleRoute: GoogleRoute,
    availableDrivers: DriverDto[],
  ): RideEstimate {
    const [route] = googleRoute.routes;
    const [leg] = route.legs;

    return {
      origin: {
        latitude: leg.startLocation.latLng.latitude,
        longitude: leg.startLocation.latLng.longitude,
      },
      destination: {
        latitude: leg.endLocation.latLng.latitude,
        longitude: leg.endLocation.latLng.longitude,
      },
      distance: route.distanceMeters,
      duration: route.duration,
      options: availableDrivers,
      routeResponse: googleRoute,
    };
  }

  async estimateRide(createRideDto: CreateRideDto) {
    const googleRoute = await this.googleService.getApiRouteData(createRideDto);

    if (!googleRoute.routes.length) {
      throw new NotFoundException({
        error_code: 'ROUTE_NOT_FOUND',
        error_description:
          'Google could not find a route for the provided coordinates.',
      });
    }

    if (!googleRoute.routes[0].distanceMeters) {
      throw new NotAcceptableException({
        error_code: 'INVALID_DISTANCE',
        error_description:
          'Google could not calculate the distance for the provided coordinates.',
      });
    }

    const availableDrivers = await this.driversService.getAvailableDrivers(
      googleRoute.routes[0].distanceMeters,
    );
    const mappedRide = this.mapGoogleRouteToRideEstimate(
      googleRoute,
      availableDrivers,
    );
    return mappedRide;
  }

  async confirmRide(updateRideDto: UpdateRideDto) {
    const coveredDistance = updateRideDto.distance / 1000;
    if (updateRideDto.origin === updateRideDto.destination) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description:
          'Origin and destination must be from different locations!',
      });
    }

    const validDriver = await this.driversService.getDriverById(
      updateRideDto.driver.id,
    );
    if (!validDriver) {
      throw new NotFoundException({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: `Driver with ID ${updateRideDto.driver.id} could not be found.`,
      });
    }
    if (coveredDistance < validDriver.minKm) {
      throw new NotFoundException({
        error_code: 'INVALID_DISTANCE',
        error_description: `The selected Driver does not cover the required distance.`,
      });
    }

    await this.customersService.upsert(updateRideDto.customer_id);

    await this.prismaService.ride.create({
      data: this.prepareRideData(updateRideDto),
    });

    return {
      success: true,
    };
  }

  getRides(customerId: string, driverId?: string) {
    return `Visualizando rotas para o cliente ${customerId} e motorista ${driverId || 'nenhum motorista especificado'}`;
  }
}
