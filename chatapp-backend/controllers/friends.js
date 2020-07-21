const HttpStatus = require('http-status-codes');
const User =require('../models/userModels');
const posts = require('./posts');

module.exports = {
    //follow other user method
    async followUser(req, res) {
        const followuser = async () => {

            //update the information of the user who follow others
            await User.update({
                _id: req.user._id,
                'following.userFollowed': { $ne: req.body.userFollowed }
            },
            {
                $push: {
                    following: {
                        userFollowed:req.body.userFollowed
                    }
                }
            });
            // update followed user data
            await User.update({
                _id: req.body.userFollowed,
                'following.follower': { $ne: req.user._id }
            },
            {
                $push: {
                    followers: {
                        follower:req.user._id
                    },
                    notifications: {
                        senderId: req.user._id,
                        message: '${req.user.username} followed you!',
                        created: new Date(),
                        viewProfile: false
                    }
                }
            });
        }
        // respond message back to client
        followuser()
        .then(() => {
            res.status(HttpStatus.OK).json({message:'Following this user successfully!'});
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message:'Error occured!'});
        });
    },

    // unfollowing user method
    async unFollowUser(req, res) {
        const unFollowuser = async () => {

            //update the information of the user who unfollow others
            await User.update({
                _id: req.user._id
            },
            {
                $pull: {
                    following: {
                        userFollowed:req.body.userFollowed
                    }
                }
            });
            // update unfollowed user data
            await User.update({
                _id: req.body.userFollowed
            },
            {
                $pull: {
                    followers: {
                        follower:req.user._id
                    }
                }
            });
        }
        // respond message back to client
        unFollowuser()
        .then(() => {
            res.status(HttpStatus.OK).json({message:'unFollowing this user successfully!'});
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message:'Error occured!'});
        });
    },

    async markNotification (req, res) {
        if(!req.body.deleteVal){
            await User.updateOne({
                _id: req.user._id,
                'notifications._id': req.params.id
            },
            {
                $set: { 'notifications.$.read': true }
            })
            .then(() => {
                res.status(HttpStatus.OK).json({message:'Mark this notification as read!'});
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({message:'Error occured!'});
            });
        }else{
            await User.update({
                _id: req.user._id,
                'notifications._id': req.params.id
            },
            {
                $pull: { notifications: { _id: req.params.id } }
            })
            .then(() => {
                res.status(HttpStatus.OK).json({message:'delete successfully!'});
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({message:'Error occured!'});
            });
        }
    },

    async markAllNotifications(req, res) {
        await User.update({
            _id: req.user._id
        },
        {
            $set: { 'notifications.$[elem].read': true }
        },
        {
            arrayFilters: [{'elem.read': false }],
            multi: true
        }
        )
        .then(() => {
            res.status(HttpStatus.OK).json({message:'Mark all successfully!'});
        })
        .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message:'Error occured!'});
        });
    }
};