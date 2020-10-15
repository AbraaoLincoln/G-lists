const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Require userSchema
const User = require('../../schemas/userSchema');
const UserList = require('../../schemas/userLists');

router.post('/', (req, res) => {
    let userName = req.body.name;
    let userPassword = req.body.password;
    let userEmail = req.body.email;
    let userNamePasswordIsValid = true;
    //Validation e sanatization
    //Todo
    if(userNamePasswordIsValid){
        let registerUser = async () => {
        let userIsRegistred = await User.find({name: userName});
        if(userIsRegistred.length == 0){
            //Hashign password
            bcrypt.genSalt(10, (err, salt) => {
                if (err) consolo.log('Error na geração do salt', err);
                bcrypt.hash(userPassword, salt, (err, hash) => {
                    if (err) console.log('Error no hashing do salt');
                    console.log(userName)
                    const newUser = new User({name: userName, password: hash, email: userEmail})
                    newUser.save((err, newUser) => { 
                        if(err){
                            /* console.log(err) */
                            console.log('error ao salvar no banco de dados -- user')
                            res.json({ "status": "error", "mgs": "campo invalido!"});
                        }else{
                            const newUserList = new UserList({owner: userName, listsNames: [], lists: []});
                            newUserList.save((err, newUL) => {
                                if(err){
                                    /* console.log(err) */
                                    console.log('error ao salvar no banco de dados -- userLists')
                                    res.json({ "status": "error", "mgs": "campo invalido!"});
                                }
                            })
                            res.json({ "status": "ok", "mgs": "usuario criado com sucesso!"});
                        } 
                    });
                    
                })
            })
        }else{
            res.json({ "status": "erro", "mgs": "o nome escolhido não esta disponivel"});
        }
    }
    registerUser();
    }
})

module.exports = router;