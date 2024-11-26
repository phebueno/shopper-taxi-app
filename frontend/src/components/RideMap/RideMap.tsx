import React from "react";
import {
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps";
import EncodedPolylineRenderer from "./EncodedPolylineRenderer";
import { RideEstimate } from "../../types/rideTypes";

type GoogleMapsProps = {
  rideRoute: RideEstimate;
};

const RideMap: React.FC<GoogleMapsProps> = ({ rideRoute }) => { 
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
        gestureHandling={"none"}
        fullscreenControl={false}
        disableDefaultUI={true}
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

export default RideMap;