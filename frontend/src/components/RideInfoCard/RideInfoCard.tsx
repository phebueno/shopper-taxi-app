import React, { useState } from "react";
import {
  CardBody,
  Stack,
  Text,
  CardRoot,
  Flex,
  Button,
  Editable,
  Box,
  Heading,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { MdModeEdit } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { CustomerRequest, RideEstimate } from "@/types/rideTypes";
import { formatDuration } from "@/utils/rideInfoUtils";
import { defaultErrorToast } from "@/errors/toastErrors";
import { toaster } from "@/components/ui/toaster";

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
  const [isLoading, setIsLoading] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleRideUpdate = async () => {
    setIsLoading(true);
    try {
      await retryRide({
        customer_id: customerRequest.customer_id,
        destination,
        origin,
      });
    } catch (error) {
      console.log(error)
    } finally {
      setIsEditing(!isEditing);
      setIsLoading(false);
    }
  };

  const allowEditing = async () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  return (
    <CardRoot position="relative" aria-busy="true" userSelect="none">
      {isLoading && (
        <Box pos="absolute" inset="0" bg="bg/80">
          <Center h="full">
            <Spinner color="teal.500" size={"xl"} />
          </Center>
        </Box>
      )}
      <CardBody>
        <Stack>
          <Text fontSize="xl" fontWeight="bold">
            Detalhes da Viagem
          </Text>
          <Flex alignItems={"center"}>
            <Text fontSize={"md"} fontWeight={"medium"}>
              Origem:
            </Text>
            <Editable.Root
              fontSize={"md"}
              borderRadius={"sm"}
              value={origin}
              onValueChange={(e) => setOrigin(e.value)}
              edit={isEditing}
              bgColor={isEditing ? "gray.100" : ""}
              onSubmit={handleRideUpdate}
              onClick={allowEditing}
              opacity={isLoading ? 0.3 : 1}
            >
              <Editable.Preview />
              <Editable.Input />
            </Editable.Root>
          </Flex>
          <Flex alignItems={"center"}>
            <Text fontSize={"md"} fontWeight={"medium"}>
              Destino:
            </Text>
            <Editable.Root
              fontSize={"md"}
              borderRadius={"sm"}
              value={destination}
              onValueChange={(e) => setDestination(e.value)}
              edit={isEditing}
              bgColor={isEditing ? "gray.100" : ""}
              onSubmit={handleRideUpdate}
              onClick={allowEditing}
              opacity={isLoading ? 0.3 : 1}
            >
              <Editable.Preview />
              <Editable.Input />
            </Editable.Root>
          </Flex>
          <Flex justifyContent={"space-between"}>
            {" "}
            <Flex gap={"10"} maxW={"50%"}>
              <Flex flexDir={"column"} alignItems={"center"} width={"25%%"}>
                <Text fontWeight={"medium"}>Distância:</Text>
                <Text>
                  {(rideInfo.distance / 1000).toFixed(2).replace(".", ",")} km
                </Text>
              </Flex>
              <Flex flexDir={"column"} alignItems={"center"} width={"25%%"}>
                <Text fontWeight={"medium"}>Tempo Estimado</Text>
                <Text>{formatDuration(rideInfo.duration)}</Text>
              </Flex>
            </Flex>
            <Flex justifyContent={"flex-end"} gap={"2"}>
              {isEditing && (
                <Button
                  bgColor={isEditing ? "gray.600" : "gray"}
                  onClick={toggleEdit}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                bgColor={isEditing ? "blue.700" : "gray"}
                onClick={isEditing ? handleRideUpdate : toggleEdit}
                disabled={isLoading}
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
          </Flex>
        </Stack>
      </CardBody>
    </CardRoot>
  );
};

export default RideInfoCard;
