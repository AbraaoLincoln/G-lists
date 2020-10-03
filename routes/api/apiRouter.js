const express = require('express');
const router = express.Router();
const verifyToken = require('../../myModules/security/verifyToken');
const objectCreator = require('../../myModules/createObjects/lists');

const userList = require('../../schemas/userLists');

//list rest
router.get('/list', verifyToken, (req, res) => {
    console.log("get-listname")
    let getUserListsNames = async () => {
        let listsNamesFromDB = await userList.find({owner: req.body.userName});

        if(listsNamesFromDB.length == 0) res.json({status: 'erro', msg: 'listas do usuário não encontrada'});
        res.json({status: 'ok', listsNames: listsNamesFromDB[0].listsNames});
    }
    getUserListsNames();
});

router.post('/list', verifyToken, (req, res) => {
    let saveNewList = async () => {
        let newList = objectCreator.createList(req.body.userName, req.body.list);

        userList.findOneAndUpdate({owner: req.body.userName}, {$push: {listsNames: newList.name, lists: newList}}, (err, e) => {
            if(err) res.json({status: 'error'});
            console.log(e);
            res.json({status: 'ok'})
        });

    }
    saveNewList();
});

router.put('/list', verifyToken, (req, res) => {
    
});

router.delete('/list', verifyToken, (req, res) => {
    
});
//=============================

//task rest
router.get('/task', verifyToken, (req, res) => {

});

router.post('/task', verifyToken, (req, res) => {
    
});

router.put('/task', verifyToken, (req, res) => {
    
});

router.delete('/task', verifyToken, (req, res) => {
    
});
//============================
module.exports = router;