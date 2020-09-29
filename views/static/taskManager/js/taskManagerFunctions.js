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
}

function drop(event){
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let divName = event.target.id;
    event.target.appendChild(document.getElementById(taskId));

    switch(divName){
        case "normal":
            document.getElementById(taskId).style.color = "#272d2d";
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