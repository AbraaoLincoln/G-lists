const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Require userSchema
const User = require('../../schemas/userSchema');

router.post('/', (req, res) => {
    //Verifying the name and password of user.
    let authenticateUser = async () => {
        let userIsRegistred = await User.find({name: req.body.name});
        if(userIsRegistred.length > 0){
            let userPassword = req.body.password;
            let userDatabasePassword = userIsRegistred[0].password;
            let passwordIsEqual = await bcrypt.compare(userPassword, userDatabasePassword);
            if(passwordIsEqual){
                //Generating user access token
                const userName = { name: req.body.name };
                const userToken = jwt.sign(userName, process.env.ACESS_TOKEN) //Create a hash with the secret key and user name.
                res.cookie("jwtToken", userToken, {httpOnly: true});
                res.json({status: 'ok', mgs: 'token adquirido com sucesso.'});
            }else{
                res.json({status: 'error', mgs: 'usuário ou senha estão errado.'});
            }
        }else{
            res.json({status: 'error', mgs: 'usuário ou senha estão errado.'});
        }
    }

    try{
        if(req.body.name && req.body.password) authenticateUser()
    }catch(err){
        console.log(req.body.name + "---" + req.body.password);
    }
})

module.exports = router;