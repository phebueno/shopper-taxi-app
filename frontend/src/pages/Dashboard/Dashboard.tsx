import { useState } from "react";
import api from "../../services/api";
import { RideMap } from "../../components/RideMap";

const Dashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [rideRoute, setRideRoute] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/ride/estimate", {
        customer_id: customerId,
        origin,
        destination,
      });
      console.log("Dados da rota:", response.data);
      setRideRoute(response.data);
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
        <RideMap rideRoute={rideRoute} />
      </div>
    </>
  );
};

export default Dashboard;
