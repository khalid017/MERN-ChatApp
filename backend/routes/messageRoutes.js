const express = require('express')
const authorize = require('../middleware/authMiddleware')
const {sendMessage,allMessages} = require('../controllers/messageControllers')
const router = express.Router()

router.route('/').post(authorize,sendMessage) // for sending messages

router.route('/:chatId').get(authorize,allMessages)//for getting all messages for a chat.


module.exports = router