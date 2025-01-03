import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { DriverRide } from "@/types/rideTypes";
import { RideCard } from "@/components/RideCard";
import DriverSelect from "./DriverSelect";
import api from "@/services/api";
import { toaster } from "@/components/ui/toaster";
import { defaultErrorToast } from "@/errors/toastErrors";

type RideHistoryResponse = {
  customer_id: string;
  rides: DriverRide[];
};

const RideHistory: React.FC = () => {
  const { customer_id } = useParams<{ customer_id: string }>();
  const [rideHistory, setRideHistory] = useState<RideHistoryResponse | null>();
  const [customerId, setCustomerId] = useState<string>(customer_id || "");
  const [driverId, setDriverId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRideHistory = async (customerId?: string, driverId?: number) => {
    if (customerId) {
      const queryParams = new URLSearchParams();

      if (driverId !== undefined && driverId !== 0) {
        queryParams.append("driver_id", driverId.toString());
      }

      try {
        setIsLoading(true);
        const response = await api.get(
          `/ride/${customerId}${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`
        );
        setRideHistory(response.data);
        setIsLoading(false);
        toaster.success({
          title: `${response.data?.rides.length} viagens encontradas!`,
        });
      } catch (error) {
        toaster.error(defaultErrorToast(error));
        console.error("Erro ao buscar a rota:", error);
        setRideHistory(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRideHistory(customer_id);
  }, []);

  const searchCustomerId = () => {
    if (customerId) {
      fetchRideHistory(customerId, driverId);
    }
  };

  return (
    <Box padding={6}>
      <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.500">
        Histórico de Viagens
      </Heading>
      <Box mb={4}>
        <Text>Pesquisar por outro ID de usuário:</Text>
        <Input
          type="text"
          placeholder="Digite o ID do usuário"
          value={customerId || ""}
          height={"10"}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <Box mb={4}>
          <Text mt={5}>Filtrar por Motorista:</Text>
          <Flex align={"center"} justifyContent={"space-between"} gap={"5"}>
            <DriverSelect driverId={driverId} setDriverId={setDriverId} />
            <Button bgColor={"black"} onClick={searchCustomerId}>
              Pesquisar
            </Button>
          </Flex>
        </Box>
      </Box>
      {rideHistory?.rides.length ? (
        rideHistory.rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} isLoading={isLoading} />
        ))
      ) : (
        <Text>Nenhuma viagem encontrada.</Text>
      )}
    </Box>
  );
};

export default RideHistory;
