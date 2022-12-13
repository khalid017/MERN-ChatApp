const express = require('express')
const authorize = require('../middleware/authMiddleware')
const {accessChat,fetchChats} = require('../controllers/chatControllers')
const router = express.Router()

router.route('/').post(authorize, accessChat) //create Chat if doesnt exist,else access.

.get(authorize,fetchChats) //fetching all chats for a loggedin user.


module.exports = router