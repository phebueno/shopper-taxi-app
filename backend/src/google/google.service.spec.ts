import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from './google.service';
import axios from 'axios';
import { CreateRideDto } from '../rides/dto/create-ride.dto';
import { GoogleRoute, Leg, Route } from './interfaces/google-route.interface';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleService', () => {
  let service: GoogleService;

  const mockApiKey = 'mock-api-key';
  const mockGoogleApiUrl =
    'https://routes.googleapis.com/directions/v2:computeRoutes';

  beforeEach(async () => {
    process.env.GOOGLE_API_KEY = mockApiKey;

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleService],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getApiRouteData', () => {
    it('should return route data from Google API', async () => {
      const createRideDto: CreateRideDto = {
        customer_id: 'random-id',
        origin: '123 Main St',
        destination: '456 Elm St',
      };

      const mockResponse: Partial<GoogleRoute> = {
        routes: [
          {
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

      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getApiRouteData(createRideDto);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockGoogleApiUrl,
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
            'X-Goog-Api-Key': mockApiKey,
            'X-Goog-FieldMask': '*',
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when Google API request fails', async () => {
      const createRideDto: CreateRideDto = {
        customer_id: 'random-id',
        origin: '123 Main St',
        destination: '456 Elm St',
      };

      const mockError = new Error('Google API is not reachable');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(service.getApiRouteData(createRideDto)).rejects.toThrow(
        'Google API Error: Google API is not reachable',
      );
    });
  });
});
