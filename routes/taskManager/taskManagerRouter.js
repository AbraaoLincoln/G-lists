const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../../util/security/verifyToken');

router.get('/', verifyToken, (req, res) => {
    res.sendFile('taskManager.html', {root: path.join(__dirname, '../../views/pages/taskManager/')})
});

module.exports = router;