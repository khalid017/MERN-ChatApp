
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import { ChatState } from '../../Context/ChatProvider'


import io from 'socket.io-client'
let socket
const ENDPOINT = "http://localhost:3000"
 

const SingleChat = ({ flip }) => {
  const {user,selectedChat,setSelectedChat} = ChatState()

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");//for typed msg
  const toast = useToast();

//for starting socket
useEffect(()=>{
  socket = io(ENDPOINT)
  //for joining room
  socket.emit("setup",user)

},[])

  //msg typing handler
  const handler = (e)=>{
    setNewMessage(e.target.value);
  }

  //sending message handler //call fun inside effect
  //send msg socket.
  const sendMessage = async(event)=>{
    if (event.key === "Enter" && newMessage) {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          //sending msg to api
          const { data } = await axios.post( //creating new msg
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          //emitting send msg event with data=msg content and chat ki id
          socket.emit("send message", data)
          setMessages([...messages, data])//updating msg state

        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        }
      }
    }


    //fetching all messeges of a chat handler
    //socket for joining chat
    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          setLoading(true);
    
          const { data } = await axios.get(
            `/api/message/${selectedChat._id}`,
            config
          );
          setMessages(data); //updating state with all messeges.
          setLoading(false);

           socket.emit("join chat", selectedChat._id);


        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
//effect to get all msgs when chat selected
      useEffect(()=>{
        fetchMessages()
      },[selectedChat])

      //receving msg from server through socket and reloading my chats
      useEffect(()=>{
        socket.on("message received",(receivedMessage)=>{
          setMessages([...messages,receivedMessage])
          flip()
        })
      })

  return  <>
  {selectedChat ? (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
        />
        {messages &&
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModal
                user={getSenderFull(user, selectedChat.users)}
              />
            </>
      
          }
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/* if messags loading */}
        {loading ? (
          <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          />
        ) : ( 
            // else load scrollable chat with user
          <div className="messages">
            <ScrollableChat messages={messages} />
          </div>
        )}

        <FormControl
          onKeyDown={sendMessage}
          id="first-name"
          isRequired
          mt={3}
        >
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            onChange={handler}
            value={newMessage}
          />
        </FormControl>
      </Box>
    </>
  ) : (
    //no user seleted to chat
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
      </Text>
    </Box>
  )}
</>

}

export default SingleChat
