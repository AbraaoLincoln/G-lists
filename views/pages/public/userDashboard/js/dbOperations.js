async function loadUserInfo(){
    try {
        let response = await fetch('http://localhost:3000/user', { method: "GET" });
        let dbRes = await response.json();
        document.getElementById('spanUserName').innerText = dbRes.userInfo.name;
    }catch(err) {
        console.log(err);   
    }
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
    try {
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
    }catch(err) {
        console.log(err);   
    }
}

async function updateListName(listName, newName){
    try {
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
    }catch(err) {
        console.log(err);
    }
}

async function deleteList(listName){
    try {
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