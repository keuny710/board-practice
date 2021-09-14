const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
    .then(()=>{
        console.log('DB is connected...');
    });

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.listen(9006, ()=>{
    console.log('Server has been connected');
});