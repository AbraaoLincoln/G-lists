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
app.use(express.urlencoded({ extended: false })); //Used to parse the forms value to the body
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    /* res.setHeader('Access-Control-Allow-Methods', 'POST, GET'); */
    res.setHeader('Access-Control-Allow-Headers' , '*');
    /* res.setHeader('Access-Control-Max-Age', '86400'); */
    next();
})

//Seting up the routes
app.post('/login', (req, res) => {
    //Verifying the name and password of user.
    let authenticateUser = async () => {
        let useIsRegistred = await User.find({name: req.body.name});
        if(useIsRegistred){
            let userPassword = req.body.password;
            let userDatabasePassword = useIsRegistred[0].password;
            let passwordIsEqual = await bcrypt.compare(userPassword, userDatabasePassword);
            if(passwordIsEqual){
                //Genereting user access token
                const userName = { name: req.body.name };
                const userToken = jwt.sign(userName, process.env.ACESS_TOKEN) //Create a hash with the secret key and user name.
                res.cookie("jwt-token", userToken, {httpOnly: true});
                res.json({status: 'ok', mgs: 'token adquirido com sucesso.'});
            }else{
                res.json({status: 'error', mgs: 'usuário ou senha esta errado.'});
            }
        }else{
            res.json({status: 'error', mgs: 'usuário não cadastrado'});
        }
    }
    authenticateUser();
})

app.post('/createAcount', (req, res) => {
    let userName = req.body.name;
    let userPassword = req.body.password;
    let userNamePasswordIsValid = true;
    /* console.log(req.body);
    console.log('n:', userName);
    console.log('p:', userPassword); */
    if(userNamePasswordIsValid){
        let registerUser = async () => {
            let userIsRegistred = await User.find({name: userName});
            if(userIsRegistred.length == 0){
                //Hashign password
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) consolo.log('Error na geração do salt', err);
                    bcrypt.hash(userPassword, salt, (err, hash) => {
                        if (err) console.log('Error no hashing do salt');
                        const newUser = new User({name: userName, password: hash})
                        newUser.save((err, newUser) => { if(err) console.log("err") });
                        res.json({ "status": "ok", "mgs": "usuario criado com sucesso"});
                    })
                })
            }else{
                res.json({ "status": "erro", "mgs": "o nome escolhido não esta disponivel"});
            }
        }
        registerUser();
    }
})

app.listen(4000, () => {console.log("Authetication server runing...")});
