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
                updateTaskPositionOnTheSameList(dragTask.id, taskUnderDragTask.id, list.id);
            }else if(dragTask.nextElementSibling && dragTask.nextElementSibling.id == taskUnderDragTask.id){
                list.insertBefore(taskUnderDragTask, dragTask);
                updateTaskPositionOnTheSameList(taskUnderDragTask.id, dragTask.id, list.id);
            }else if(dragTask.parentNode.id !== list.id){
                console.log("3case")
                uptadeTaskPosOnDrop(dragTask.id, taskUnderDragTask.id, dragTask.parentNode.id, list.id);
                list.insertBefore(dragTask, taskUnderDragTask);
            }
            
            paintTask(element.parentNode.id, globalTaskId);
            break;
        }
    }
}

function uptadeTaskPosOnDrop(dragTaskName, taskNameOfUnderDragTask, oldState, newState){
    let taskToUpdate = [];
    let taskToUpdateState = {};

    switch(oldState){
        case 'normal':
            for(t of normalTasks){
                if(t.name == dragTaskName){
                    taskToUpdateState = t;
                    break;
                }
            }
            break;
        case 'andamento':
            for(t of inProgressTasks){
                if(t.name == dragTaskName){
                    taskToUpdateState = t;
                    break;
                }
            }
            break;
        case 'completada':
            for(t of finishedTasks){
                if(t.name == dragTaskName){
                    taskToUpdateState = t;
                    break;
                }
            }
            break;
    }

    switch(newState){
        case 'normal':
            for(t of normalTasks){
                if(t.name == taskNameOfUnderDragTask){
                    taskToUpdateState.pos = t.pos;
                    break;
                }
            }

            for(t of normalTasks){
                if(t.pos >= taskToUpdateState.pos){
                    t.pos++;
                    taskToUpdate.push(t);
                }
            }
            break;
        case 'andamento':
            for(t of inProgressTasks){
                if(t.name == taskNameOfUnderDragTask){
                    taskToUpdateState.pos = t.pos;
                    break;
                }
            }

            for(t of inProgressTasks){
                if(t.pos >= taskToUpdateState.pos){
                    t.pos++;
                    taskToUpdate.push(t);
                }
            }
            break;
        case 'completada':
            for(t of finishedTasks){
                if(t.name == taskNameOfUnderDragTask){
                    taskToUpdateState.pos = t.pos;
                    break;
                }
            }

            for(t of finishedTasks){
                if(t.pos >= taskToUpdateState.pos){
                    t.pos++;
                    taskToUpdate.push(t);
                }
            }
            break;
    }

    removeTaskOnDB(taskToUpdateState.name, taskToUpdateState.state);
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
