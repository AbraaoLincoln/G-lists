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

var listN = 0;
var taskUnderDragTaskN = 0;
var dragTaskN = 0;
var oldList = 0;
var move = 0; //1 up, 2 down and 3 another list.

function drop(event){
    event.preventDefault();
    let task = document.getElementById(event.dataTransfer.getData("taskId"));
    let divName = event.target.id;
    if(divName == 'normal' || divName == 'andamento' || divName == 'completada'){
        updateTaskState(task.id, task.parentNode.id, divName);
        event.target.appendChild(task);
        paintTask(divName, task.id);
    }else{
        if(dragTaskN != taskUnderDragTaskN){
            switch(move){
                case 1:
                    updatePosOnDragTaskUp(dragTaskN, taskUnderDragTaskN, listN);
                    break;
                case 2:
                    updatePosOnDragTaskDown(taskUnderDragTaskN, dragTaskN, listN);
                    break;
                case 3:
                    uptadeTaskPosOnDropTaskFromAnotherList(dragTaskN, taskUnderDragTaskN, oldList, listN);
                    break;
            }
        }
        move = 0;
    }
    task.classList.remove("draging");
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
                taskUnderDragTaskN = taskUnderDragTask.id
                dragTaskN = dragTask.id
                listN = list.id
                list.insertBefore(dragTask, taskUnderDragTask);
                move = 1;
            }else if(dragTask.nextElementSibling && dragTask.nextElementSibling.id == taskUnderDragTask.id){
                taskUnderDragTaskN = taskUnderDragTask.id
                dragTaskN = dragTask.id
                listN = list.id
                list.insertBefore(taskUnderDragTask, dragTask);
                move = 2;
            }else if(dragTask.parentNode.id !== list.id){
                taskUnderDragTaskN = taskUnderDragTask.id
                dragTaskN = dragTask.id
                listN = list.id
                oldList = dragTask.parentNode.id;
                list.insertBefore(dragTask, taskUnderDragTask);
                move = 3;
            }
            
            paintTask(element.parentNode.id, globalTaskId);
            break;
        }
    }
}

function updatePosOnDragTaskUp(taskNameGoUp, taskNameGoDown, listState){
    let taskToUpdatePos = [];
    lista[listState].forEach( task => {
        if(task.name == taskNameGoUp || task.name == taskNameGoDown){
            taskToUpdatePos.push(task);
            if(taskToUpdatePos.length == 2)
            {
                if(taskToUpdatePos[0].pos > taskToUpdatePos[1].pos){
                    let aux = taskToUpdatePos[1]; 
                    taskToUpdatePos[1] = taskToUpdatePos[0];
                    taskToUpdatePos[0] = aux;
                }
            }
        } 
    });

    //0 = pos of task to go down.
    //1 = pos of task to go up.
    if(taskToUpdatePos[1].pos - taskToUpdatePos[0].pos > 1){
        taskToUpdatePos[1].pos = taskToUpdatePos[0].pos;
        lista[listState].forEach(task => {
            if(task.pos > taskToUpdatePos[1].pos){
                task.pos++;
                taskToUpdatePos.push(task);
            }
        });
        taskToUpdatePos[0].pos++;
        updateTaskPosOnDB(taskToUpdatePos);
    }else{
        updateTaskPositionOnTheSameList(taskNameGoUp, taskNameGoDown, listState);
    }
}

function updatePosOnDragTaskDown(taskNameGoUp, taskNameGoDown,listState){
    let taskToUpdatePos = [];

    lista[listState].forEach( task => {
        if(task.name == taskNameGoUp || task.name == taskNameGoDown){
            taskToUpdatePos.push(task);
            if(taskToUpdatePos.length == 2)
            {
                if(taskToUpdatePos[0].pos > taskToUpdatePos[1].pos){
                    let aux = taskToUpdatePos[1]; 
                    taskToUpdatePos[1] = taskToUpdatePos[0];
                    taskToUpdatePos[0] = aux;
                }
            }
        } 
    });

    //0 = pos of task to go down.
    //1 = pos of task to go up.
    if(taskToUpdatePos[1].pos - taskToUpdatePos[0].pos > 1){
        lista[listState].forEach(task => {
            if(task.pos < taskToUpdatePos[1].pos && task.pos > taskToUpdatePos[0].pos){
                task.pos--;
                taskToUpdatePos.push(task);
            }
        });
        taskToUpdatePos[0].pos = taskToUpdatePos[1].pos;
        taskToUpdatePos[1].pos--;
        updateTaskPosOnDB(taskToUpdatePos);
    }else{
        updateTaskPositionOnTheSameList(taskNameGoUp, taskNameGoDown, listState);
    }
}


function uptadeTaskPosOnDropTaskFromAnotherList(dragTaskName, taskNameOfUnderDragTask, oldState, newState){
    let taskToUpdate = [];
    let taskToUpdateState = {};
    
    for(t of lista[oldState]){
        if(t.name == dragTaskName){
            taskToUpdateState = t;
            break;
        }
    }
    updateTaskPositionAfterDelete(taskToUpdateState.pos, taskToUpdateState.state);
    removeTaskOnDB(taskToUpdateState.name, taskToUpdateState.state);

    for(t of lista[newState]){
        if(t.name == taskNameOfUnderDragTask){
            taskToUpdateState.pos = t.pos;
            break;
        }
    }

    for(t of lista[newState]){
        if(t.pos >= taskToUpdateState.pos){
            t.pos++;
            taskToUpdate.push(t);
        }
    }

    taskToUpdateState.state = newState;
    addNewTaskOnDB(taskToUpdateState);
    updateTaskPosOnDB(taskToUpdate);
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
