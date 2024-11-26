import React, { useState } from "react";
import {
  CardBody,
  Stack,
  Text,
  CardRoot,
  Input,
  Flex,
  Button,
} from "@chakra-ui/react";
import { MdModeEdit } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { CustomerRequest, RideEstimate } from "../../types/rideTypes";
import { formatDuration } from "../../utils/rideInfoUtils";

interface RideInfoCardProps {
  customerRequest: CustomerRequest;
  rideInfo: RideEstimate;
  retryRide: (customerRequest: CustomerRequest) => Promise<void>;
}

const RideInfoCard: React.FC<RideInfoCardProps> = ({
  rideInfo,
  customerRequest,
  retryRide,
}) => {
  const [origin, setOrigin] = useState(customerRequest.origin);
  const [destination, setDestination] = useState(customerRequest.destination);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleRideUpdate = async () => {
    await retryRide({
      customer_id: customerRequest.customer_id,
      destination,
      origin,
    });
    setIsEditing(!isEditing);
  };

  return (
    <CardRoot>
      <CardBody>
        <Stack>
          <Text fontSize="xl" fontWeight="bold">
            Detalhes da Viagem
          </Text>
          {isEditing ? (
            <>
              <Flex align="center">
                <Text flexShrink={0} width="100px">
                  Origem:
                </Text>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </Flex>
              <Flex align="center">
                <Text flexShrink={0} width="100px">
                  Destino:
                </Text>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Flex>
            </>
          ) : (
            <>
              <Text>Origem: {origin}</Text>
              <Text>Destino: {destination}</Text>
            </>
          )}
          <Text>
            Distância: {(rideInfo.distance / 1000).toFixed(2).replace(".", ",")}{" "}
            km
          </Text>
          <Text>Tempo Estimado: {formatDuration(rideInfo.duration)}</Text>
          <Flex justifyContent={"flex-end"} gap={"2"}>
            {isEditing && (
              <Button
                bgColor={isEditing ? "gray.600" : "gray"}
                onClick={toggleEdit}
              >
                Cancelar
              </Button>
            )}
            <Button
              bgColor={isEditing ? "blue.700" : "gray"}
              onClick={isEditing ? handleRideUpdate : toggleEdit}
            >
              {isEditing ? (
                <>
                  <GrUpdate />
                  Atualizar
                </>
              ) : (
                <>
                  <MdModeEdit />
                  Editar
                </>
              )}
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </CardRoot>
  );
};

export default RideInfoCard;
