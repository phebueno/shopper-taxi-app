import { Text, IconButton } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdOutlineManageSearch } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";

interface PopoverCustomProps {
  text: string;
  messageMode?: boolean;
  name?: string
}

const PopoverCustom: React.FC<PopoverCustomProps> = ({ text, messageMode, name }) => {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <IconButton size="xs" variant="outline" bgColor="white">
          {messageMode ? <TbMessageReport /> : <MdOutlineManageSearch />}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle fontWeight="medium">
          {messageMode ? `${name} enviou uma mensagem:` : `Ultima review:`}
          </PopoverTitle>
          <Text my="4">{text}</Text>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default PopoverCustom;
