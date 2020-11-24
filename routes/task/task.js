const express = require('express');
const router = express.Router();
const verifyToken = require('../../util/security/verifyToken');
const objectCreator = require('../../util/createObjects/lists');
const validator = require('../../util/validation/validateTask');

const UserList = require('../../schemas/userLists');

//task rest
router.get('/:listName', verifyToken, (req, res) => {
    if(req.user.name && req.params.listName){
        UserList.find({owner: req.user.name}, (err, result) => {
            if(err) res.json({status: 'error', msg: "error ao encontrar as tarefas"});
            let lists = result[0].lists;
            
            for(list of lists){
                if(list.name == req.params.listName){
                    res.json({normal: list.normalTasks, inProgress: list.inProgressTasks, finished: list.finishedTasks});
                }
            }
            /* res.json({status: 'error', msg: "lista não encontrada"}) */
        });
    }
});

router.post('/', verifyToken, validator.validateTask, (req, res) => {
    let saveNewTask = async () => {
        if(!req.user.name || !req.body.listName || !req.body.task) console.log("error--savaNewTask: faltando algum campo")
        let newTask = objectCreator.createTask(req.user.name, req.body.task);
        switch(newTask.state){
            case 'normal':
                UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, { $push: {"lists.$.normalTasks": newTask}}, (err, result) => {
                    if(err) res.json({status: 'error', mgs: 'error ao salvar nova tarefa'});
                    res.json({status: 'ok'})
                })
                break;
            case 'andamento':
                try {
                    await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                    { $push: {"lists.$.inProgressTasks": newTask}});   
                } catch (err) {
                    console.log(err)
                    res.json({status: 'error', mgs: 'error ao salvar nova tarefa'});
                }

                res.json({status: 'ok'})
                break;
            case 'completada':
                UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, { $push: {"lists.$.finishedTasks": newTask}}, (err, result) => {
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

router.put('/', verifyToken, validator.validateTasks, async (req, res) => {
    let error = false;
    console.log(req.body.listName)
    console.log(req.body.tasks)
    for(task of req.body.tasks){
        let newTask = objectCreator.createTask(req.user.name, task);
        let oldTaskName = req.body.control.oldName ? req.body.control.oldName : task.name;
        let oldState = req.body.control.oldState ? req.body.control.oldState : task.state;
        console.log(newTask)
        console.log(oldTaskName)
        console.log(oldState)
        if(task.state == oldState){
            switch(task.state){
                case 'normal':
                    try{
                        await UserList.updateOne({owner: req.user.name}, 
                            {$set: {"lists.$[ln].normalTasks.$[tn]": newTask}}, 
                            {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": oldTaskName}]});
                    }catch(err){
                        console.log(err);
                        error = true;
                    }
                    break;
                case 'andamento':
                    try{
                        await UserList.updateOne({owner: req.user.name}, 
                            {$set: {"lists.$[ln].inProgressTasks.$[tn]": newTask}}, 
                            {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": oldTaskName}]});
                    }catch(err){
                        console.log(err);
                        error = true;
                    }
                    break;
                case 'completada':
                    try{
                        await UserList.updateOne({owner: req.user.name}, 
                            {$set: {"lists.$[ln].finishedTasks.$[tn]": newTask}}, 
                            {arrayFilters: [{"ln.name": req.body.listName}, {"tn.name": oldTaskName}]});
                    }catch(err){
                        console.log(err);
                        error = true;
                    }
                    break;
            }
            /* UserList.find({owner: req.user.name}, (err, result) => {
                console.log(result[0].lists[1]);
            }) */
        }else{
            // console.log('opc2');
            // console.log(task);
            let newState = task.state;
            if(oldState == 'normal'){
                try {
                    await UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].normalTasks": {name: oldTaskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]});
                    if(newState == 'andamento'){
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.inProgressTasks": newTask}});
                    }else{
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.finishedTasks": newTask}});
                    }
                    //  UserList.find({owner: req.user.name}, (err, result) => {
                    //     console.log(result[0].lists[0]);
                    // })
                }catch(err) {
                    console.log(err);
                    error = true;
                    break;
                }
                
            }else if(oldState == 'andamento'){
                try {
                    await UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].inProgressTasks": {name: oldTaskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]});
                    if(newState == 'normal'){
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.normalTasks": newTask}});
                    }else{
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.finishedTasks": newTask}});
                    }
                }catch(err){
                    console.log(err);
                    error = true;
                    break;
                }
            }else{
                try {
                    await UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].finishedTasks": {name: oldTaskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]});
                    if(newState == 'normal'){
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.normalTasks": newTask}});
                    }else{
                        await UserList.updateOne({owner: req.user.name, "lists.name": req.body.listName}, 
                        {$push: {"lists.$.inProgressTasks": newTask}});
                    }
                }catch(err){
                    console.log(err);
                    error = true;
                    break;
                }
                
            }
        }
    }

    if(!error) res.json({state: 'ok'});
    /* res.json({status: 'error', mgs: 'error ao salvar nova tarefa'}); */
});

router.delete('/', verifyToken, (req, res) => {
    console.log(req.body.listName);
    console.log(req.body.taskName);
    // UserList.find({owner: req.user.name}, (err, result) => {
    //     console.log(result);
    // })
    //
    // UserList.find({owner: req.user.name}, (err, result) => {
    //     console.log(result[0].lists[0]);
    // })
    switch(req.body.state){
        case 'normal':
            UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].normalTasks": {name: req.body.taskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
            (err, result) => {
                if(err) res.json({status: 'error', msg: 'error ao deletar tarefa da lista'});
                res.json({status: 'ok'});
            })
            break;
        case 'andamento':
            UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].inProgressTasks": {name: req.body.taskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
            (err, result) => {
                if(err) res.json({status: 'error', msg: 'error ao deletar tarefa da lista'});
                res.json({status: 'ok'});
            })
            break;
        case 'completada':
            UserList.updateOne({owner: req.user.name}, {$pull: {"lists.$[ln].finishedTasks": {name: req.body.taskName}} }, {arrayFilters: [{"ln.name": req.body.listName}]}, 
            (err, result) => {
                if(err) res.json({status: 'error', msg: 'error ao deletar tarefa da lista'});
                res.json({status: 'ok'});
            })
            break;
    }
});

module.exports = router;