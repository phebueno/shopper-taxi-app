import { useState } from "react";
import api from "../../services/api";
import { RideMap } from "../../components/RideMap";
import { useNavigate } from "react-router-dom";
import { CustomerRequest } from "../../types/rideTypes";

const Dashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [rideRoute, setRideRoute] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        customer_id: customerId,
        origin,
        destination,
      } as CustomerRequest;

      const response = await api.post("/ride/estimate", payload);
      setRideRoute(response.data);
      setTimeout(() => {
        console.log("Rota encontrada!");
        navigate(`/ride/confirm`, {
          state: {
            customerRequest: payload,
            rideInfo: response.data,
          },
        });
      }, 3000);
    } catch (error) {
      console.error("Erro ao buscar a rota:", error);
    }
  };
  return (
    <>
      <h1>Shopper Taxi</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Digite seu ID de usuário"
          />
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Digite a origem"
          />
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Digite o destino"
          />
          <button type="submit">Buscar Rota</button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
