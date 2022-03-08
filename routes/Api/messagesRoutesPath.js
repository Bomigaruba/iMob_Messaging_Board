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

router.post("/", async (req, res, next) =>{

    if(!req.body.content || !req.body.DMid){
        console.log("Invalid data parsing request")
        return res.sendStatus(400);
    }
  
    var newMessage ={ 
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.DMid
    }
    Message.create(newMessage)
    .then(async message => 
        {
            message = await message.populate("sender");
            message = await message.populate("chat");
            message = await MobMember.populate(message, {path: "chat.iMobMembers"})


           var chat = await ChatRoom.findByIdAndUpdate(req.body.DMid, {latestMessage: message})
            .catch((error) => {
                console.log(error);
           })            
           insertNotifications(chat, message);
           res.status(201).send(message);
        })
    .catch((error) => {
         console.log(error);
        res.sendStatus(400);
    })
})
function insertNotifications(chat, message){
    chat.iMobMembers.forEach( MobMemberID => {
        if(MobMemberID == message.sender.id){return;}
        Notify.insertNotification( MobMemberID, message.sender._id, "newMessage", message.chat._id);
    })
}
module.exports = router;
