import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { DriverRide } from "../../types/rideTypes";
import { formatDuration } from "../../utils/rideInfoUtils";

interface RideCardProps {
  ride: DriverRide;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      p={4}
      mb={4}
      textAlign="left"
      background="white"
    >
      <Text fontWeight="bold">Origem: {ride.origin}</Text>
      <Text fontWeight="bold">Destino: {ride.destination}</Text>
      <Text>
        Distância: {(ride.distance / 1000).toFixed(2).replace(".", ",")} km
      </Text>
      <Text>Duração: {formatDuration(ride.duration)}</Text>
      <Text>Motorista: {ride.driver.name}</Text>
      <Text>
        Data:{" "}
        {new Date(ride.date).toLocaleString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </Text>
    </Box>
  );
};

export default RideCard;
