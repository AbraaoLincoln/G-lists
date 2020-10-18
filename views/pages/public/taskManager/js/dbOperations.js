async function addNewTaskOnDB(newTask){
    let response = await fetch('http://localhost:3000/api/task', {
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
}

async function updateTaskStateOnDB(tasks, oldName, oldState){
    let response = await fetch('http://localhost:3000/api/task', {
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
}

async function updateTaskPosOnDB(tasksToUpdate){
    let response = await fetch('http://localhost:3000/api/task', {
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
}

async function removeTaskOnDB(taskNameToRemove, taskState){
    let response = await fetch('http://localhost:3000/api/task', {
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
}