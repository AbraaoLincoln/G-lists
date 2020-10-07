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

function createNewList(event){
    let li = document.createElement("LI");
    li.innerText = document.getElementById('nameNewList').value;
    li.onclick = loadTaskManager;
    document.getElementById('listsNames').appendChild(li);
    hideForm()
}