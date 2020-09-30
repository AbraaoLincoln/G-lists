var globalTaskId = "";

function showAddTask(){
    document.querySelector('.divNewTask').style.display = 'flex';
}

function hideAddTask(){
    document.querySelector('.divNewTask').style.display = 'none';
}

function allowDrop(event){
    event.preventDefault();
}

function drag(event){
    /* event.preventDefault(); */
    event.dataTransfer.setData('text', event.target.id);
    document.getElementById(event.target.id).classList.add("draging");
    globalTaskId = event.target.id;
}

function drop(event){
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let divName = event.target.id;
    document.getElementById(taskId).classList.remove("draging");
    if(divName == 'normal' || divName == 'andamento' || divName == 'completada'){
        event.target.appendChild(document.getElementById(taskId));
        paintTask(divName, taskId);
    }
}

function checkDrapPosition(event){
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
            return true;
        }
    }
}

function paintTask(state, taskId){
    // document.getElementById(taskId).classList.remove("draging");
    switch(state){
        case "normal":
            /* document.getElementById(taskId).style.color = "#272d2d"; */
            document.getElementById(taskId).style.backgroundColor = "#f6f8ff";
            break;
        case "andamento":
            /* document.getElementById(taskId).style.color = "#f6f8ff"; */
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
        case "completada":
            /* document.getElementById(taskId).style.color = "#f6f8ff"; */
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
    }
}

function moveUp(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(selectTask.previousElementSibling){
        let list = document.getElementById(selectTask.parentElement.id);
        let taskGoDown = document.getElementById(selectTask.previousElementSibling.id);
        list.insertBefore(selectTask, taskGoDown);
    }
}

function moveDown(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(selectTask.nextElementSibling){
        let list = document.getElementById(selectTask.parentElement.id);
        let taskGoUp = document.getElementById(selectTask.nextElementSibling.id);
        list.insertBefore(taskGoUp, selectTask);
    }
}