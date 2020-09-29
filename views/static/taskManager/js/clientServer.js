var tasks = [];
let newTask = {
    name: "Tarefa 1",
    prazo: Date.now(),
    responsible: "Fulano",
    state: "normal"
}
tasks.push(newTask);

function createTask(task){
    let createDivTask = () => {
        let divTask = document.createElement("DIV");
        divTask.className = "task";
        divTask.id = task.name;
        divTask.draggable = true;
        divTask.addEventListener("dragstart", drag);

        return divTask;
    };

    let createDivTaskHead = () => {
        let icon = document.createElement("I");
        let title = document.createElement("H3");
        let deleteButton = document.createElement("SPAN");
        let divTaskHead = document.createElement("DIV");
        divTaskHead.className = "taskHead";
        icon.className = "fas fa-ellipsis-v";
        title.innerHTML = task.name;
        deleteButton.className = "spanDelete";
        deleteButton.innerHTML = "X";
        divTaskHead.appendChild(icon);
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

function addTaskToList(state, newTask){
    switch(state){
        case "normal":
            document.getElementById("normal").appendChild(newTask);
            break;
        case "andamento":
            document.getElementById("andamento").appendChild(newTask);
            break;
        case "completada":
            document.getElementById("completada").appendChild(newTask);
            break;
    }
}

function start(){
    let task = createTask(tasks[0]);
    addTaskToList(tasks[0].state, task);
}

window.onload = start;