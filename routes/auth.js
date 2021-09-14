const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { accessTokenSign, refreshTokenSign } = require('../jwt-utils');

//REGISTER
router.post('/register', async (req, res)=>{
    if(req.body.username) {
        if(req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
            try {
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                });
                const user = await newUser.save();
                res.status(201).json(user);
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(500).json('fill in password')
        }
    } else {
        res.status(500).json('fill in username');
    }
});
//LOGIN
router.post('/login', async (req, res)=>{
    try {
        const user = await User.findOne(req.body.username);
        if(!user) {
            res.status(401).json('wrong username');
        }
        const decodedUserPassword = CryptoJS.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if(req.body.password !== decodedUserPassword) {
            res.status(401).json('wrong password');
        }
        const accessToken = accessTokenSign(user);
        const refreshToken = refreshTokenSign();
        const { password, ...info } = user._doc;
        res.status(200).json({...info, accessToken, refreshToken});
    } catch(err) {
        res.status(500).json(err);
    }
});