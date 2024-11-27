import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { CustomerRequest, Driver, RideEstimate } from "@/types/rideTypes";
import { RideInfoCard } from "@/components/RideInfoCard";
import { RideMap } from "@/components/RideMap";
import { DriverCard } from "@/components/DriverCard";
import api from "@/services/api";
import { toaster } from "@/components/ui/toaster";
import { defaultErrorToast } from "@/errors/toastErrors";

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
      toaster.success({title:"Rota recalculada!"});
    } catch (error) {
      toaster.error(defaultErrorToast(error));
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

      const response = api.patch("/ride/confirm", payload);
      toaster.promise(response, {
        success: () => {
          setTimeout(() => {
            navigate(`/ride/history/${state.customerRequest.customer_id}`);
          }, 2500);
          return {
            title: "Seu motorista chegou!",
            description: "Boa viagem, e obrigado por escolher a ShopperTaxi!",
            duration: 2500,
          };
        },
        error: (error) => defaultErrorToast(error),
        loading: {
          title: "Seu motorista está a caminho!",
          description: "Por favor, se dirija ao local ponto de embarque.",
        },
        finally: () => {/*TODO setIsLoading false*/},
      });
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
