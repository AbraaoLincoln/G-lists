exports.createList = (owner, listObject) => {
    let list = {};
    list.name = listObject.name;
    list.owner = owner;
    list.createDate = Date.now();
    list.normalTasks = [];
    list.inProgressTasks = [];
    list.finishedTasks = [];
    return list;
}

exports.createTask = (owner, taskObject) => {
    let task = {};
    task.name = taskObject.name;
    taskObject.responsible ? task.responsible = taskObject.responsible : task.responsible = owner;
    /* taskObject.startDate ? task.startDate = taskObject.startDate : task.startDate = null; */
    taskObject.finalDate ? task.finalDate = taskObject.finalDate : task.finalDate = null;
    task.state = taskObject.state;
    return task;
}