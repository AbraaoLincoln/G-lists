async function addNewTaskOnDB(newTask){
    try {
        let response = await fetch('http://localhost:3000/task', {
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
    }catch(err){
        console.log(err);
    }
}

async function updateTaskStateOnDB(tasks, oldName, oldState){
    try {
        let response = await fetch('http://localhost:3000/task', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                listName: localStorage.getItem('currentListName'),
                control: {oldName: oldName, oldState: oldState},
                tasks: tasks
            })
        })
        let data = await response.json();
        console.log(data);   
    }catch(err){
        console.log(err);
    }
}

async function updateTaskPosOnDB(tasksToUpdate){
    try {
        let response = await fetch('http://localhost:3000/task', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                listName: localStorage.getItem('currentListName'),
                tasks: tasksToUpdate,
                control: {oldName: null, oldState: null}
            })
        })
    
        let data = await response.json();
        console.log(data);   
    }catch(err){
        console.log(err);
    }
}

async function removeTaskOnDB(taskNameToRemove, taskState){
    try {
        let response = await fetch('http://localhost:3000/task', {
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
    }catch(err){
        console.log(err);
    }
}