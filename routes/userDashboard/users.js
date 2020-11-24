var express = require('express');
var router = express.Router();
const path = require('path');
const verifyToken = require('../../util/security/verifyToken')

router.get('/', verifyToken, (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, '../../views/pages/userDashboard/')})
});

module.exports = router;
