var globalTaskId = "";
var lista = {
    normal: [],
    andamento: [],
    completada: []
}
var taskInfoUpdate = {
    oldName: '',
    oldState: ''
}

var oldListName = '';

//Fecth as tarefas do servidor e as coloca nas suas respctivas lista.
function start(){
    document.getElementById('spanListNameTem').innerText = localStorage.getItem('currentListName');
    loadList();
    loadTasks();
    document.getElementById("normal").addEventListener('dragover', previewDropPosition);
    document.getElementById("andamento").addEventListener('dragover', previewDropPosition);
    document.getElementById("completada").addEventListener('dragover', previewDropPosition);
}

async function loadList(){
    let response = await fetch('http://localhost:3000/list');
    let data = await response.json();

    for(listName of data.listsNames){
        createListNameElement(listName);
    };
}

async function loadTasks(){
    try {
        let response = await fetch(`http://localhost:3000/task/${localStorage.getItem('currentListName')}`);
        let listsFromDB = await response.json()
        lista.normal = listsFromDB.normal;
        lista.andamento = listsFromDB.inProgress;
        lista.completada = listsFromDB.finished;
    
        lista.normal.sort(compareTaskPos);
        for(t of lista.normal){
            let task = createTask(t);
            addTaskToList(t.state, task, t.name);
        }
        lista.andamento.sort(compareTaskPos);
        for(t of lista.andamento){
            let task = createTask(t);
            addTaskToList(t.state, task, t.name);
        }
        lista.completada.sort(compareTaskPos);
        for(t of lista.completada){
            let task = createTask(t);
            addTaskToList(t.state, task, t.name);
        }
        updateHeightWithTasks();   
    }catch(err){
        console.log(err)
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

function changeList(event){
    document.getElementById('spanListNameTem').innerText = event.target.innerText; 
    localStorage.setItem('currentListName', event.target.innerText);
    cleanTask()
    loadTasks();
}

function cleanTask(){
    document.getElementById('normal').innerHTML = '';
    document.getElementById('andamento').innerHTML = '';
    document.getElementById('completada').innerHTML = '';
}

//Funções que mudam o estado da tarefa.

//Move a tarefa selecionda para o fim da lista destino escolhida.
//Muda a cor do elemento para a cor que representa o estado da lista.  
//So muda o estado da tarefa.
function moveTaskToNewState(event){
    let newState = event.target.value;
    let taskId = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;

    updateTaskState(taskId, document.getElementById(taskId).parentNode.id, newState);
    switch(newState){
        case "normal":
            document.getElementById("normal").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#f6f8ff";
            break;
        case "andamento":
            document.getElementById("andamento").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
        case "completada":
            document.getElementById("completada").appendChild(document.getElementById(taskId));
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
    }
}

function updateTaskState(taskName, oldState, newState){

    lista[oldState].forEach((task) => {
        if(task.name == taskName){
            updateTaskPositionAfterDelete(task.pos, task.state);
            task.pos = lista[newState].length;
            task.state = newState;
            lista[newState].push(task);
            updateTaskStateOnDB([task], null, oldState);
        }
    })
    removeTaskFromLocalArray(taskName, oldState);
}


//Funções que mudam a posição das tarefas.

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

function updateTaskPositionAfterDelete(posOfDeleteTask, oldTaskState){
    let taskToUpdatePos = [];
    for(task of lista[oldTaskState]){
        if(task.pos > posOfDeleteTask){
            task.pos -= 1;
            taskToUpdatePos.push(task);
        }
    }

    if (taskToUpdatePos) updateTaskPosOnDB(taskToUpdatePos);
}

function updateTaskPositionOnTheSameList(taskNameGoUp, taskNameGoDown, State){
    let taskToUpdatePos = [];

    for(task of lista[State]){
        if(task.name == taskNameGoUp || task.name == taskNameGoDown){
            taskToUpdatePos.push(task);
        }
        if(taskToUpdatePos.length == 2) break;
    }

    if(taskToUpdatePos.length == 2){
        let auxPos = taskToUpdatePos[0].pos;
        taskToUpdatePos[0].pos = taskToUpdatePos[1].pos;
        taskToUpdatePos[1].pos = auxPos;
        updateTaskPosOnDB(taskToUpdatePos);
    }
}

//Função que adicionam tarefas as lista.

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
            document.getElementById(taskId).style.backgroundColor = "#266dd3";
            break;
        case "completada":
            document.getElementById("completada").appendChild(newTask);
            document.getElementById(taskId).style.backgroundColor = "#218380";
            break;
    }
}

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

    lista[newTask.state].push(newTask);
    
    addNewTaskOnDB(newTask);

    //Cleanig
    document.getElementById("newTaskName").value = "";
    document.getElementById("newTaskDate").value = "";
    document.getElementById("newTaskResponsible").value = "";
}

//state = estado da lista no qual a nova tarefa vai ser incluida.
function getPos(state){
    return lista[state].length;
}

//Funções que atualizam as tarefas.

//Muda as informações da tarefa como também o estado.
// Not working needed to be update.
function updateTask(event){
    event.preventDefault();
    // let taskNameBefore = document.getElementById('OGTaskName').value;
    for(task of lista[taskInfoUpdate.oldState]){
        if(task.name == taskInfoUpdate.oldName){
            task.name = document.getElementById('changedTaskName').value;
            task.due = document.getElementById('changedTaskDate').value;
            task.responsible = document.getElementById('changedTaskResponsible').value;
            task.state = document.getElementById('changedStateTask').value;
            updateTaskStateOnDB([task], taskInfoUpdate.oldName, taskInfoUpdate.oldState);
            updateTaskNode(taskInfoUpdate.oldName, task);
            document.getElementById(taskInfoUpdate.oldName).id = task.name;
            break;
        }
    }
    document.getElementById('divChangeTask').style.display = "none";
}

//Atualiza o elemento da tela.
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


//Remove tarefas da lista

function removeTask(event){
    let taskToRemove = document.getElementById(event.target.parentNode.parentNode.id);
    let taskList = document.getElementById(taskToRemove.parentNode.id);
    taskList.removeChild(taskToRemove);
    removeTaskFromLocalArray(taskToRemove.id, taskList.id);
    removeTaskOnDB(taskToRemove.id, taskList.id);
}

function removeTaskFromLocalArray(taskNameToRemove, taskState){
    lista[taskState] = lista[taskState].filter((task) => {
        if(task.name !== taskNameToRemove) return true;
        return false;
    })
}

//Funções que manipulam as listas

function createNewList(event){
    // createListNameElement(event.target.parentNode.previousElementSibling.value);
    createListNameElement(document.getElementById('nameNewList').value);
    saveNewList(document.getElementById('nameNewList').value);
}

function dltList(event){
    deleteListOnBD(event.target.parentNode.children[0].innerText);
    document.getElementById('lists').removeChild(event.target.parentNode);
}

function updateListName(event){
    if(oldListName !== document.getElementById('newListName').value){
        console.log(oldListName)
        console.log(document.getElementById('newListName').value)
        updateListNameOnBD(oldListName, document.getElementById('newListName').value);
        document.getElementById(oldListName).innerText = document.getElementById('newListName').value;
        document.getElementById(oldListName).id = document.getElementById('newListName').value;
    }
    hideForm(event);
}

//Funções que manipulam os formularios da pagina.

function showAddTask(){
    document.getElementById('divNewTask').style.display = 'flex';
}

function hideAddTask(){
    document.querySelector('.divNewTask').style.display = 'none';
}

function showUpdateForm(event){
    let selectTask = document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.id);
    taskInfoUpdate.oldState = selectTask.parentNode.id;
    document.getElementById('divChangeTask').style.display = 'flex';
    for(task of lista[taskInfoUpdate.oldState]){
        if(task.name == selectTask.id){
            document.getElementById('changedTaskName').value = task.name;
            document.getElementById('changedTaskDate').value = task.due;
            document.getElementById('changedTaskResponsible').value = task.responsible;
            document.getElementById('changedStateTask').value = task.state;
            // document.getElementById('OGTaskName').value = task.name;
            taskInfoUpdate.oldName = task.name;
            break;
        }
    } 
}

function hideForm(event){
    document.getElementById(event.target.parentNode.parentNode.parentNode.id).style.display = "none";
}

function backDashboard(){
    window.location.href ='/dashboard';
}


//Atualiza a altura da div "divMainContent" para caber todas as terefas.
function updateHeightWithTasks(){
    let divMC = document.getElementById('mainContent');
    let newHeight = (lista.normal.length + lista.andamento.length + lista.completada.length) * 20;
    // console.log(window.screen.width)
    if(window.screen.width <= 600){
        if(newHeight > 100){
            divMC.style.height = newHeight + 100 + 'vw';
        }
    }
}

function showFormAddList(){
    document.getElementById('divCreateNewTask').style.display = 'flex';
}

function showFormNewListName(event){
    document.getElementById('updateNameList').style.display = 'flex';
    document.getElementById('newListName').value = event.target.parentNode.children[0].innerText;
    oldListName = document.getElementById('newListName').value;
}