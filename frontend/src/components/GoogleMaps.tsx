import React, { useEffect, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import EncodedPolylineRenderer from "./EncodedPolylineRenderer";

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
];

type GoogleMapsProps = {
  rideRoute: any; // Ajuste conforme necessário
};

const GoogleMaps: React.FC<GoogleMapsProps> = ({ rideRoute }) => {
 
  if (!rideRoute) return <p>Rota não encontrada!</p>;

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      libraries={["geometry"]}
    >
      <Map
        style={{ width: "50vw", height: "50vh" }}
        defaultCenter={{ lat: 43.65, lng: -79.38 }}
        defaultZoom={9}
        gestureHandling={"greedy"}
        fullscreenControl={false}
      >
        <EncodedPolylineRenderer
          encodedPolyline={
            rideRoute.routeResponse.routes[0].legs[0].polyline.encodedPolyline
          }
        />
        <Marker
          position={{
            lat: rideRoute.origin.latitude,
            lng: rideRoute.origin.longitude,
          }}
        />
        <Marker
          position={{
            lat: rideRoute.destination.latitude,
            lng: rideRoute.destination.longitude,
          }}
        />
      </Map>
    </APIProvider>
  );
};

export default GoogleMaps;

{
  /* <AdvancedMarker
          key={locations[0].key}
          position={locations[0].location}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker> */
}
