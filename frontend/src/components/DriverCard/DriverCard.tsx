import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
} from "@chakra-ui/react";
import { Driver } from "@/types/rideTypes";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import PopoverCustom from "@/components/DriverCard/PopoverCustom";

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
      <Flex gap={2}>
        <Flex my={4} alignItems="center" justifyContent="start">
          <Avatar size="md" name={driver.name} src={""} />
          <Flex pl="4" fontSize="sm" flexDirection="column" alignItems="start">
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">
                {driver.name}{" "}
                <PopoverCustom
                  text={driver.description}
                  name={driver.name}
                  messageMode={true}
                />
              </Text>
              <HStack>
                <Text>Avaliação:</Text>
                <Badge colorScheme="yellow">
                  <Rating
                    size={"xsm"}
                    defaultValue={+driver.review.rating.toFixed(1)}
                    readOnly
                  />
                </Badge>
                <PopoverCustom text={driver.review.comment} />
              </HStack>
            </VStack>
          </Flex>
        </Flex>
        <Flex
          flexDirection={"column"}
          align={"center"}
          borderColor={"black"}
          bgColor={"gray.100"}
          borderRadius={"md"}
          padding={"2"}
          justifyContent={"space-evenly"}
        >
          <Text mb="2" borderColor={"black"}>
            <Text fontWeight={"bold"}>Preço:</Text>{" "}
            <Text>R$ {driver.value.toFixed(2).replace(".", ",")}</Text>
          </Text>
          <Button onClick={() => confirmRide(driver)}>Escolher</Button>
        </Flex>
      </Flex>

      <Text>
        <strong>Veículo:</strong> {driver.vehicle}
      </Text>
    </Box>
  );
};

export default DriverCard;
