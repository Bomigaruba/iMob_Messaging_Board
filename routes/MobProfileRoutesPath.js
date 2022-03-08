const express = require('express');
const iMobApp = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const iMobMember = require('../Schemas/iMobMember');


router.get("/", (req, res, next) =>{

    var payload = {
         pageTitle: req.session.user.UserName,//this sets the rendering page in the url...REMEMBER THAT
         userLoggedIn: req.session.user, 
         userLoggedInJs: JSON.stringify(req.session.user),
         iMobMemberProfile: req.session.user,
         ErrorImage: "/images/who-dat.gif"

    }
    res.status(200).render("iMobProfilePage", payload);
})

router.get("/:UserName", async (req, res, next) =>{

   var payload = await grabPayload(req.params.UserName, req.session.user);
    res.status(200).render("iMobProfilePage", payload);
})

router.get("/:UserName/Comments", async (req, res, next) =>{

    var payload = await grabPayload(req.params.UserName, req.session.user);
    payload.selectedTab = "Comments"
    res.status(200).render("iMobProfilePage", payload);
 })

//  router.get("/:UserName/notifications", async (req, res, next) =>{

//     var payload = await grabPayload(req.params.UserName, req.session.user);
//     payload.selectedTab = "linked"
//     res.status(200).render("notifications", payload);
//  })

 router.get("/:UserName/linked", async (req, res, next) =>{

    var payload = await grabPayload(req.params.UserName, req.session.user);
    payload.selectedTab = "linked";
    res.status(200).render("communityAndFriends", payload);
 })

 router.get("/:UserName/confirmedLinked", async (req, res, next) =>{

    var payload = await grabPayload(req.params.UserName, req.session.user);
    payload.selectedTab = "confirmedLinked";
    res.status(200).render("communityAndFriends", payload);
 })

async function  grabPayload(UserName, userLoggedIn){
    var iMember = await iMobMember.findOne({UserName: UserName})

    if(iMember == null){
        
            iMember = await iMobMember.findById(UserName);

            if(iMember == null){
                return  { //this is good enough data for me to work with.
                    pageTitle: "Wait..That's Illegal",
                    userLoggedIn: userLoggedIn, 
                    userLoggedInJs: JSON.stringify(userLoggedIn),
                    ErrorImage: "/images/who-dat.gif"
                }
            }
         
    }

    return {
        pageTitle: iMember.UserName,
        userLoggedIn: userLoggedIn, 
        userLoggedInJs: JSON.stringify(userLoggedIn),
        iMobMemberProfile: iMember
    }
}

module.exports = router;
