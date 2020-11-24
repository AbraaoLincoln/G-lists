const express = require('express');
const router = express.Router();
const verifyToken = require('../../util/security/verifyToken');
const userSchema = require('../../schemas/userSchema');

router.get('/', verifyToken, (req, res) => {
    let getUserInfo = async () => {
        try {
            let dbRes = await userSchema.find({name: req.user.name}, {_id: 0, name: 1, email: 1});
            res.json({status: 'ok', userInfo: dbRes[0]});
        }catch(err) {
            console.log(err);
            res.json({status: 'error', msg: 'usuario não encontrado'});   
        }
    };
    getUserInfo();
});

module.exports = router;