const express = require('express');
const iMobApp = express();
const router = express.Router();//see loginRoutesPath.js for explanation.
const bodyParser = require("body-parser");//see loginRoutesPath.js for explanation.
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/"});
const MobMember = require('../../Schemas/iMobMember');
const iMobPosts = require('../../Schemas/iMobPosts');
const Notify = require('../../Schemas/iMobNotifications');



iMobApp.use(bodyParser.urlencoded({extended: false}));// see loginRoutesPath.js for explanation.

router.get("/", async (req, res, next) =>{
    var researchObj = req.query;
   
        if(req.query !== undefined){
            researchObj = {
                $or: [
                    {FirstName: {$regex: req.query.search, $options: "i"}},
                    {LastName: {$regex: req.query.search, $options: "i"}},
                    {UserName: {$regex: req.query.search, $options: "i"}},  
                ]
            }
        }

        MobMember.find(researchObj)
        .then(results => {  res.status(200).send(results)})
        .catch( error =>{ console.log(error);  res.sendStatus(400);})
        
})  


router.put("/:userAS/follow", async (req, res, next) =>{
    var userId = req.params.userAS;
    var user = await MobMember.findById(userId);
    if(user == null) return res.sendStatus(404);

    var isLinked = user.confirmedLinked && user.confirmedLinked.includes(req.session.user._id);
    // res.status(200).send(isLinked);
    console.log(isLinked);
     var option = isLinked ? "$pull" : "$addToSet";

    req.session.user =  await MobMember.findByIdAndUpdate( req.session.user._id, {[option]: { linked: userId }}, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    MobMember.findByIdAndUpdate(userId, {[option]: { confirmedLinked: req.session.user._id} }) 
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    if(!isLinked){
        await Notify.insertNotification(userId,  req.session.user._id, "Joined", req.session.user._id);
    }
    res.status(200).send(req.session.user)
    //console.log(req.session.user);//necesssary since the program is very buggy with null data
})  
    
router.get("/:userAS/linked", async (req, res, next) =>{//grabing all the field that will populate my community search feed.
    MobMember.findById(req.params.userAS)
    .populate("linked")//the linked and other community(confirmedLinked) field should be noted as a list if ids that need to e translated into user objects
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400);
    })

});

router.get("/:userAS/confirmedLinked", async (req, res, next) =>{//grabing all the field that will populate my community search feed.
    MobMember.findById(req.params.userAS)
    .populate("confirmedLinked")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400);
    })
    
});

router.post("/mugShotImage", upload.single("croppedImage"), async (req, res, next) =>{
    if(!req.file){
        console.log("No File sent w/ Ajax request.");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error =>{
        if(error != null){
            console.log(error);
            return res.sendStatus(400);
        }
        req.session.user = await MobMember.findByIdAndUpdate(req.session.user._id, {MugShotPic: filePath }, {new: true})
        res.sendStatus(204);
    })

    
});


router.post("/backdropImage", upload.single("croppedImage"), async (req, res, next) =>{
    if(!req.file){
        console.log("No File sent w/ Ajax request.");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error =>{
        if(error != null){
            console.log(error);
            return res.sendStatus(400);
        }
        req.session.user = await MobMember.findByIdAndUpdate(req.session.user._id, {BackdropPic: filePath }, {new: true})
        res.sendStatus(204);
    })

    
});
module.exports = router;
  