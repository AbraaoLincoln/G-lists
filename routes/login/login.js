const express = require('express');
const route = express.Router();
const path = require('path');

route.get('/', (req, res) => {
    console.log()
    res.sendFile('login.html', { root: path.join(__dirname, '../../views/static/authetication/') }, (err) => console.log(err));
})

module.exports = route;