const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    chatName:{type:String,required:true ,trim:true}, //trim removes white spaces
    latestMessage:{type:mongoose.Schema.Types.ObjectId,
    ref:"message"},
    users:[
        {type:mongoose.Schema.Types.ObjectId, // it will contain id of the user in chat
            ref:"user"} // reference to user model for getting id 
    ],
}, {timestamps:true})

const chatModel = mongoose.model("chat",chatSchema)

module.exports = chatModel