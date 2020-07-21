const express = require('express');
const router = express.Router();

const MessageCtrl = require('../controllers/message');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCtrl.getAllMessage);

router.post('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCtrl.sendMessage);

router.post('/receiver-messages/:sender/:receiver', AuthHelper.VerifyToken, MessageCtrl.markReceiverMessage);

router.post('/mark-all-messages', AuthHelper.VerifyToken, MessageCtrl.markAllMessages);

module.exports = router;