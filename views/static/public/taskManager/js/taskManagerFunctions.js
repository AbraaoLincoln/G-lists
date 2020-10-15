var globalTaskId = "";
var normalTasks = []
var inProgressTasks = []
var finishedTasks = []

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

//Funções que muda o estado da tarefa.

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

//Função que adicionam tarefas as listas.

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
    
    addNewTaskOnDB(newTask);

    //Cleanig
    document.getElementById("newTaskName").value = "";
    document.getElementById("newTaskDate").value = "";
    document.getElementById("newTaskResponsible").value = "";
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

//Funções que atualizam as tarefas.

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


//Funções que manipulam os formularios da pagina.

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
