import {
  NativeSelectField,
  NativeSelectRoot,
} from "@chakra-ui/react";
import { useState } from "react";

interface DriverSelectProps {
    driverId: number; 
    setDriverId: React.Dispatch<React.SetStateAction<number>>; 
  }

const DriverSelect: React.FC<DriverSelectProps> = ({driverId, setDriverId}) => {
  return (
    <NativeSelectRoot>
      <NativeSelectField
        width="100%"
        value={driverId}
        defaultValue={driverId}
        onChange={(e) => setDriverId(+e.currentTarget.value)}
      >
        <option value={0}>Todos</option>
        <option value={1}>Homer Simpson</option>
        <option value={2}>Dominic Toretto</option>
        <option value={3}>James Bond</option>
      </NativeSelectField>
    </NativeSelectRoot>
  );
};

export default DriverSelect;
