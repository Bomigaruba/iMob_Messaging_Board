const express = require('express');
const iMobApp = express();
const router = express.Router();//see loginRoutesPath.js for explanation.
const bodyParser = require("body-parser");//see loginRoutesPath.js for explanation.
const MobMember = require('../../Schemas/iMobMember');
const iMobPosts = require('../../Schemas/iMobPosts');
const ChatRoom = require('../../Schemas/iMobChatRoom');
const Message = require('../../Schemas/iMobMessage');
const Notify = require('../../Schemas/iMobNotifications');
iMobApp.use(bodyParser.urlencoded({extended: false}))// see loginRoutesPath.js for explanation.

router.get("/", async (req, res, next) =>{

    var researchObj = { UserTo: req.session.user._id, NotiType:{$ne: "newMessage"}};

    if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true"){
        researchObj.readBy = false;
    }
    Notify.find(researchObj)
    .populate("UserTo")
    .populate("UserFrom")
    .sort({createdAt: -1})
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})
router.get("/brandNew", async (req, res, next) =>{

    Notify.findOne({ UserTo: req.session.user._id})
    .populate("UserTo")
    .populate("UserFrom")
    .sort({createdAt: -1})
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})

router.put("/:_id/markedAsOpened", async (req, res, next) =>{

    Notify.findByIdAndUpdate(req.params._id, {readBy: true})
    .then(() => res.status(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})
router.put("/markedAsOpened", async (req, res, next) =>{

    Notify.updateMany({UserTo: req.session.user._id}, {readBy: true})
    .then(() => res.status(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    
})


module.exports = router;
