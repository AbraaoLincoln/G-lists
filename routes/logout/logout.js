const express = require('express');
const router = express.Router();
const verifyToken = require('../../util/security/verifyToken');

router.delete('/', verifyToken, (req, res) => {
    res.clearCookie('jwtToken');
    res.json({status: "ok"})
})

module.exports = router;