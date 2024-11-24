export interface GoogleRoute {
  routes: Route[];
  geocodingResults: GeocodingResults;
}

export interface GeocodingResults {
  origin: Destination;
  destination: Destination;
}

export interface Destination {
  geocoderStatus: GeocoderStatus;
  type: string[];
  placeId: string;
}

export interface GeocoderStatus {}

export interface Route {
  legs: Leg[];
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: Polyline;
  description: string;
  viewport: Viewport;
  travelAdvisory: GeocoderStatus;
  localizedValues: LegLocalizedValues;
  routeToken: string;
  routeLabels: string[];
}

export interface Leg {
  distanceMeters: number;
  duration: string;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  steps: Step[];
  localizedValues: LegLocalizedValues;
}

export interface Location {
  latLng: High;
}

export interface High {
  latitude: number;
  longitude: number;
}

export interface LegLocalizedValues {
  distance: Distance;
  duration: Distance;
  staticDuration: Distance;
}

export interface Distance {
  text: string;
}

export interface Polyline {
  encodedPolyline: string;
}

export interface Step {
  distanceMeters: number;
  staticDuration: string;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  navigationInstruction: NavigationInstruction;
  localizedValues: StepLocalizedValues;
  travelMode: string;
}

export interface StepLocalizedValues {
  distance: Distance;
  staticDuration: Distance;
}

export interface NavigationInstruction {
  maneuver: string;
  instructions: string;
}

export interface Viewport {
  low: High;
  high: High;
}
