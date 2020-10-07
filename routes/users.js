var express = require('express');
var router = express.Router();
const path = require('path');
const verifyToken = require('../myModules/security/verifyToken')

router.get('/', verifyToken, (req, res) => {
  console.log("cookies-", req.cookies);
  res.sendFile('index.html', {root: path.join(__dirname, '../views/static/userDashboard/')})
});

module.exports = router;
