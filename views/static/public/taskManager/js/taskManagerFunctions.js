var globalTaskId = "";

//Move atraves dos butoes

function moveUp(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(selectTask.previousElementSibling){
        let list = document.getElementById(selectTask.parentElement.id);
        let taskGoDown = document.getElementById(selectTask.previousElementSibling.id);
        list.insertBefore(selectTask, taskGoDown);
        updateTaskPositionOnTheSameList(selectTask.id, taskGoDown.id, list.id);
    }
}

function moveDown(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(selectTask.nextElementSibling){
        let list = document.getElementById(selectTask.parentElement.id);
        let taskGoUp = document.getElementById(selectTask.nextElementSibling.id);
        list.insertBefore(taskGoUp, selectTask);
        updateTaskPositionOnTheSameList(taskGoUp.id, selectTask.id, list.id);
    }
}

//Move a tarefa selecionda para o fim da lista destino escolhida.
//Muda a cor do elemento para a cor que representa o estado da lista.  
//So muda o estado da tarefa.
function moveTaskToNewState(event){
    let newState = event.target.value;
    let taskId = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    console.log(document.getElementById(taskId).parentNode.id)
    updateTaskState(taskId, document.getElementById(taskId).parentNode.id, newState);
    switch(newState){
        case "normal":
            document.getElementById("normal").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#f6f8ff";
            break;
        case "andamento":
            document.getElementById("andamento").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
        case "completada":
            document.getElementById("completada").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
    }
}

function updateTaskState(taskName, oldState, newState){
    switch(oldState){
        case 'normal':
            normalTasks.forEach((task) => {
                if(task.name == taskName){
                    updateTaskPositionAfterDelete(task.pos, task.state);
                    if(newState == 'andamento'){
                        task.pos = inProgressTasks.length;
                        task.state = 'andamento';
                        inProgressTasks.push(task);
                    }else{
                        task.pos = finishedTasks.length;
                        task.state = 'completada';
                        finishedTasks.push(task);
                    }
                    updateTaskStateOnDB([task], oldState);
                }
            })
            break;
        case 'andamento':
            inProgressTasks.forEach((task) => {
                if(task.name == taskName){
                    updateTaskPositionAfterDelete(task.pos, task.state);
                    if(newState == 'normal'){
                        task.pos = normalTasks.length;
                        task.state = 'normal';
                        normalTasks.push(task);
                    }else{
                        task.pos = finishedTasks.length;
                        task.state = 'completada';
                        finishedTasks.push(task);
                    }
                    updateTaskStateOnDB([task], oldState);
                }
            })
            break;
        case 'completada':
            finishedTasks.forEach((task) => {
                if(task.name == taskName){
                    updateTaskPositionAfterDelete(task.pos, task.state);
                    if(newState == 'normal'){
                        task.pos = normalTasks.length;
                        task.state = 'normal';
                        normalTasks.push(task);
                    }else{
                        task.pos = inProgressTasks.length;
                        task.state = 'andamento';
                        inProgressTasks.push(task);
                    }
                    updateTaskStateOnDB([task], oldState);
                }
            })
            break;
    }
    removeTaskFromLocalArray(taskName, oldState);
}

async function updateTaskStateOnDB(tasks, oldState){
    let response = await fetch('http://localhost:3000/api/task', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            listName: localStorage.getItem('currentListName'),
            control: {oldName: null, oldState: oldState},
            tasks: tasks
        })
    })
    let data = await response.json();
    console.log(data);
}

function updateTaskPositionAfterDelete(posOfDeleteTask, oldTaskState){
    let taskToUpdatePos = [];

    switch(oldTaskState){
        case 'normal':
            for(task of normalTasks){
                if(task.pos > posOfDeleteTask){
                    task.pos -= 1;
                    taskToUpdatePos.push(task);
                }
            }
            break;
        case 'andamento':
            for(task of inProgressTasks){
                if(task.pos > posOfDeleteTask){
                    task.pos -= 1;
                    taskToUpdatePos.push(task);
                }
            }
            break;
        case 'completada':
            for(task of finishedTasks){
                if(task.pos > posOfDeleteTask){
                    task.pos -= 1;
                    taskToUpdatePos.push(task);
                }
            }
            break;
    }
    console.log(taskToUpdatePos)
    console.log(normalTasks)
    updateTaskPosOnDB(taskToUpdatePos);
}

function updateTaskPositionOnTheSameList(taskNameGoUp, taskNameGoDown, listState){
    let taskToUpdatePos = [];

    switch(listState){
        case 'normal':
            for(task of normalTasks){
                if(task.name == taskNameGoUp || task.name == taskNameGoDown){
                    taskToUpdatePos.push(task);
                }
                if(taskToUpdatePos.length == 2) break;
            }
            break;
        case 'andamento':
            for(task of inProgressTasks){
                if(task.name == taskNameGoUp || task.name == taskNameGoDown){
                    taskToUpdatePos.push(task);
                }
                if(taskToUpdatePos.length == 2) break;
            }
            break;
        case 'completada':
            for(task of finishedTasks){
                if(task.name == taskNameGoUp || task.name == taskNameGoDown){
                    taskToUpdatePos.push(task);
                }
                if(taskToUpdatePos.length == 2) break;
            }
            break;
    }

    let auxPos = taskToUpdatePos[0].pos;
    taskToUpdatePos[0].pos = taskToUpdatePos[1].pos;
    taskToUpdatePos[1].pos = auxPos;
    updateTaskPosOnDB(taskToUpdatePos);
}

async function updateTaskPosOnDB(tasksToUpdate){
    let response = await fetch('http://localhost:3000/api/task', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            listName: localStorage.getItem('currentListName'),
            tasks: tasksToUpdate,
            control: {oldName: null, oldState: null}
        })
    })

    let data = await response.json();
    console.log(data);
}

async function removeTaskOnDB(taskNameToRemove, taskState){
    let response = await fetch('http://localhost:3000/api/task', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            listName: localStorage.getItem('currentListName'),
            taskName: taskNameToRemove,
            state: taskState
        })
    })

    let data = await response.json();
    console.log(data);
}

function removeTaskFromLocalArray(taskNameToRemove, taskState){
    switch(taskState){
        case 'normal':
            normalTasks = normalTasks.filter((task) => {
                if(task.name !== taskNameToRemove) return true;
                return false;
            })
            break;
        case 'andamento':
            inProgressTasks = inProgressTasks.filter((task) => {
                if(task.name !== taskNameToRemove) return true;
                return false;
            })
            break;
        case 'completada':
            finishedTasks = finishedTasks.filter((task) => {
                if(task.name !== taskNameToRemove) return true;
                return false;
            })
            break;
        default:
            console.log("estado não valido!");

    }
}

//Move atraves de drag and drop
function allowDrop(event){
    event.preventDefault();
}

function drag(event){
    /* event.preventDefault(); */
    event.dataTransfer.setData('taskId', event.target.id);
    document.getElementById(event.target.id).classList.add("draging");
    globalTaskId = event.target.id;
}

function drop(event){
    event.preventDefault();
    let taskId = event.dataTransfer.getData("taskId");
    let divName = event.target.id;
    if(divName == 'normal' || divName == 'andamento' || divName == 'completada'){
        event.target.appendChild(document.getElementById(taskId));
        paintTask(divName, taskId);
    }
    document.getElementById(taskId).classList.remove("draging");
}

//Verifica qual tarefa esta em baixo da tarefa que esta sendo draged.
//Caso 1: se a tarefa esta sendo movida de uma lista para outra.
//Caso 2: se a tarefa esta sendo movida dentro da propria lista, para cima ou para baixo.
function previewDropPosition(event){
    for(element of event.path){
        if(element.id && element.parentNode.id){
            let list = document.getElementById(element.parentNode.id);
            let taskUnderDragTask = document.getElementById(element.id);
            let dragTask = document.getElementById(globalTaskId);
            
            if(dragTask.previousElementSibling && dragTask.previousElementSibling.id == taskUnderDragTask.id){
                list.insertBefore(dragTask, taskUnderDragTask);
            }else if(dragTask.nextElementSibling && dragTask.nextElementSibling.id == taskUnderDragTask.id){
                list.insertBefore(taskUnderDragTask, dragTask);
            }else{
                list.insertBefore(dragTask, taskUnderDragTask);
            }
            
            paintTask(element.parentNode.id, globalTaskId);
            break;
        }
    }
}

function paintTask(state, taskId){
    switch(state){
        case "normal":
            document.getElementById(taskId).style.backgroundColor = "#f6f8ff";
            break;
        case "andamento":
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
        case "completada":
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
    }
}
