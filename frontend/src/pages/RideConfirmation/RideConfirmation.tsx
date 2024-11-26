import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerRequest, Driver, RideEstimate } from "../../types/rideTypes";
import { RideMap } from "../../components/RideMap";
import { DriverCard } from "../../components/DriverCard";
import api from "../../services/api";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { RideInfoCard } from "../../components/RideInfoCard";

type RideConfirmationState = {
  customerRequest: CustomerRequest;
  rideInfo: RideEstimate;
};

const RideConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RideConfirmationState;

  const [customerRequest, setCustomerRequest] = useState(state.customerRequest);
  const [rideInfo, setRideInfo] = useState(state.rideInfo);

  const retryRide = async (customerRequest: CustomerRequest) => {
    try {
      const payload = customerRequest;
      setCustomerRequest(customerRequest);

      const response = await api.post("/ride/estimate", payload);
      setRideInfo(response.data);
    } catch (error) {
      console.error("Erro ao buscar a rota:", error);
    }
  };

  const confirmRide = async (driver: Driver) => {
    try {
      const payload = {
        ...customerRequest,
        distance: rideInfo.distance,
        duration: rideInfo.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      };

      const response = await api.patch("/ride/confirm", payload);
      console.log(response.data);
      navigate(`/ride/history/${state.customerRequest.customer_id}`);
    } catch (error) {
      console.error("Erro ao buscar a rota:", error);
    }
  };

  if (!state) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" fontWeight="bold" color="red.500">
          Informações da corrida não disponíveis.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="container.lg" mx="auto" py={8} px={4}>
      <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
        Confirmação de Corrida
      </Heading>
      <VStack align="stretch">
        <RideInfoCard
          rideInfo={rideInfo}
          customerRequest={customerRequest}
          retryRide={retryRide}
        />
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          overflow="hidden"
          boxShadow="md"
        >
          <RideMap rideRoute={rideInfo} />
        </Box>
        <Box>
          {rideInfo.options.length > 0 ? (
            <VStack>
              {rideInfo.options.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  confirmRide={confirmRide}
                />
              ))}
            </VStack>
          ) : (
            <Text
              fontSize="lg"
              fontWeight="medium"
              color="gray.600"
              textAlign="center"
            >
              Não há motoristas disponíveis para a rota!
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default RideConfirmation;
