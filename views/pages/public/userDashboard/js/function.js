var oldListName = '';
var numberOfColumns = 5;
var columnToAdd = 1;
var listElements = [];
var searchMode = false;
var strToSearch = '';

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
    window.location.href = "/taskManager"
    // window.location.href = "/newTaskManager"
}

function createNewList(event){
    saveNewListOnBD(document.getElementById('nameNewList').value);
    addListToColumn([document.getElementById('nameNewList').value]);
    hideForm(event);
}

function pageColors(event){
    let body = document.getElementsByTagName('body')[0];

    if(event.target.checked){
        body.style.backgroundColor = "#272d2d"
        let lists = document.querySelectorAll('.divListNameWhite');
        for(l of lists){
            l.className = 'divListName';
        }
    }else{
        body.style.backgroundColor = "#f6f8ff"
        document.querySelector('.divListName').className = 'divListNameWhite';
        let lists = document.querySelectorAll('.divListName');
        for(l of lists){
            l.className = 'divListNameWhite';
        }
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
        let list = createListNameElement(listName);
        listElements.push(list);
        if(!searchMode || listName.includes(strToSearch)){ 
            let column = 'col'+ columnToAdd;
            document.getElementById(column).appendChild(list);
            if(columnToAdd == numberOfColumns){
                columnToAdd = 1;
            }else{
                columnToAdd++;
            }
        }
    };
}

function loadProfile(){
    alert("pagina ainda esta sendo desenvolvida");
}

function start(){
    if(window.screen.width <= 600){
        numberOfColumns = 1;
    }else if(window.screen.width <= 900){
        numberOfColumns = 4;
    }
    createColunms();
    loadUserInfo();
    loadList();
}

window.onload = start;
window.onresize = updateColumns;

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
    let deleteOnBDSuccessful = true;
    if(deleteOnBDSuccessful){
        listElements = listElements.filter((list) => {
            if(list.children[0].innerText !== event.target.parentNode.children[0].innerText){
                return true;
            }else{
                return false;
            }
        });
        updateListOnScreen(listElements);
    }
}

function updateListOnScreen(listOfElementsToShow){
    columnToAdd = 1;
    cleanColumns();
    for(list of listOfElementsToShow){
        let column = 'col'+ columnToAdd;
        document.getElementById(column).appendChild(list);
        if(columnToAdd == numberOfColumns){
            columnToAdd = 1;
        }else{
            columnToAdd++;
        }
    };
}

function createColunms(){
    document.getElementById('divMainLists').innerHTML = '';
    for(let i = 0; i < numberOfColumns; i++){
        let div = document.createElement('DIV');
        div.className = 'col-' + (i + 1);
        div.id = 'col' + (i + 1);
        document.getElementById('divMainLists').appendChild(div);
    }
}

function cleanColumns(){
    for(let i = 0; i < numberOfColumns; i++){
        document.getElementById('col' + (i+1)).innerHTML = '';
    }
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

function search(){
    strToSearch = document.getElementById('searchString').value;
    if(strToSearch !== ''){
        // console.log(listElements[0].children[0].innerText.includes(subStr));
        searchMode = true;
        let searchResult = listElements.filter(list => {
            return list.children[0].innerText.includes(strToSearch);
        });
        updateListOnScreen(searchResult);
    }else{
        searchMode = false;
        updateListOnScreen(listElements);
    }
}

function updateColumns(){
    // console.log(window.screen.width);
    if(window.screen.width == window.innerWidth){
        if(window.screen.width <= 600){
            numberOfColumns = 1;
            createColunms();
            updateListOnScreen(listElements);
        }else if(window.screen.width <= 900){
            numberOfColumns = 4;
            createColunms();
            updateListOnScreen(listElements);
        }else{
            numberOfColumns = 5;
            createColunms();
            updateListOnScreen(listElements);
        }
    }
}