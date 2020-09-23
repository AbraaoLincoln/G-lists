const express = require('express');
const app = express();

//Object needed to do the authetication.
require("dotenv").config();
const jwt = require('jsonwebtoken');

//Middleware
app.use(express.json());

//Seting up the routes
app.post('/login', (req, res) => {
    //Verifying the name and password of user.
    //todo

    //Genereting user access token
    const userName = { name: req.body.name };
    console.log(process.env.ACESS_TOKEN)
    const userToken = jwt.sign(userName, process.env.ACESS_TOKEN) //Create a hash with the secret key and user name.
    res.json({token: userToken});
})

app.listen(4000, () => {console.log("Authetication server runing...")});
