const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/users');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.getUserById);
//router.get('/user/:username', AuthHelper.VerifyToken, UserCtrl.getUserByUsername); why cannot user route '/user/:username' ?
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.getUserByUsername);

router.post('/user/view-profile', AuthHelper.VerifyToken, UserCtrl.viewProfile);
router.post('/change-password', AuthHelper.VerifyToken, UserCtrl.changePassword);
module.exports = router;