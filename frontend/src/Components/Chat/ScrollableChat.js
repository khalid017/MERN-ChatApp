import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {useRef,useEffect} from "react"

import {
  messageMargin,
  isSameUser,
  messageAvatar,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";


const ScrollableChat = ({ messages }) => {
  const messagesEndRef = useRef(null)
  
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

//for scrolling to bottom of div when new msg pops.
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  const { user } = ChatState();



  return (
    <div style={{ overflowX: "hidden", overflowY: "auto" }}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {messageAvatar(messages,i) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: messageMargin(m.sender._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
          <div ref={messagesEndRef} />
    </div>
  );
};

export default ScrollableChat;









// (isSameSender(messages, m, i, user._id) || //put avatar at point where sender changes, or put at last msg of multiple msgs of same sender.
//               isLastMessage(messages, i, user._id))