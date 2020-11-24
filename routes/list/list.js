const express = require('express');
const router = express.Router();
const verifyToken = require('../../util/security/verifyToken');
const objectCreator = require('../../util/createObjects/lists');
const validator = require('../../util/validation/validateTask');

const UserList = require('../../schemas/userLists');

//list rest
router.get('/', verifyToken, (req, res) => {
    let getUserListsNames = async () => {
        let listsNamesFromDB = await UserList.find({owner: req.user.name});

        if(listsNamesFromDB.length == 0) res.json({status: 'erro', msg: 'listas do usuário não encontrada'});
        res.json({status: 'ok', listsNames: listsNamesFromDB[0].listsNames});
    }
    getUserListsNames();
});

router.post('/', verifyToken, (req, res) => {
    let saveNewList = async () => {
        let newList = objectCreator.createList(req.user.name, req.body.list);

        UserList.updateOne({owner: req.user.name}, {$push: {listsNames: newList.name, lists: newList}}, (err, result) => {
            if(err) res.json({status: 'error'});
            console.log(result);
            res.json({status: 'ok'})
        });

    }
    saveNewList();
});

router.put('/', verifyToken, (req, res) => {
    UserList.updateOne({owner: req.user.name, listsNames: req.body.listName}, {$set: {"listsNames.$": req.body.newListName}}, (err, result) => {
        if(err) res.json({status: 'error', msg: 'erro ao tentar atualizar o nome da lista'});
        UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, {$set: {"lists.$.name": req.body.newListName}}, (err, result) => {
            if(err) res.json({status: 'error', msg: 'error ao tentar atualizano o nome da lista no objeto'})
            res.json({status: 'ok'});
        })
    })
});

router.delete('/', verifyToken, (req, res) => {
    UserList.updateOne({owner: req.user.name}, {$pull: {listsNames: req.body.listName}}, (err, result) => {
        if(err) res.json({status: 'error', msg: 'error ao remover o nome da lista'});
        UserList.updateOne({owner: req.user.name}, {$pull: {lists: {name: req.body.listName}}}, (err, result) => {
            res.json({status: 'ok'});
        })
    })
});

module.exports = router;