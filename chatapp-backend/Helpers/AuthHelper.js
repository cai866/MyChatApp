const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

const secretConfig =require('../config/secret');

module.exports = {
    VerifyToken: (req, res, next) => {
        if(!req.headers.authorization){
            res.status(HttpStatus.UNAUTHORIZED)
                .json({message: 'No Authorization!'});
        }
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
        //if node token, refuse user's operation
        if(!token){
            return res.status(HttpStatus.FORBIDDEN).json({message: 'unauthrizated user!'});
        }

        return jwt.verify(token, secretConfig.jsonSecret, (err, decoded) => {
            if(err){
                if(err.expiredAt < new Date()) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        message:'Token expired! Please login again',
                        token:null
                    });
                }
                next();
            }
            req.user = decoded.data;
            next();
        });
    }
};