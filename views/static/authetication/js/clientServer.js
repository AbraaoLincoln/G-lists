function login(event){
    event.preventDefault();
    let regexAllowed = /^[A-Za-z_0-9 ]+$/
    let usrName = document.getElementById("userName").value;
    let usrPassword = document.getElementById("userPassword").value;

    //Authenticate on AuthServer
    let authUser = async () => {
        let response = await fetch('http://localhost:4000/login', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: usrName, password: usrPassword})
        })

        let data = await response.json();
        console.log(data);
    }
    //Validation
    if(regexAllowed.test(usrName)) authUser();
}

function createAccount(){
    let usrName = document.getElementById("newUserName").value;
    let usrPassword = document.getElementById("newUserPassword").value;
    let confPass = document.getElementById("confNewUserPassword").value;
    let usrEmail = document.getElementById("newUserEmail").value;
    //Regex
    let regexAllowed = /^[A-Za-z_0-9 ]+$/
    let regexEmail = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com$/
    let regexEmailBr = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com.br$/

    let createAcc = async () => {
        let response = await fetch('http://localhost:4000/createAcount', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: usrName, password: usrPassword, email = usrEmail})
        })

        let data = await response.json();
        console.log(data);
    }

    if(regexAllowed.test(usrName) && (usrPassword == confPass) && (regexEmail(usrEmail) || regexEmailBr(usrEmail))) createAcc();
}