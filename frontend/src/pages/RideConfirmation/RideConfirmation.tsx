import React from "react";
import { useLocation } from "react-router-dom";
import { CustomerRequest, Driver, RideEstimate } from "../../types/rideTypes";
import { RideMap } from "../../components/RideMap";
import { DriverCard } from "../../components/DriverCard";
import api from "../../services/api";

type RideConfirmationState = {
  customerRequest: CustomerRequest;
  rideInfo: RideEstimate;
};

const RideConfirmation: React.FC = () => {
  const location = useLocation();
  const state = location.state as RideConfirmationState;

  if (!state) {
    return <p>Informações da corrida não disponíveis.</p>;
  }

  const confirmRide = async (driver: Driver) => {
    try {
      const payload = {
        ...state.customerRequest,
        distance: state.rideInfo.distance,
        duration: state.rideInfo.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      };

      const response = await api.patch("/ride/confirm", payload);
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar a rota:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Ride Confirmation</h1>
      <RideMap rideRoute={state.rideInfo} />
      {state.rideInfo.options.length > 0 ? (
        state.rideInfo.options.map((driver) => (
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
