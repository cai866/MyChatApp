const HttpStatus = require('http-status-codes');
const User =require('../models/userModels');
const posts = require('./posts');
const moment = require('moment');

const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs'); // generate hash password

module.exports = {
    async getAllUsers(req, res) {
        await User.find({})
        .populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .populate('notifications.senderId')
        .then(result => {
            res.status(HttpStatus.OK).json({message: 'All users respond', result});
        })
        .catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured!'});    
        });
    },

    async getUser(req, res) {
        await User.findOne({_id: req.params.id})
        .populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        .populate('chatList.receiverId')
        .populate('chatList.msgId')
        .populate('notifications.senderId')
        .then(result => {
            res.status(HttpStatus.OK).json({message: 'Find user by id', result});
        })
        .catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured!'});    
        });
        
    },

    async viewProfile(req, res) {
        const dateValue = moment().format('YYYY-MM-DD');
        await User.update(
            {
                _id: req.body.id,
                'notifications.date': { $ne: [dateValue, ''] }, //check the date be not equal to dateValue and not be empty
                'notifications.senderId': { $ne: req.user._id }
            },
            {
                $push: {
                    notifications: {
                        senderId: req.user._id,
                        message: '${req.user.username} viewed your profile',
                        created: new Date(),
                        date: dateValue,
                        viewProfile: true
                    }
                }
            }
        );
    },

    async changePassword(req, res) {
        const schema = Joi.object().keys({
            cpassword: Joi.string().required(),
            newPassword: Joi.string()
            .min(5)
            .required(),
            confirmPassword: Joi.string()
            .min(5)
            .optional()
        });

        const { error, value } = schema.validate(req.body);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        const user = await User.findOne({_id: req.user._id});

         //compare wether the password is correct (hash compare)
         return bcrypt.compare(value.cpassword, user.password).then(async result => {
            if(!result){
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'password is incorrect!'});
            }
            
            const newpassword = await User.EncryptPassword(req.body.newPassword);
            await User.update({
                _id: req.user._id,
                
            },
            {
                password: newpassword
            })
            .then(() => {
                res.status(HttpStatus.OK).json({message:'password changed successfully!'});
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({message:'Error occured!'});
            });
        });

    }
};