var oldListName = '';
var columnToAdd = 1;

function showHideMenu(){
    let display = document.getElementById('mOpt').style.display;

    if(display ==  'none'){
        document.getElementById('mOpt').style.display = 'block';
    }else{
        document.getElementById('mOpt').style.display = 'none';
    }
}

function hideForm(event){
    event.target.parentNode.parentNode.parentNode.style.display = 'none';
}

function showForm(){
    document.getElementById('divCreateNewTask').style.display = 'flex';
}

function loadTaskManager(event){
    localStorage.setItem('currentListName', event.target.innerText);
    // window.location.href = "/taskManager"
    window.location.href = "/newTaskManager"
}

function createNewList(){
    saveNewListOnBD(document.getElementById('nameNewList').value);
    addListToColumn([document.getElementById('nameNewList').value]);
    hideForm()
}

function pageColors(event){
    let body = document.getElementsByTagName('body')[0];

    if(event.target.checked){
        body.style.backgroundColor = "#272d2d"
    }else{
        body.style.backgroundColor = "#ebefff"
    }
}

//DB Opeations
async function loadUserInfo(){
    try {
        let response = await fetch('http://localhost:3000/user');
        let dbRes = await response.json();
        document.getElementById('spanUserName').innerText = dbRes.userInfo.name;
    }catch(err) {
        console.log(err);   
    }
}

async function loadList(){
    let response = await fetch('http://localhost:3000/list');
    let data = await response.json();
    addListToColumn(data.listsNames);
}

//Adicona uma ou mais lista a columa a qual cada uma pertence.
//listsNames = array com os nomes das listas
function addListToColumn(listsNames){
    for(listName of listsNames){
        let column = 'col'+ columnToAdd;
        document.getElementById(column).appendChild(createListNameElement(listName));
        if(columnToAdd == 5){
            columnToAdd = 1;
        }else{
            columnToAdd++;
        }
    };
}

async function saveNewListOnBD(newListName){
    try {
        let response = await fetch('http://localhost:3000/list', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ list: {name: newListName}})
        })
        let data = await response.json();
        console.log(data);
    }catch(err) {
        console.log(err);   
    }
}

async function updateListNameOnBD(listName, newName){
    try {
        let response = await fetch('http://localhost:3000/list', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ listName: listName, newListName: newName })
        })
        let data = await response.json();
        console.log(data);   
    }catch(err) {
        console.log(err);
    }
}

async function deleteListOnBD(listName){
    try {
        let response = await fetch('http://localhost:3000/list', {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ listName: listName })
        })
        let data = await response.json();
        console.log(data);   
    }catch(err){
        console.log(err);
    }
}

async function logout(){
    try {
        let res = await fetch('http://localhost:3000/logout', {
        method: 'DELETE'
        })
        let data = await res.json();
        console.log(data);
        if(data.status){
            window.location.href = '/login';
        }   
    }catch(err){
        console.log(err);
    }
}

function loadProfile(){
    alert("pagina ainda esta sendo desenvolvida");
}

function start(){
    loadUserInfo();
    loadList();
}

window.onload = start;

//novas funcionalidades
function showFormNewListName(event){
    document.getElementById('updateNameList').style.display = 'flex';
    document.getElementById('newListName').value = event.target.parentNode.children[0].innerText;
    oldListName = document.getElementById('newListName').value;
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

function dltList(event){
    deleteListOnBD(event.target.parentNode.children[0].innerText);
    document.getElementById('lists').removeChild(event.target.parentNode);
}

function createListNameElement(listName){
    let divCont = document.createElement("DIV");
    divCont.classList.add("divListName");
    let spanP = document.createElement('SPAN');
    spanP.classList.add("likeP");
    spanP.id = listName;
    spanP.innerText = listName;
    spanP.addEventListener('click', loadTaskManager);
    let pen = document.createElement('I');
    pen.className = 'fas fa-pen editListName';
    pen.addEventListener('click', showFormNewListName);
    let spanX = document.createElement('SPAN');
    spanX.classList.add("spanDltBton");
    spanX.innerText = 'X';
    spanX.addEventListener('click', dltList);
    //Add elements to div
    divCont.appendChild(spanP);
    divCont.appendChild(pen);
    divCont.appendChild(spanX);
    return divCont;
}