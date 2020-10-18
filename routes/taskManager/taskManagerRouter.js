const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    //Only for test period.
    res.sendFile('index.html', {root: path.join(__dirname, '../../views/pages/taskManager/')})
});

module.exports = router;