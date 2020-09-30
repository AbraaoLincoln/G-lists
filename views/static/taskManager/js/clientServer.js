var tasks = [];
let newTask = {
    name: "Tarefa 1",
    due: Date.now(),
    responsible: "Fulano",
    state: "normal"
}

let newTask2 = {
    name: "Tarefa 2",
    due: Date.now(),
    responsible: "Cicrano",
    state: "andamento"
}

let newTask3 = {
    name: "Tarefa 3",
    due: Date.now(),
    responsible: "Fulano",
    state: "completada"
}

let newTask4 = {
    name: "Tarefa 4",
    due: Date.now(),
    responsible: "Cicrano",
    state: "normal"
}

let newTask5 = {
    name: "Tarefa 5",
    due: Date.now(),
    responsible: "Cicrano",
    state: "normal"
}

tasks.push(newTask);
tasks.push(newTask2);
tasks.push(newTask3);
tasks.push(newTask4);
tasks.push(newTask5);

function createTask(task){
    let createDivTask = () => {
        let divTask = document.createElement("DIV");
        divTask.className = "task";
        divTask.id = task.name;
        divTask.draggable = true;
        divTask.addEventListener("dragstart", drag);

        return divTask;
    };

    let createMenu = () => {
        let divDropdown = document.createElement("DIV");
        divDropdown.className = "dropdown";
        //Create menu icon
        let menuIcon =  document.createElement("I");
        menuIcon.className = "fas fa-ellipsis-v";
        divDropdown.appendChild(menuIcon);
        let divMenu1 = document.createElement("DIV");
        divMenu1.className = "dropdown-content";
        //Create buttons move up and down
        let btnMoveUp = document.createElement("BUTTON");
        btnMoveUp.type = "button";
        btnMoveUp.className = "btnDropdown1 litleadJutment";
        btnMoveUp.innerText = "Mover para cima";
        btnMoveUp.addEventListener('click', moveUp);
        let btnMoveDown = document.createElement("BUTTON");
        btnMoveDown.type = "button";
        btnMoveDown.className = "btnDropdown1 litleadJutment";
        btnMoveDown.innerText = "Mover para baixo";
        btnMoveDown.addEventListener('click', moveDown);
        divMenu1.appendChild(btnMoveUp);
        divMenu1.appendChild(btnMoveDown);
        //Create submenu
        let divDropdown2 = document.createElement("DIV");
        divDropdown2.className = "btnDropdown1 dropdown2";
        //Create button dropdown2
        let btnMoveTo = document.createElement("BUTTON");
        btnMoveTo.type = "button";
        btnMoveTo.className = "btnDropdown1-2";
        btnMoveTo.innerText = "Mover para:";
        divDropdown2.appendChild(btnMoveTo);
        //Create content dropdown2
        let divMenu2 = document.createElement("DIV");
        divMenu2.className = "dropdown2-content";
        //Create buttons menu2
        let btnMoveToNormal = document.createElement("INPUT");
        btnMoveToNormal.type = "button";
        btnMoveToNormal.className = "btnDropdown2";
        btnMoveToNormal.value = "normal";
        btnMoveToNormal.placeholder = "Normal";
        btnMoveToNormal.addEventListener('click', moveTaskTo);
        let btnMoveToInProgress = document.createElement("INPUT");
        btnMoveToInProgress.type = "button";
        btnMoveToInProgress.className = "btnDropdown2";
        btnMoveToInProgress.value = "andamento";
        btnMoveToInProgress.placeholder = "Andamento";
        btnMoveToInProgress.addEventListener('click', moveTaskTo);
        let btnMoveToFinished = document.createElement("INPUT");
        btnMoveToFinished.type = "button";
        btnMoveToFinished.className = "btnDropdown2";
        btnMoveToFinished.value = "completada";
        btnMoveToFinished.placeholder = "Completada";
        btnMoveToFinished.addEventListener('click', moveTaskTo);
        divMenu2.appendChild(btnMoveToNormal);
        divMenu2.appendChild(btnMoveToInProgress);
        divMenu2.appendChild(btnMoveToFinished);
        divDropdown2.appendChild(divMenu2);
        //Mounting the dropdown
        divMenu1.appendChild(divDropdown2);
        //Final step
        divDropdown.appendChild(divMenu1);

        return divDropdown;
    }

    let createDivTaskHead = () => {
        // let icon = document.createElement("I");
        let menu = createMenu();
        let title = document.createElement("H3");
        let deleteButton = document.createElement("SPAN");
        let divTaskHead = document.createElement("DIV");
        divTaskHead.className = "taskHead";
        // icon.className = "fas fa-ellipsis-v";
        title.innerHTML = task.name;
        deleteButton.className = "spanDelete";
        deleteButton.innerHTML = "X";
        deleteButton.addEventListener("click", hideTask);
        // divTaskHead.appendChild(icon);
        divTaskHead.appendChild(menu);
        divTaskHead.appendChild(title);
        divTaskHead.appendChild(deleteButton);

        return divTaskHead;
    }

    let createDivTaskBody = () => {
        let divTaskBody = document.createElement("DIV");
        divTaskBody.className = "taskBody";
        let table = document.createElement("TABLE");
        let row1 =  document.createElement("TR");
        let h1 = document.createElement("TH");
        h1.innerHTML = "Responsavel"
        row1.appendChild(h1);
        let h2 = document.createElement("TH");
        h2.innerHTML = "Prazo";
        row1.appendChild(h2);
        let row2 =  document.createElement("TR");
        let resp1 = document.createElement("TD");
        resp1.innerHTML = task.responsible;
        row2.appendChild(resp1);
        let resp2 = document.createElement("TD");
        resp2.innerHTML = task.due;
        row2.appendChild(resp2);
        table.appendChild(row1);
        table.appendChild(row2);
        divTaskBody.appendChild(table);

        return divTaskBody;
    }

    let newTask = createDivTask();
    let head = createDivTaskHead();
    let body = createDivTaskBody();
    newTask.appendChild(head);
    newTask.appendChild(body);
    return newTask;
}

function addTaskToList(state, newTask, taskId){
    switch(state){
        case "normal":
            document.getElementById("normal").appendChild(newTask);
            document.getElementById(taskId).style.backgroundColor = "#f6f8ff";
            break;
        case "andamento":
            document.getElementById("andamento").appendChild(newTask);
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
        case "completada":
            document.getElementById("completada").appendChild(newTask);
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
    }
}

function addNewTask(event){
    event.preventDefault();
    let newTask = {
        name: document.getElementById("newTaskName").value,
        due: document.getElementById("newTaskDate").value,
        responsible: document.getElementById("newTaskResponsible").value,
        state: document.getElementById("stateNewTask").value
    }
    tasks.push(newTask);
    let newTaskElement = createTask(newTask);
    addTaskToList(newTask.state, newTaskElement, newTask.name);

    //Cleanig
    document.getElementById("newTaskName").value = "";
    document.getElementById("newTaskDate").value = "";
    document.getElementById("newTaskResponsible").value = "";
}

function hideTask(event){
    document.getElementById(event.target.parentNode.parentNode.id).style.display = "none";
}

function moveTaskTo(event){
    let newState = event.target.value;
    let taskId = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;

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

function start(){
    for(t of tasks){
        let task = createTask(t);
        addTaskToList(t.state, task, t.name);
    }
    document.getElementById("normal").addEventListener('dragover', checkDrapPosition);
    document.getElementById("andamento").addEventListener('dragover', checkDrapPosition);
    document.getElementById("completada").addEventListener('dragover', checkDrapPosition);
}

window.onload = start;