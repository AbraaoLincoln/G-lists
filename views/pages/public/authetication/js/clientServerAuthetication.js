function login(event){
    event.preventDefault();
    let regexAllowed = /^[A-Za-z_0-9 ]+$/
    let usrName = document.getElementById("userName").value;
    let usrPassword = document.getElementById("userPassword").value;

    //Authenticate on AuthServer
    let authUser = async () => {
        let response = await fetch('http://localhost:3000/authenticateUser', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: usrName, password: usrPassword})
        })

        let data = await response.json();
        console.log("status-", data.status)
        if(data.status == 'ok'){ 
            window.location.href = 'http://localhost:3000/dashboard';
        }else{
            alert('Senha ou usuário invalidos');
        }
    }
    //Validation
    if(regexAllowed.test(usrName)) authUser();
}

function join(event){
    event.preventDefault();
    let usrName = document.getElementById("newUserName").value;
    let usrPassword = document.getElementById("newUserPassword").value;
    let confPass = document.getElementById("confNewUserPassword").value;
    let usrEmail = document.getElementById("newUserEmail").value;
    //Regex
    let regexAllowed = /^[A-Za-z_0-9 ]+$/
    let regexEmail = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com$/
    let regexEmailBr = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com.br$/

    let createAcc = async () => {
        let response = await fetch('http://localhost:3000/createAcount', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: usrName, password: usrPassword, email: usrEmail})
        })

        let data = await response.json();
        console.log(data)
        if(data.status == "ok"){
            alert(data.mgs);
            window.location.href = 'http://localhost:3000/login';
        }else{
            alert(data.mgs);
        }
    }

    if(regexAllowed.test(usrName) && (usrPassword == confPass) && (regexEmail.test(usrEmail) || regexEmailBr.test(usrEmail))) createAcc();
}
