import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Image,
  Button,
} from "@chakra-ui/react";
import { Driver } from "../../types/rideTypes";

type DriverProps = {
  driver: Driver;
  confirmRide: (driver: Driver) => void;
};

const DriverCard: React.FC<DriverProps> = ({ driver, confirmRide }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      boxShadow="md"
    >
      <Image src="" alt={`Foto de ${name}`} borderRadius="md" mb="4" />

      <Flex align="center" mb="4">
        <VStack align="start">
          <Text fontSize="lg" fontWeight="bold">
            {driver.name}
          </Text>
          <HStack>
            <Text>Rating:</Text>
            <Badge colorScheme="yellow">
              {driver.review.rating.toFixed(1)}
            </Badge>
          </HStack>
        </VStack>
      </Flex>

      <Text mb="2">
        <strong>Veículo:</strong> {driver.vehicle}
      </Text>

      <Text mb="2">
        <strong>Preço:</strong> {driver.value}
      </Text>

      <Text fontSize="sm" color="gray.600">
        {driver.description}
      </Text>
      <Button bgColor={"black"} onClick={() => confirmRide(driver)}>
        Escolher
      </Button>
    </Box>
  );
};

export default DriverCard;
