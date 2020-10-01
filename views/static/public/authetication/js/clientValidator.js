function isName(){
    let regexAllowed = /^[A-Za-z_0-9 ]+$/
    let valueInput = document.getElementById('newUserName').value

    if(regexAllowed.test(valueInput)){
        document.getElementById('newUserName').style.outlineColor = "#266dd3"
    }else{
        document.getElementById("newUserName").style.outlineColor = "#BD1E1E"
    }
}

function isEmail(){
    let regexEmail = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com$/
    let regexEmailBr = /^\w+[\w+[.-]*\w+]*?@[A-Za-z]+\.com.br$/
    let valueInput = document.getElementById('newUserEmail').value

    if(regexEmail.test(valueInput) || regexEmailBr.test(valueInput)){
        document.getElementById("newUserEmail").style.outlineColor = "#124E78"
    }else{
        document.getElementById("newUserEmail").style.outlineColor = "#BD1E1E"
    }
}

function checkPasswords(){
    let password = document.getElementById("newUserPassword").value
    let passwordConfirmation = document.getElementById('confNewUserPassword').value

    if(password === passwordConfirmation){
        document.getElementById("confNewUserPassword").style.outlineColor = "#124E78"
    }else{
        document.getElementById("confNewUserPassword").style.outlineColor = "#BD1E1E"
    }
}