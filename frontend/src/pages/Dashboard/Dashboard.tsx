import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Text, VStack, Heading } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { CustomerRequest } from "@/types/rideTypes";
import { defaultErrorToast } from "@/errors/toastErrors";
import api from "@/services/api";

const Dashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !origin || !destination) {
      toaster.create({
        title: "Preencha todos os campos!",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const payload = {
        customer_id: customerId,
        origin,
        destination,
      } as CustomerRequest;
      setLoading(true);
      const response = api.post("/ride/estimate", payload);

      toaster.promise(response, {
        success: (data) => {
          setTimeout(() => {
            navigate(`/ride/confirm`, {
              state: {
                customerRequest: payload,
                rideInfo: data.data,
              },
            });
          }, 1500);
          return {
            title: "Rota encontrada",
            description: "Confira os motoristas disponíveis!",
            duration: 3000,
          };
        },
        error: (error) => defaultErrorToast(error),
        loading: {
          title: "Calculando rota...",
          description: "Por favor, aguarde um momento.",
        },
        finally: () => setLoading(false),
      });
    } catch (error) {
      console.error("Erro ao buscar a rota:", error);
    }
  };

  return (
    <Box maxW="lg" mx="auto" py={8} px={4}>
      <Heading as="h1" size="lg" textAlign="center" mb={8} color="teal.500">
        Shopper Taxi
      </Heading>
      <Box
        bg="white"
        boxShadow="md"
        borderRadius="md"
        p={6}
        border="1px solid"
        borderColor="gray.200"
      >
        <form onSubmit={handleSubmit}>
          <VStack>
            <Box width={"100%"}>
              <Text mb={1} fontWeight="bold">
                ID do Usuário
              </Text>
              <Input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Digite seu ID de usuário"
                borderColor="gray.300"
              />
            </Box>

            <Box width={"100%"}>
              <Text mb={1} fontWeight="bold">
                Origem
              </Text>
              <Input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Digite a origem"
                borderColor="gray.300"
              />
            </Box>
            <Box width={"100%"}>
              <Text mb={1} fontWeight="bold">
                Destino
              </Text>
              <Input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Digite o destino"
                borderColor="gray.300"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              disabled={!customerId || !origin || !destination || loading}
            >
              Buscar Rota
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Dashboard;
