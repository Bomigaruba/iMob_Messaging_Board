const express = require('express');
const iMobApp = express();
const router = express.Router();//see loginRoutesPath.js for explanation.
const bodyParser = require("body-parser");//see loginRoutesPath.js for explanation.
const MobMember = require('../../Schemas/iMobMember');
const iMobPosts = require('../../Schemas/iMobPosts');
const ChatRoom = require('../../Schemas/iMobChatRoom');
const Message = require('../../Schemas/iMobMessage');


iMobApp.use(bodyParser.urlencoded({extended: false}))// see loginRoutesPath.js for explanation.

router.post("/", async (req, res, next) =>{

    if(!req.body.iMobMembers){
        console.log("user not")
        return res.sendStatus(400);
    }
  
    var iMobChatMembers = JSON.parse(req.body.iMobMembers);

    if(iMobChatMembers.length == 0){
        return res.sendStatus(400);
    }
    iMobChatMembers.push(req.session.user);
    var chatData = {
        iMobMembers: iMobChatMembers,
        isGroupChat: true
    };
    ChatRoom.create(chatData)
    .then(feed => res.status(200).send(feed))
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })
})


router.get("/", async (req, res, next) =>{

        ChatRoom.find( {iMobMembers: {$elemMatch:{ $eq: req.session.user._id }}})
        .populate("iMobMembers")
        .populate("latestMessage")
        .sort({udatedAt: -1})//reorder my chat list by most recent messages.
        .then(async chats => {

            if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true"){
                chats = chats.filter(r => r.latestMessage && !r.latestMessage.readBy.includes(req.session.user._id));
            }
            chats = await MobMember.populate(chats, {path: "latestMessage.sender"})
            res.status(200).send(chats)
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
})
router.get("/:DMid", async (req, res, next) =>{

    ChatRoom.findOne({_id: req.params.DMid, iMobMembers: {$elemMatch:{ $eq: req.session.user._id }}})
    .populate("iMobMembers")
    .then(chats => res.status(200).send(chats))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})
router.put("/:DMid", async (req, res, next) =>{

    ChatRoom.findByIdAndUpdate(req.params.DMid, req.body)
    .then(chats => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


router.get("/:DMid/Messages", async (req, res, next) =>{

    Message.find({chat: req.params.DMid})
    .populate("sender")
    .then(chats => res.status(200).send(chats))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


router.put("/:DMid/Messages/markedAsRead", async (req, res, next) =>{

    Message.updateMany({chat: req.params.DMid}, {$addToSet: {readBy: req.session.user._id}})
    .then(() => res.sendStatus(204))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})
module.exports = router;
