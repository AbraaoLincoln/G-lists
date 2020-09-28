exports.createList = (owner, bodyObject) => {
    let list = {};
    list.name = bodyObject.name;
    list.owner = owner;
    list.createDate = Date.now();
    list.tasks = [];
    return list;
}

exports.createTask = (owner, bodyObject) => {
    let task = {};
    task.name = bodyObject.name;
    bodyObject.responsible ? task.responsible = bodyObject.responsible : task.responsible = owner;
    bodyObject.startDate ? task.startDate = bodyObject.startDate : task.startDate = null;
    bodyObject.finalDate ? task.finalDate = bodyObject.finalDate : task.finalDate = null;
    task.state = hold;
    return task;
}