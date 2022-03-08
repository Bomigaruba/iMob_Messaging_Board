const express = require('express');
const iMobApp = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const iMobMember = require('../Schemas/iMobMember');
const ChatRoom = require('../Schemas/iMobChatRoom');




router.get("/", (req, res, next) => {

    res.status(200).render("pushNotifications", {
        pageTitle: "Notifications",
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user),
    });
})











module.exports = router;
