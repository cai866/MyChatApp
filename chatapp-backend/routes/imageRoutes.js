const express = require('express');
const router = express.Router();

const ImageCtrl = require('../controllers/images');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/upload-image', AuthHelper.VerifyToken, ImageCtrl.uploadImage);
router.get('/set-default-image', AuthHelper.VerifyToken, ImageCtrl.setDefaultImage);
module.exports = router;