const express = require('express');
const iMobApp = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const iMobMember = require('../Schemas/iMobMember');


router.get("/:_id", (req, res, next) =>{

    var payload = {
    pageTitle: "Post Thread",//this sets the rendering page in the url...REMEMBER THAT
    userLoggedIn: req.session.user, 
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params._id
}
    res.status(200).render("iMobPostPage", payload);
})
module.exports = router;