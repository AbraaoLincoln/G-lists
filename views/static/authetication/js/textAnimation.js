var taskList1 = ["Crie seus to do list", "Gerencie os seus to list", "Compartilhe"];
var taskList2 = ["Escolha um nome de usuario", "Escolha um e-mail que você usa","Escolha um senha forte", "Confirme a senha pra ter certeza", "Crie sua conta e aproveite o G-Lists"];

function typeWrite(tasks, startTask){
    let currentTask = 0; 
    let task = tasks[currentTask];
    let span = document.getElementById(`task${currentTask + startTask}`);
    let arrow = document.getElementById(`arrow${currentTask + startTask}`);
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
        span.innerHTML += task[count];
        count++;
        if( count < task.length){ 
            setTimeout(write, 100);
        }else{
            currentTask++;
            if(currentTask < tasks.length){
                count = 0;
                span = document.getElementById(`task${currentTask + startTask}`);
                arrow.style.visibility = "visible";
                arrow = document.getElementById(`arrow${currentTask + startTask}`);
                task = tasks[currentTask];
                write();  
            }
        }
    }
    write();
}

function startAnimation(){
    setTimeout(typeWrite, 1000, taskList1, 1);
    document.getElementsByTagName('h1')[0].style.transform = 'scale(1)';
}

function showJoin(event){
    document.querySelector('.divLeftText').style.display = "none"
    let child = document.querySelector('.loginForm').children
    for(c of child){
        c.style.visibility = "hidden";
    }
    document.getElementById('divRightLogin').style.animationName = 'moveFormToLeft';

    let secondPart = () => {
        setTimeout(typeWrite, 1000, taskList2, 4);
        document.getElementById('div1').style.display = "none";
        document.getElementById('div2').style.display = "flex";
    }

    setTimeout(secondPart, 500);
}

window.onload = startAnimation;