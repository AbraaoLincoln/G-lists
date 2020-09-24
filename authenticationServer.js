const express = require('express');
const app = express();

//Object needed to do the authetication.
require("dotenv").config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Connecting to the database
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

//Require userSchema
const User = require('./schemas/userSchema');

//Middleware
app.use(express.json());

//Seting up the routes
app.post('/login', (req, res) => {
    //Verifying the name and password of user.
    //todo

    //Genereting user access token
    const userName = { name: req.body.name };
    const userToken = jwt.sign(userName, process.env.ACESS_TOKEN) //Create a hash with the secret key and user name.
    res.cookie("jwt-token", userToken, {httpOnly: true});
    //res.json({token: userToken});
})

app.post('/createAcount', (req, res) => {
    let userName = req.body.name;
    let userPassword = req.body.password;
    let userNamePasswordIsValid = true;

    if(userNamePasswordIsValid){
        //Hashign password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) consolo.log('Error na geração do salt', err);
            bcrypt.hash(userPassword, salt, (err, hash) => {
                if (err) consolo.log('Error no hashing do salt', err);
                const newUser = new User({name: userName, password: hash})
                newUser.save((err, newUser) => { if(err) console.log(err) });
                res.json({ "status": "ok"})
            })
        })
    }
})

app.listen(4000, () => {console.log("Authetication server runing...")});
