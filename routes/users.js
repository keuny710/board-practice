const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const { verify } = require('../verifyToken');
const { json } = require('express');

//UPDATE
router.put('/:id', verify, async (req, res)=>{
    if(req.params.id === req.user.username || req.user.isAdmin) {
        if(req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedUser);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you are not allowed');
    }
});

//DELETE
router.delete('/:id', verify, async (req, res)=>{
    if(req.params.id === req.user.username || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.user.id);
            res.status(200).json('user is deleted');
        } catch(err) {
           res.status(500).json(err);
        }
    } else {
        res.status(403).json('you are not allowed');
    }
});

//GET USER
router.get('/:id', verify, async (req, res)=>{
    if(req.params.id === req.user.username || req.user.isAdmin) {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch(err) {
           res.status(500).json(err);
        }
    } else {
        res.status(403).json('you are not allowed');
    }
});

//GET ALL USERS
router.get('/', verify, async (req, res)=>{
    const query = req.query.new;
    if(req.user.isAdmin) {
        try {
            const users = query ? await User.find().limit(5) : await User.find();
            res.status(200).json(users);
        } catch(err) {
           res.status(500).json(err);
        }
    } else {
        res.status(403).json('you are not allowed');
    }
});