const asyncHandler = require('express-async-handler')
const Chat = require('../database/models/chatModel')
const User = require('../database/models/userModel')


const accessChat = asyncHandler(async (req,res)=>{
//creating one on one chat if it doesnt exist with the current user id.
//else fetch chats with that user id.

const {userId} = req.body

if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}}, //for checking if both users exists in a chat.
        {users:{$elemMatch:{$eq:userId}}}
    ]
  }).populate("users","-password").populate("latestMessage")
//now,latest message contains ref of message model thus to populate that.

  isChat = await User.populate(isChat,{
    path: 'latestMessage.sender',
    select: "name pic email"
  })

  if(isChat.length>0){
    res.send(isChat[0])
  }else{
    //else creating a new chat with the two users
    let chatData = {
        chatName:"sender",
        users:[req.user._id,userId]
    }

    try {
        const createdChat = await Chat.create(chatData)
        const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")

        res.status(200).send(fullChat)
        
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
  }
})

const fetchChats = asyncHandler(async(req,res)=>{
    //going through array of users in chat model and finding each chat where current user is part of.

    try {
       let allChats = await Chat.find({users:{$elemMatch: {$eq : req.user._id}}})
       .populate("users","-password")
       .populate("latestMessage")
         .sort({updatedAt:-1})
    
        // allChats = await User.populate(allChats,{
        //     path : "latestMessage.sender",
        //     select: "name email pic"
    
    //    })
       res.status(200).send(allChats)
        
       
    } catch (error) { 
        res.status(400)
        throw new Error(error.message)
    }

})

module.exports = {accessChat,fetchChats}