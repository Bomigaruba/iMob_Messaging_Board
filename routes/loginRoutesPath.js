const express = require('express');
const iMobApp = express();
const router = express.Router();//comes with express framework
const bodyParser = require("body-parser");//body-parser dependency in use
const bcrypt = require("bcrypt");//when sending the info to my database I do not want the passowrd to be sent unencrypted so this helps w/
//hash function masking
const iMobMember = require('../Schemas/iMobMember');

iMobApp.set("view engine", "pug");
iMobApp.set("views", "views");

iMobApp.use(bodyParser.urlencoded({extended: false}))// What this does? this sets the body to only 
//contain key value pairs of strings or arrays. if truethen any datat type would be accepts.

router.get("/", (req, res, next) =>{
    res.status(200).render("login");//has been configured to handle
    //login requests at the ./ level and then export it from the file
})

router.post("/", async (req, res, next) =>{

    var payload = req.body;// This will aid the potnetial new member to  ve able to put all the
    //info he just put on the screen directly into the new window he was redircted to without having to wrote it
    //all out

    if(req.body.logMobUserName && req.body.logMobPassword){//req.body.logMobUserName & req.body.logPassword can be found on login.pug
        var existingiMobMember = await iMobMember.findOne({
            //this is a query example, and it runs ascynchronously so it could take aas long as it wants to, executing the findOne() line.
            //there is a console.log(looking into database) line that will run before this findOne completes it search.
            $or:[
                //SPECIFIC MONGODB OPERATOR TO LOOK FOR MULTIPLE FIELDS
                {UserName: req.body.logMobUserName},//I want to make sure no body else is using this userName
                {Password: req.body.logMobPassword}//same idea for email
                
            ]
        })
        .catch(()=>{
            console.log(error);
            payload.errorMessage = "Whoops, internal error.";
            res.status(200).render("login", payload);
        }); 
        if(existingiMobMember != null){
            var encryptionCheck = await bcrypt.compare(req.body.logMobPassword, existingiMobMember.Password)//This is a built in fuction that helps me do a 
            //bird's eye view check of the passwords to see if the one the existing user has entered matches the encrytion in my mongoDB database.
            if(encryptionCheck === true){// the reason I use triple equals is because in the situation where Javascript equated the
                //encryption value to be "1", javascript may see that as "true" in the way binary can see 0 as flase and 1 as true.
                //so a === makes sure it's a boolean type and that it hits the true benchmark.
                req.session.user = existingiMobMember;
                return res.redirect("/");
            }
        }
        payload.errorMessage = "Login Credentials not valid.";
        return res.status(200).render("login", payload);
    }
    payload.errorMessage = "You are missing something in one of your fields.";
    res.status(200).render("login");//takes care of the POST requests
})
module.exports = router;