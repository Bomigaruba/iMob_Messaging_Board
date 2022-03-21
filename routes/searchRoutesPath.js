const express = require('express');
const iMobApp = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const iMobMember = require('../Schemas/iMobMember');


router.get("/", (req, res, next) =>{
    var payload = createPayload(req.session.user)
    res.status(200).render("search", payload);
})
router.get("/:selectedTab", (req, res, next) =>{
    var payload = createPayload(req.session.user)
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("search", payload);
})
function  createPayload (userLoggedIn){
    return {
        pageTitle: "Search",//this sets the rendering page in the url...REMEMBER THAT
        userLoggedIn: userLoggedIn, 
        userLoggedInJs: JSON.stringify(userLoggedIn),
   }
}
module.exports = router;
