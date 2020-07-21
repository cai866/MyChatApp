const express = require('express');
const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.unFollowUser);
router.post('/mark/:id', AuthHelper.VerifyToken, FriendCtrl.markNotification);
router.post('/mark-all', AuthHelper.VerifyToken, FriendCtrl.markAllNotifications);

module.exports = router;