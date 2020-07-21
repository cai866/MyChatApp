const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/auth');

router.post('/register', AuthCtrl.CreateUser);
router.post('/login', AuthCtrl.Login);

module.exports = router;