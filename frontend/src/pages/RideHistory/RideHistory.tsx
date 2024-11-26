import React, { useEffect, useState } from "react";
import { DriverRide } from "../../types/rideTypes";
import api from "../../services/api";
import { useParams } from "react-router-dom";

type RideHistoryResponse = {
  customer_id: string;
  rides: DriverRide[];
};

const RideHistory: React.FC = () => {
  const { customer_id } = useParams<{ customer_id: string }>();

  const [rideHistory, setRideHistory] = useState<RideHistoryResponse[]>([]);

  const fetchRideHistory = async (customerId?: string, driverId?: number) => {
    if (customerId) {
      const queryParams = new URLSearchParams();

      if (driverId !== undefined) {
        queryParams.append("driver_id", driverId.toString());
      }

      try {
        const response = await api.get(
          `/ride/${customerId}${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`
        );
        console.log(response.data);
        setRideHistory(response.data);
      } catch (error) {
        console.error("Erro ao buscar a rota:", error);
      }
    }
  };

  useEffect(() => {
    fetchRideHistory(customer_id);
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Ride History</h1>
    </div>
  );
};

export default RideHistory;
