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
