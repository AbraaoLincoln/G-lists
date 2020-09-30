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
            let taskOnTheList = document.getElementById(element.id);
            let dragTask = document.getElementById(globalTaskId);
            list.insertBefore(dragTask, taskOnTheList);
            paintTask(element.parentNode.id, globalTaskId);
            return true;
        }
    }
}

function paintTask(state, taskId){
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