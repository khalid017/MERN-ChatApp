const asyncHandler = require('express-async-handler')
const User = require('../database/models/userModel')
const Chat = require('../database/models/chatModel')
const Message = require('../database/models/messageModel')
const sendMessage = asyncHandler(async(req,res)=>{
    //here we need message body, who to send and sender name.

    const { content,chatId} = req.body

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }

       let newMessage = {
        sender: req.user._id,// id from logged in user
        content:content,
        chat:chatId
       }

       try {
        //creating message in db

      let message = await Message.create(newMessage)

      //now populating fields
      message = await message.populate("sender","name pic")

      message = await message.populate("chat")

      message = await User.populate(message,{
        path:"chat.users",
        select:"name email pic"
      })

      // Updating latest message
        await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message})

        res.json(message)
        
       } catch (error) {
        res.status(400)
        throw new Error(error.message)
       }
}) 

const allMessages = asyncHandler(async(req,res)=>{
    try {
        //fetching all messages with chatId

        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name email pic")
        .populate("chat")

        res.json(messages)
         
        
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
        
    }

})

module.exports = {sendMessage,allMessages}