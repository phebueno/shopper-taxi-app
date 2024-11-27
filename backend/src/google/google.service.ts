import { GoogleRoute } from '@/google/interfaces/google-route.interface';
import { CreateRideDto } from '@/rides/dto/create-ride.dto';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
  private readonly googleApiKey: string;
  private readonly googleApiUrl: string;

  constructor() {
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.googleApiUrl =
      'https://routes.googleapis.com/directions/v2:computeRoutes';
  }

  async getApiRouteData(createRideDto: CreateRideDto): Promise<GoogleRoute> {
    try {
      const response = await axios.post<GoogleRoute>(
        this.googleApiUrl,
        {
          origin: { address: createRideDto.origin },
          destination: { address: createRideDto.destination },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
        },
        {
          headers: {
            'X-Goog-Api-Key': this.googleApiKey,
            'X-Goog-FieldMask': '*',
          },
        },
      );
      return response.data;
    } catch (error) {
      //TODO: TURN ERRORS INTO DEFAULT ERROR (OR INVALID DATA)
      throw new Error(`Google API Error: ${error.message}`);
    }
  }
}
