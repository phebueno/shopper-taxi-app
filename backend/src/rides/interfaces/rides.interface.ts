import { DriverDto } from '@/drivers/dto/driver.dto';
import { GoogleRoute } from '@/google/interfaces/google-route.interface';

export interface RideEstimate {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: DriverDto[];
  routeResponse: GoogleRoute;
}
