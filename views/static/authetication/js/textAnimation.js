var tasks = ["Crie seus to do list", "Gerencie os seus to list", "Compartilhe"];

function typeWrite(){
    let currentTask = 0;
    let task = tasks[currentTask];
    let span = document.getElementById(`task${currentTask + 1}`);
    let arrow = document.getElementById(`arrow${currentTask + 1}`);
    let showArrow = true;
    let count = 0;
    
    let blinkArrow = () => {
        if(showArrow){
            arrow.style.visibility = "visible";
        }else{
            arrow.style.visibility = "hidden";
        }
        showArrow = !showArrow;
        setTimeout(blinkArrow, 350);
    }
    blinkArrow();

    let write = () => {
        console.log("1")
        span.innerHTML += task[count];
        count++;
        if( count < task.length){ 
            setTimeout(write, 100);
        }else{
            currentTask++;
            if(currentTask < tasks.length){
                count = 0;
                span = document.getElementById(`task${currentTask + 1}`);
                arrow.style.visibility = "visible";
                arrow = document.getElementById(`arrow${currentTask + 1}`);
                task = tasks[currentTask];
                write();  
            }
        }
    }
    write();
}

function startAnimation(){
    setTimeout(typeWrite, 1000);
    document.getElementsByTagName('h1')[0].style.transform = 'scale(1)';
}

window.onload = startAnimation;