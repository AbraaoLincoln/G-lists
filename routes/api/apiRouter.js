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

        UserList.updateOne({owner: req.body.userName}, {$push: {listsNames: newList.name, lists: newList}}, (err, result) => {
            if(err) res.json({status: 'error'});
            console.log(result);
            res.json({status: 'ok'})
        });

    }
    saveNewList();
});

router.put('/list', verifyToken, (req, res) => {
    UserList.updateOne({owner: req.body.userName, listsNames: req.body.listName}, {$set: {"listsNames.$": req.body.newListName}}, (err, result) => {
        if(err) res.json({status: 'error', msg: 'erro ao tentar atualizar o nome da lista'});
        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, {$set: {"lists.$.name": req.body.newListName}}, (err, result) => {
            if(err) res.json({status: 'error', msg: 'error ao tentar atualizano o nome da lista no objeto'})
            res.json({status: 'ok'});
        })
    })
});

router.delete('/list', verifyToken, (req, res) => {
    UserList.updateOne({owner: req.body.userName}, {$pull: {listsNames: req.body.listName}}, (err, result) => {
        if(err) res.json({status: 'error', msg: 'error ao remover o nome da lista'});
        UserList.updateOne({owner: req.body.userName}, {$pull: {lists: {name: req.body.listName}}}, (err, result) => {
            res.json({status: 'ok'});
        })
    })
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
    console.log(req.body.userName);
    console.log(req.body.listName);
    console.log(req.body.task);
    console.log(req.body.control);
    let newTask = objectCreator.createTask(req.body.userName, req.body.task);

    if(req.body.task.state == req.body.control.oldState){
        console.log('if1')
        switch(req.body.task.state){
            case 'normal':
                UserList.updateOne({owner: req.body.userName}, 
                    {$set: {"lists.$[ln].normalTasks.$[tn]": newTask}}, 
                    {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": req.body.control.oldName}]}, 
                    (err, result) => {
                        if(err) res.json({status: 'error', msg: 'error ao atualizar a tarefa'});
                        res.json({state: 'ok'});
                })
                break;
            case 'andamento':
                UserList.updateOne({owner: req.body.userName}, 
                    {$set: {"lists.$[ln].inProgressTasks.$[tn]": newTask}}, 
                    {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": req.body.control.oldName}]}, 
                    (err, result) => {
                        if(err) res.json({status: 'error', msg: 'error ao atualizar a tarefa'});
                        res.json({state: 'ok'});
                })
                break;
            case 'completada':
                UserList.updateOne({owner: req.body.userName}, 
                    {$set: {"lists.$[ln].finishedTasks.$[tn]": newTask}}, 
                    {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": req.body.control.oldName}]}, 
                    (err, result) => {
                        if(err) res.json({status: 'error', msg: 'error ao atualizar a tarefa'});
                        res.json({state: 'ok'});
                })
                break;
        }
        UserList.find({owner: req.body.userName}, (err, result) => {
            console.log(result[0].lists[1]);
        })
    }else{
        console.log('if2')
        let oldState = req.body.control.oldState;
        let newState = req.body.task.state;
        console.log(oldState)
        console.log(newState)
        if(oldState == 'normal'){
            UserList.updateOne({owner: req.body.userName}, {$pull: {"lists.$[ln].normalTasks": {name: req.body.control.oldName}} }, {arrayFilters: [{"ln.name": req.body.listName}]},
                 (err, result) => {
                    if(err) console.log(err)
                     UserList.find({owner: req.body.userName}, (err, result) => {
                        console.log(result[0].lists[0]);
                    })
                    if(newState == 'andamento'){
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.inProgressTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }else{
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.finishedTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }
                 });
            
        }else if(oldState == 'andamento'){
            UserList.updateOne({owner: req.body.userName}, {$pull: {"lists.$[ln].inProgressTasks": {name: req.body.control.oldName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
                (err, result) => {
                    if(err) res.json({status: 'error', msg: 'error ao deletar tarefa da lista antiga.'});
                    if(newState == 'normal'){
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.normalTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }else{
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.finishedTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }
                });
        }else{
            UserList.updateOne({owner: req.body.userName}, {$pull: {"lists.$[ln].finishedTasks": {name: req.body.control.oldName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
                (err, result) => {
                    if(err) res.json({status: 'error', msg: 'error deletar tarefa da lista antiga.'});
                    if(newState == 'normal'){
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.normalTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }else{
                        UserList.updateOne({owner: req.body.userName, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.inProgressTasks": newTask}}, (err, result) => {
                            if(err) res.json({status: 'error', msg: 'error ao mudar a tarefa de lista'});
                            res.json({status: 'ok'});
                        })
                    }
                });
        }
    }
    
});

router.delete('/task', verifyToken, (req, res) => {
    console.log(req.body.userName)
    console.log(req.body.listName)
    console.log(req.body.taskName)
    UserList.find({owner: req.body.userName}, (err, result) => {
        console.log(result);
    })
    UserList.updateOne({owner: req.body.userName}, {$pull: {"lists.$[ln].normalTasks": {name: req.body.taskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
    (err, result) => {
        if(err) res.json({status: 'error', msg: 'error ao deletar tarefa da lista'});
        UserList.find({owner: req.body.userName}, (err, result) => {
            console.log(result[0].lists[0]);
        })
        res.json({status: 'ok'});
    })
});
//============================
module.exports = router;