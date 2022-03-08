const express = require('express');
const iMobApp = express();
const router = express.Router();//comes with express framework
const bodyParser = require("body-parser");//body-parser dependency in use
const bcrypt = require("bcrypt");//when sending the info to my database I do not want the passowrd to be sent unencrypted so this helps w/
//hash function masking
const MobMember = require('../Schemas/iMobMember');

iMobApp.use(bodyParser.urlencoded({extended: false}))// What this does? this sets the body to only 
//contain key value pairs of strings or arrays. if truethen any datat type would be accepts.

router.get("/", (req, res, next) =>{
    if(req.session){
        req.session.destroy( () => {
            res.redirect("/login");
        });
    }

})
module.exports = router;