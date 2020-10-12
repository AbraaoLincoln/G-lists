var normalTasks = []
var inProgressTasks = []
var finishedTasks = []

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
        btnMoveToNormal.addEventListener('click', moveTaskToNewState);
        let btnMoveToInProgress = document.createElement("INPUT");
        btnMoveToInProgress.type = "button";
        btnMoveToInProgress.className = "btnDropdown2";
        btnMoveToInProgress.value = "andamento";
        btnMoveToInProgress.placeholder = "Andamento";
        btnMoveToInProgress.addEventListener('click', moveTaskToNewState);
        let btnMoveToFinished = document.createElement("INPUT");
        btnMoveToFinished.type = "button";
        btnMoveToFinished.className = "btnDropdown2";
        btnMoveToFinished.value = "completada";
        btnMoveToFinished.placeholder = "Completada";
        btnMoveToFinished.addEventListener('click', moveTaskToNewState);
        divMenu2.appendChild(btnMoveToNormal);
        divMenu2.appendChild(btnMoveToInProgress);
        divMenu2.appendChild(btnMoveToFinished);
        divDropdown2.appendChild(divMenu2);
        //Mounting the dropdown
        divMenu1.appendChild(divDropdown2);
        //Creating button edit
        let btnEdit = document.createElement("BUTTON");
        btnEdit.type = 'button';
        btnEdit.className = 'btnDropdown1 litleadJutment';
        btnEdit.innerText = 'Editar';
        btnEdit.addEventListener('click', showUpdateForm);
        divMenu1.appendChild(btnEdit);
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
        deleteButton.addEventListener("click", removeTask);
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

//state = estado da tarefa.
//newTask = novo elemento(node) com as informações da nova terefa.
//taskId = id do elemento. 
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

function showAddTask(){
    document.getElementById('divNewTask').style.display = 'flex';
}

function hideAddTask(){
    document.querySelector('.divNewTask').style.display = 'none';
}

function showUpdateForm(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);
    document.getElementById('divChangeTask').style.display = 'flex';
    for(task of tasks){
        if(task.name == selectTask.id){
            document.getElementById('changedTaskName').value = task.name;
            document.getElementById('changedTaskDate').value = task.due;
            document.getElementById('changedTaskResponsible').value = task.responsible;
            document.getElementById('changedStateTask').value = task.state;
            document.getElementById('OGTaskName').value = task.name;
            break;
        }
    } 
}

function hideForm(event){
    document.getElementById(event.target.parentNode.parentNode.parentNode.id).style.display = "none";
}

function updateTaskNode(taskId, task){
    let taskNode = document.getElementById(taskId);
    let divTaskHead = taskNode.children[0];
    let divTaskBody = taskNode.children[1];
    let taskHeadH3 = divTaskHead.children[1];
    let taskBodyTable = divTaskBody.children[0];
    let taskBodyTableRow2 = taskBodyTable.children[1];
    //Updating
    taskHeadH3.innerText = task.name;
    taskBodyTableRow2.children[0].innerText = task.responsible;
    taskBodyTableRow2.children[1].innerText = task.due;
}

//state = estado da lista no qual a nova tarefa vai ser incluida.
function getPos(state){
    if(state == 'normal'){
        return normalTasks.length;
    }else if(state == 'andamento'){
        return inProgressTasks.length;
    }else{
        return finishedTasks.length;
    }
}
//=========================-Funções que alteram o estado da aplicação-===================================

//Cria um elemento com as informações da nova tarefa e o adiciona a lista.
function createNewTask(event){
    event.preventDefault();
    let newTask = {
        name: document.getElementById("newTaskName").value,
        due: document.getElementById("newTaskDate").value,
        responsible: document.getElementById("newTaskResponsible").value,
        state: document.getElementById("stateNewTask").value,
        pos: getPos(document.getElementById("stateNewTask").value)
    }
    let newTaskElement = createTask(newTask);
    addTaskToList(newTask.state, newTaskElement, newTask.name);

    //Maybe temp.
    switch(newTask.state){
        case 'normal':
            normalTasks.push(newTask);
            break;
        case 'andamento':
            inProgressTasks.push(newTask);
            break;
        case 'completada':
            finishedTasks.push(newTask);
            break;
    }

    let addNewTaskOnDB = async () => {
        let response = await fetch('http://localhost:3000/api/task', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                listName: localStorage.getItem('currentListName'),
                task: newTask 
            })
        });

        let resObject = await response.json();
        console.log(resObject);
    }
    addNewTaskOnDB();

    //Cleanig
    document.getElementById("newTaskName").value = "";
    document.getElementById("newTaskDate").value = "";
    document.getElementById("newTaskResponsible").value = "";
}

function removeTask(event){
    let taskToRemove = document.getElementById(event.target.parentNode.parentNode.id);
    let taskList = document.getElementById(taskToRemove.parentNode.id);
    taskList.removeChild(taskToRemove);
    removeTaskObjectFromArray(taskToRemove.id, taskList.id);
}

function removeTaskObjectFromArray(taskNameToRemove, taskState){
    let removeTaskOnDB = async () => {
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
    removeTaskOnDB();
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

//Muda as informações da tarefa como também o estado.
function updateTask(event){
    event.preventDefault();
    let taskNameBefore = document.getElementById('OGTaskName').value;
    for(task of tasks){
        if(task.name == taskNameBefore){
            task.name = document.getElementById('changedTaskName').value;
            task.due = document.getElementById('changedTaskDate').value;
            task.responsible = document.getElementById('changedTaskResponsible').value;
            task.state = document.getElementById('changedStateTask').value;
            updateTaskNode(taskNameBefore, task);
            document.getElementById(taskNameBefore).id = task.name;
            break;
        }
    }
    document.getElementById('divChangeTask').style.display = "none";
}


//Fecth as tarefas do servidor e as coloca nas suas respctivas listas.
function start(){
    document.getElementById('spanListNameTem').innerText = localStorage.getItem('currentListName');
    loadTasks();
    document.getElementById("normal").addEventListener('dragover', previewDropPosition);
    document.getElementById("andamento").addEventListener('dragover', previewDropPosition);
    document.getElementById("completada").addEventListener('dragover', previewDropPosition);
}

async function loadTasks(){
    let response = await fetch(`http://localhost:3000/api/task/${localStorage.getItem('currentListName')}`, {
        method: "GET"
    })
    let lists = await response.json()
    normalTasks = lists.normal;
    inProgressTasks = lists.inProgress;
    finishedTasks = lists.finished;

    normalTasks.sort(compareTaskPos);
    for(t of normalTasks){
        let task = createTask(t);
        addTaskToList(t.state, task, t.name);
    }
    inProgressTasks.sort(compareTaskPos);
    for(t of inProgressTasks){
        let task = createTask(t);
        addTaskToList(t.state, task, t.name);
    }
    finishedTasks.sort(compareTaskPos);
    for(t of finishedTasks){
        let task = createTask(t);
        addTaskToList(t.state, task, t.name);
    }
}

function compareTaskPos(task1, task2){
    if(task1.pos < task2.pos){
        return -1;
    }else if(task1.pos > task2.pos){
        return 1;
    }else{
        return 0;
    }
}

window.onload = start;