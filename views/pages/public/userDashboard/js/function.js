function hideForm(){
    document.getElementById('divCreateNewTask').style.display = 'none';
}

function showForm(){
    document.getElementById('divCreateNewTask').style.display = 'flex';
}

function loadTaskManager(event){
    localStorage.setItem('currentListName', event.target.innerText);
    window.location.href = "/taskManager"
}

function createNewList(){
    let li = document.createElement("LI");
    li.innerText = document.getElementById('nameNewList').value;
    li.onclick = loadTaskManager;
    document.getElementById('listsNames').appendChild(li);
    saveNewList(document.getElementById('nameNewList').value);
    hideForm()
}

async function loadList(){
    let response = await fetch('http://localhost:3000/api/list', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    })
    let data = await response.json();

    for(listaName of data.listsNames){
        let li = document.createElement("LI");
        li.innerText = listaName;
        li.onclick = loadTaskManager;
        document.getElementById('listsNames').appendChild(li);
    }
}

async function saveNewList(newListName){
    let response = await fetch('http://localhost:3000/api/list', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ list: {name: newListName}})
    })
    let data = await response.json();
    console.log(data);
}

async function updateListName(listName, newName){
    let response = await fetch('http://localhost:3000/api/list', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ listName: listName, newListName: newName })
    })
    let data = await response.json();
    console.log(data);
}

async function deleteList(listName){
    let response = await fetch('http://localhost:3000/api/list', {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ listName: listName })
    })
    let data = await response.json();
    console.log(data);
}

function showHideMenu(){
    let display = document.getElementById('mOpt').style.display;

    if(display ==  'none'){
        document.getElementById('mOpt').style.display = 'block';
    }else{
        document.getElementById('mOpt').style.display = 'none';
    }
}

function pageColors(event){
    let body = document.getElementsByTagName('body')[0];

    if(event.target.checked){
        body.style.backgroundColor = "#272d2d"
    }else{
        body.style.backgroundColor = "#ebefff"
    }
}

async function logout(){
    let res = await fetch('http://localhost:3000/logout', {
        method: 'DELETE'
    })
    let data = await res.json();
    console.log(data);
    if(data.status){
        window.location.href = '/login';
    }
}

function loadProfile(){
    alert("pagina ainda esta sendo desenvolvida");
}

window.onload = loadList;