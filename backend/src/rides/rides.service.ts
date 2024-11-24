import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { GoogleService } from '../google/google.service';
import { RideEstimate } from './interfaces/rides.interface';
import { GoogleRoute } from '../google/interfaces/google-route.interface';
import { DriversService } from '../drivers/drivers.service';
import { DriverDto } from '../drivers/dto/driver.dto';

@Injectable()
export class RidesService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly driversService: DriversService,
  ) {}

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
    const availableDrivers = await this.driversService.getAvailableDrivers(
      googleRoute.routes[0].distanceMeters,
    );
    const mappedRide = this.mapGoogleRouteToRideEstimate(
      googleRoute,
      availableDrivers,
    );
    return mappedRide;
  }

  confirmRide(updateRideDto: UpdateRideDto) {
    return `Viagem confirmada com os dados: ${updateRideDto}`;
  }

  getRides(customerId: string, driverId?: string) {
    return `Visualizando rotas para o cliente ${customerId} e motorista ${driverId || 'nenhum motorista especificado'}`;
  }
}
