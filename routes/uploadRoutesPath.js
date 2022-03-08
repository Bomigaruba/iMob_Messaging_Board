const express = require('express');
const iMobApp = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const iMobMember = require('../Schemas/iMobMember');


router.get("/images/:path", (req, res, next) =>{

    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})

module.exports = router;
