import { GoogleRoute } from "./googleApiRouteTypes";

export interface CustomerRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
}

export interface DriverRide {
  date: Date;
  id: number;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
      id: number;
      name: string;
  };
}

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
  options: Driver[];
  routeResponse: GoogleRoute;
}
