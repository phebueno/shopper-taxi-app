import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerRequest, Driver, RideEstimate } from "../../types/rideTypes";
import { RideMap } from "../../components/RideMap";
import { DriverCard } from "../../components/DriverCard";
import api from "../../services/api";
import { Box } from "@chakra-ui/react";
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
    return <p>Informações da corrida não disponíveis.</p>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Confirmação de Corrida</h1>
      <Box mb={6}>
        <RideInfoCard
          rideInfo={rideInfo}
          customerRequest={customerRequest}
          retryRide={retryRide}
        />
      </Box>
      <RideMap rideRoute={rideInfo} />
      {rideInfo.options.length > 0 ? (
        rideInfo.options.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            confirmRide={confirmRide}
          />
        ))
      ) : (
        <p>Não há motoristas disponíveis para a rota!</p>
      )}
    </div>
  );
};

export default RideConfirmation;
