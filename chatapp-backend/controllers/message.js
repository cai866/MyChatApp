const User = require('../models/userModels');
const Message = require('../models/messageModels');
const Conversation = require('../models/conversationModels');
const Helper = require('../Helpers/helpers');

module.exports = {

    async getAllMessages(req, res) {

    },

    async markAllMessages(req, res) {
        const { sender, receiver } = req.params;
        const msg = await Message.aggregate([
            {$match: {'message.receivername': req.user.username}},
            {$unwind: '$message'},
            {$match: {'message.receivername': req.user.username}},
        ]);

        if(msg.length > 0){
            try {
                msg.forEach(async value => {
                    await Message.update(
                        {
                            'message._id': value.message._id
                        },
                        { $set: { 'message.$.isRead': true }}
                    );
                });
                res.status(HttpStatus.OK).json({message:'All messages marked as read!'});
            } catch (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({message:'Error occured!'});
            }
        }
    },

    async markReceiverMessage(req, res) {
        const { sender, receiver } = req.params;
        const msg = await Message.aggregate([
            {$unwind: '$message'},
            {
                $match: {
                    $and: [
                        {
                           'message.sendername': receiver, 'message.receivername': sender 
                        }
                    ]
                }
            }
        ]);

        if(msg.length > 0){
            try {
                msg.forEach(async value => {
                    await Message.update(
                        {
                            'message._id': value.message._id
                        },
                        { $set: { 'message.$.isRead': true }}
                    );
                });
                res.status(HttpStatus.OK).json({message:'Message marked as read!'});
            } catch (error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({message:'Error occured!'});
            }
        }
    },
    
    sendMessage(req, res) {
        const { senderId, receiverId } =req.params;

        Conversation.find({
            $or: [
                {participants:{$elemMatch: { senderId: sender_Id, receiverId: receiver_Id }}},
                {participants:{$elemMatch: { senderId: receiver_Id, receiverId: sender_Id }}}
            ]
        }, async (err, result) => {
            if(result.length>0){
                const msg = await Message.findOne({conversationId: result[0]._id});
                Helper.updateChatList(req, msg);
                await Message.update(
                    {
                        conversationId: result[0]._id
                    },
                    {
                        $push: {
                            message: {
                                senderId: req.user._id,
                                receiverId: req.params.receiver_Id,
                                sendername: req.user.username,
                                receivername: req.body.receiverName,
                                body: req.body.message
                            }
                        }
                    }
                )
                .then(() => {
                    res.status(HttpStatus.OK).json({message:'Message has been sent!'});
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({message:'Error occured!'});
                });

            }else{
                const newConversation = new Conversation();
                newConversation.participants.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id
                });
                const saveConversation = await newConversation.save();
                
                const newMessage = new Message();
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.user.username;
                newMessage.receiver = req.body.receiverName;
                newMessage.message.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id,
                    sendername: req.user.username,
                    receivername: req.body.receiverName,
                    body: req.body.message
                });

                //update sender's chatlist
                await User.update(
                    {
                        _id: req.user._id
                    },
                    {
                        $push: {
                            chatList: {
                                $each: [
                                    {
                                        receiverId: req.params.receiver_Id,
                                        msgId: newMessage._id
                                    }
                                ],
                                $position: 0
                            }
                        }
                    }
                );

                //update receiver's chatlist
                await User.update(
                    {
                        _id: req.params.receiver_Id
                    },
                    {
                        $push: {
                            chatList: {
                                $each: [
                                    {
                                        receiverId: req.user._id,
                                        msgId: newMessage._id
                                    }
                                ],
                                $position: 0
                            }
                        }
                    }
                );

                await newMessage
                .save()
                .then(() => {
                    res.status(HttpStatus.OK).json({message:'Message has been sent!'});
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({message:'Error occured!'});
                });
            }
         }
        );
    }
};