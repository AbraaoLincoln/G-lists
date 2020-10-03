const jwt = require('jsonwebtoken')

verifyToken = (req, res, next) => {
    const token = req.cookies.jwtToken
    console.log(token)

    if(!token) return res.status(400).send("Acesso negado!")

    try {
        jwt.verify(token, process.env.ACESS_TOKEN, (err, user) =>{
            if(err) res.status(403).send("Token Invalido!");
            req.user = user
            console.log(user)
            next()
        })
    } catch (error) {
        res.status(400).send("Token Invalido!")
    }
}

module.exports = verifyToken