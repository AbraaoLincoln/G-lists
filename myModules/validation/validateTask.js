exports.validateTask = (req, res, next) => {
    if(!req.body.task.name || !req.body.task.state || (req.body.task.pos == null)){
        //to do
        //Verificar se os campos estão corretos(dominio e formato)
        res.json({status: 'erro', msg: 'not pass validation1'});
    }
    next();
}

exports.validateTasks = (req, res, next) => {
    for(t of req.body.tasks){
        if(!t.name || !t.responsible || !t.state || (t.pos == null)){
            res.json({status: 'erro', msg: 'not pass validation2'});
            break;
        }
    }
    next();
}

// module.exports = validateTask;