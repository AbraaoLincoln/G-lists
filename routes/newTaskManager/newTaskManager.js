const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../../util/security/verifyToken');

router.get('/', verifyToken, (req, res) => {
    res.sendFile('newTaskManager.html', {root: path.join(__dirname, '../../views/pages/newTaskManager/')})
});

module.exports = router;