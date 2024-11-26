import React from 'react';
import { useLocation } from 'react-router-dom';
import { CustomerRequest, RideEstimate } from '../../types/rideTypes';
import { RideMap } from '../../components/RideMap';

type RideConfirmationState = {
    customerRequest: CustomerRequest
    rideInfo: RideEstimate;
  };

const RideConfirmation: React.FC = () => {
  const location = useLocation();
  const state = location.state as RideConfirmationState;

  if (!state) {
    return <p>Informações da corrida não disponíveis.</p>;
  }

  console.log(state)

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Ride Confirmation</h1>
      <RideMap rideRoute={state.rideInfo} />
    </div>
  );
};

export default RideConfirmation;