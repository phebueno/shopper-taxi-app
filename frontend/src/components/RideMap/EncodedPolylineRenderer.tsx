import React, { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const EncodedPolylineRenderer: React.FC<{ encodedPolyline: string }> = ({
  encodedPolyline,
}) => {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");

  useEffect(() => {
    if (!map || !geometryLibrary) return;

    const decodedPath = geometryLibrary.encoding.decodePath(encodedPolyline);

    const polyline = new google.maps.Polyline({
      path: decodedPath,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map,
    });

    const bounds = new google.maps.LatLngBounds();
    decodedPath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);

    return () => {
      polyline.setMap(null);
    };
  }, [map, geometryLibrary, encodedPolyline]);

  return null;
};

export default EncodedPolylineRenderer;
