const express = require('express');
const router = express.Router();
const verifyToken = require('../../myModules/security/verifyToken');
const objectCreator = require('../../myModules/createObjects/lists');

const UserList = require('../../schemas/userLists');

//list rest
router.get('/list', verifyToken, (req, res) => {
    let getUserListsNames = async () => {
        let listsNamesFromDB = await UserList.find({owner: req.body.userName});

        if(listsNamesFromDB.length == 0) res.json({status: 'erro', msg: 'listas do usuário não encontrada'});
        res.json({status: 'ok', listsNames: listsNamesFromDB[0].listsNames});
    }
    getUserListsNames();
});

router.post('/list', verifyToken, (req, res) => {
    let saveNewList = async () => {
        let newList = objectCreator.createList(req.body.userName, req.body.list);

        UserList.findOneAndUpdate({owner: req.body.userName}, {$push: {listsNames: newList.name, lists: newList}}, (err, result) => {
            if(err) res.json({status: 'error'});
            console.log(e);
            res.json({status: 'ok'})
        });

    }
    saveNewList();
});

router.put('/list', verifyToken, (req, res) => {
    console.log(req.body.userName);
    console.log(req.body.listName);
    console.log(req.body.newListName);

    UserList.updateOne({owner: req.body.userName, listsNames: req.body.listName}, {$set: {"listsNames.$": req.body.newListName}}, (err, result) => {
        if(err) res.json({status: 'error', msg: 'erro ao tentar atualizar o nome da lista'});
        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, {$set: {"lists.$.name": req.body.newListName}}, (err, result) => {
            if(err) res.json({status: 'error', msg: 'error ao tentar atualizano o nome da lista no objeto'})
            res.json({status: 'ok'});
        })
    })
});

router.delete('/list', verifyToken, (req, res) => {
    
});

//task rest
router.get('/task', verifyToken, (req, res) => {
    if(req.body.userName && req.body.listName){
        UserList.find({owner: req.body.userName}, (err, result) => {
            if(err) res.json({status: 'error', msg: "error ao encontrar as tarefas"});
            let lists = result[0].lists;
            
            for(list of lists){
                if(list.name == req.body.listName){
                    res.json({normal: list.normalTasks, inProgress: list.inProgressTasks, finished: list.finishedTasks});
                }
            }
            /* res.json({status: 'error', msg: "lista não encontrada"}) */
        });
    }
});

router.post('/task', verifyToken, (req, res) => {
    let saveNewTask = async () => {
        if(!req.body.userName || !req.body.listName || !req.body.task) console.log("error--savaNewTask: faltando algum campo")
        let newTask = objectCreator.createTask(req.body.userName, req.body.task);
        switch(newTask.state){
            case 'normal':
                UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, { $push: {"lists.$.normalTasks": newTask}}, (err, result) => {
                    if(err) res.json({status: 'error', mgs: 'error ao salvar nova tarefa'});
                    res.json({status: 'ok'})
                })
                break;
            case 'andamento':
                UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, { $push: {"lists.$.inProgressTasks": newTask}}, (err, result) => {
                    if(err) res.json({status: 'error', mgs: 'error ao salvar nova tarefa'});
                    res.json({status: 'ok'})
                })
                break;
            case 'completada':
                UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, { $push: {"lists.$.finishedTasks": newTask}}, (err, result) => {
                    if(err) res.json({status: 'error', mgs: 'error ao salvar nova tarefa'});
                    res.json({status: 'ok'})
                })
                break;
            default:
                console.log("Estado Invalido!");
                res.json({status: 'error', msg: "Estado Invalido!"});
        }

    }
    saveNewTask();
});

router.put('/task', verifyToken, (req, res) => {
    
});

router.delete('/task', verifyToken, (req, res) => {
    
});
//============================
module.exports = router;