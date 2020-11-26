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

   