const express = require('express');
const iMobApp = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const iMobMember = require('../Schemas/iMobMember');
const ChatRoom = require('../Schemas/iMobChatRoom');


router.get("/", (req, res, next) =>{
    var payload =  {
        pageTitle: "DM ChatRooms",//this sets the rendering page in the url...REMEMBER THAT
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user),
   }
    res.status(200).render("ChatRooms", payload);
})

router.get("/newHeat", (req, res, next) => {

    res.status(200).render("newHeat", {
        pageTitle: "New Heat",
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user),
    });
})
router.get("/:DMid", async (req, res, next) => {
    var userid = req.session.user._id;
    var DMid = req.params.DMid;
    var isChatValid = mongoose.isValidObjectId(DMid);

    var payload = {
        pageTitle: "Direct Message",
        userLoggedIn: req.session.user, 
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    if(!isChatValid){
        payload.errorMessage = "You are trying to access restricted content";
        return  res.status(200).render("DMpage", payload);
    }

    var DM = await ChatRoom.findOne({_id: DMid, iMobMembers: {$elemMatch: {$eq: userid}}})
    .populate("iMobMembers");

    if(DM == null){
        var userfound = await iMobMember.findById(DMid);
        if(userfound != null){
            DM = await getChatByUseriD(userfound._id, userid)
        }
    }
    if(DM == null){
        payload.errorMessage = "You are trying to access restricted content";
    }
    else{
        payload.DM = DM;
    }

    res.status(200).render("DMPage", payload);
})


function getChatByUseriD(userLoggedInId, otherUserId){
    return ChatRoom.findOneAndUpdate({
        isGroupChat: false,
        iMobMembers: {
            $size: 2,
            $all: [
                {$elemMatch: { $eq: mongoose.Types.ObjectId.userLoggedInId}},
                {$elemMatch: { $eq: mongoose.Types.ObjectId.otherUserId}}                
            
            ]
        }
    },
    {
        $setOnInsert: {
            iMobMembers: [userLoggedInId, otherUserId]
        }        
    },
    {
        new: true,
        upsert: true
    })
    .populate("iMobMembers")
}






module.exports = router;
