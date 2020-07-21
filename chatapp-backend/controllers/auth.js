const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs'); // generate hash password
const jwt = require('jsonwebtoken');

const User = require('../models/userModels');
const Helpers = require('../Helpers/helpers');
const secretConfig = require('../config/secret');

module.exports = {
    //handle signup request send from client
    CreateUser(req, res) {
        //valid user input data by Joi API
        const schema = Joi.object().keys({
            username: Joi.string()
            .min(3)
            .max(30)
            .required(),
            email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string()
            .min(5)
            .required()
        });

        const { error, value } = schema.validate(req.body);
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        // check if eamil and username is already existing
        const userEmail = /*await*/ User.findOne({email: Helpers.lowerCase(req.body.email)});
        if(userEmail != null){
            return res.status(HttpStatus.CONFLICT).json({message:'email already exist'});
        }

        const userName = /*await*/ User.findOne({
            username: Helpers.firstUpper(req.body.username)
        });
        if(userName) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Username already exist' });
        }
        //generate the hash password according user password
        bcrypt.hash(value.password, 9, function(err, hash) {
            if(err){
                return res.status(HttpStatus.BAD_REQUEST).json({message: 'error hashing password'});
            }
            const body = {
                username: Helpers.firstUpper(value.username),
                password: hash,
                email: Helpers.lowerCase(value.email)
            };
            User.create(body)
            .then(user => {
                //create json web token for authrizted user
                const token = jwt.sign({data: user}, secretConfig.jsonSecret, {
                    expiresIn: "100000"
                });

                res.status(HttpStatus.CREATED).json({message: 'User has been created successfully', user, token});
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'server error!'});
            });
        });
    },

    //handle login request send from client asynchronizally 
    async Login(req, res){
        if(!res.body.username||!res.body.password){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'no empty is allowed!'});
        }

        await User.findOne({username: Helpers.firstUpper(res.body.username)}).then(user => {
            //respond error message when client does not input username or password
            if(!user){
                return res.status(HttpStatus.NOT_FOUND).json({message: 'no such user!'});
            }

            //compare wether the password is correct (hash compare)
            return bcrypt.compare(req.body.password, user.password).then(result => {
                if(!result){
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'password is incorrect!'});
                }
                // if username and password correct, generate a token for that client
                const token = jwt.sign({data: user}, secretConfig.jsonSecret, {expiresIn:1000});
                res.cookie('auth', token);
                return res.status(HttpStatus.OK).json({message: 'Login successfully!', user, token });
            });
        }).catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured!'});
        });

    }

};