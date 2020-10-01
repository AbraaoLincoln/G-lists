const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/taskList', (req, res) => {
    //Only for test period.
    res.sendFile('index.html', {root: path.join(__dirname, '../../views/static/taskManager/')})
});