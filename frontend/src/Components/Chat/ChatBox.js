import { Box } from "@chakra-ui/layout";
import "./styles.css";
import Chat from "./Chat";
import { ChatState } from "../../Context/ChatProvider";

const Chatbox = ({flip}) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Chat flip={flip}/>
    </Box>
  );
};

export default Chatbox;