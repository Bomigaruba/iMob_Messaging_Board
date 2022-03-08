const express = require('express');
const iMobApp = express();
const router = express.Router();//see loginRoutesPath.js for explanation.
const bodyParser = require("body-parser");//see loginRoutesPath.js for explanation.
const MobMember = require('../../Schemas/iMobMember');
const iMobPosts = require('../../Schemas/iMobPosts');
const Notify = require('../../Schemas/iMobNotifications');


iMobApp.use(bodyParser.urlencoded({extended: false}))// see loginRoutesPath.js for explanation.

router.get("/", async (req, res, next) =>{

    var researchObj = req.query;

    if(researchObj.isComment !== undefined){
        var confirmation = researchObj.isComment == "true";//I am relying on it having a "commentOn" field active in order to delete it
        researchObj.commentOn = {$exists: confirmation}; //$exists is a mongoDB field operator for exists or not
        delete researchObj.isComment;
    }

    if(researchObj.search !== undefined){
        researchObj.content = {$regex: researchObj.search, $options: "i" }; //case insesitive (lower or upper) search
        delete researchObj.search;
    }

    if(researchObj.onlyFriends !== undefined){//yes....."only Friends";)

        var onlyFriends = researchObj.onlyFriends == "true";
        if(onlyFriends){
            var friendIds = [];
            if(!req.session.user.linked){
                req.session.user.linked = [];//deals with a page refresh bug
            }
            req.session.user.linked.forEach(iMobMem =>{
                friendIds.push(iMobMem);
            })
            friendIds.push(req.session.user._id);//this will populate page with my id as well

            researchObj.authoredBy = {$in: friendIds};//tranlsation: find all posts where there is a legal user made
        }
        
        delete researchObj.onlyFriends;
    }

    var feed = await retrivePosts(researchObj);
    res.status(200).send(feed);
})

router.get("/:_id", async (req, res, next) =>{//specifcally for comments
    var commentId = req.params._id;//always remember that ("/:_id") has to be the same thing as the end of req.params."insert_here"
    //for this to work
    
    var feedData = await retrivePosts({_id: commentId });
    feedData = feedData[0];

    var feed = {
        feedData: feedData
    }
    if(feedData !== undefined){//checking to see if I can make this a messaeg thread
        feed.commentOn = feedData.commentOn;
    }

    feed.messageThread = await retrivePosts({commentOn: commentId});//sending back maessage thread to the server to update
    
    res.status(200).send(feed);
})


router.post("/", async (req, res, next) =>{
    if(!req.body.content){
        console.log("You aint got no yeezy?")
        return res.sendStatus(400);
    }
    var postedData = {
        content: req.body.content,
        //remember the middlewar.js check for the user who is in session? well w/ that I could use that to display who posted this message
        authoredBy: req.session.user
    }

    if(req.body.commentOn){
        postedData.commentOn = req.body.commentOn;
    }
    iMobPosts.create(postedData)
    .then(async newCreatedPost => {
        newCreatedPost = await MobMember.populate(newCreatedPost, {path: "authoredBy"} )
        newCreatedPost = await iMobPosts.populate(newCreatedPost, {path: "commentOn"} )
        if(newCreatedPost.commentOn !== undefined){
            await Notify.insertNotification(newCreatedPost.commentOn.authoredBy,  req.session.user._id, "Replied to", newCreatedPost._id);
        }
        res.status(201).send(newCreatedPost);//HTTP status for created from on html 101 website for further explanation
    })
    .catch(error => {
        console.log(error);//let's me know what exactly went wrong
        res.sendStatus(400);
    })
})

router.put("/:_id/crown", async (req, res, next) =>{
    var iMobPostId = req.params._id;
    var iMobMemberId = req.session.user._id;

    var isCrowned = req.session.user.crowns && req.session.user.crowns.includes(iMobPostId);
    //above snippet does a check on whether the post has already been liked by the iMobUser in this session
    //console.log("crowned: "+isCrowned);

    //Count # of users that have cosigned this. i.e the array found in the iMobMember.js schema
    // MobMember.findByIdAndUpdate(iMobMemberId, {$addToSet: {cosigns: iMobPostId}}) - adds a count to the cosign section
    // MobMember.findByIdAndUpdate(iMobMemberId, {$pull: {cosigns: iMobPostId}}) - removes a count from the cosign section
    var option = isCrowned ? "$pull" : "$addToSet";
    req.session.user =  await MobMember.findByIdAndUpdate(iMobMemberId, {[option]: {crowns: iMobPostId}}, {new: true}) //reason for await because this page is 
    //still waiting on a handshake from mongoDB to receive data on the array of cosigned posts. putting this await makes sure that
    //the page is not in a race condition with the dynamic pages and can show up on time.
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //count # of posts a specific user has cosgned. i.e found in the iMobPost.js schema
    var post =  await iMobPosts.findByIdAndUpdate(iMobPostId, {[option]: {crowns: iMobMemberId} }, {new: true} ) 
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    if(!isCrowned){
        await Notify.insertNotification(post.authoredBy,  iMobMemberId, "iMobPost Crowned", post._id);
    }
    res.status(200).send(post)
})  

router.post("/:_id/cosign", async (req, res, next) =>{
    var iMobPostId = req.params._id;
    var iMobMemberId = req.session.user._id;

    //this is looking to delete a post that has already been cosigned from the user's log bank.
    var deletedPost = await iMobPosts.findOneAndDelete({authoredBy: iMobMemberId, cosignData: iMobPostId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })   
    var option = deletedPost != null ? "$pull" : "$addToSet";
    var cosignedPost = deletedPost;

    if(cosignedPost == null){
        cosignedPost = await iMobPosts.create({authoredBy: iMobMemberId, cosignData: iMobPostId})
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        }) 
    }

    req.session.user =  await MobMember.findByIdAndUpdate(iMobMemberId, {[option]: {cosigns: cosignedPost._id } }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //count # of posts a specific user has cosigned. i.e found in the iMobPost.js schema
    var post =  await iMobPosts.findByIdAndUpdate(iMobPostId, {[option]: {cosignFromMembers: iMobMemberId} }, {new: true} ) 
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    if(!deletedPost){
        await Notify.insertNotification(post.authoredBy,  iMobMemberId, "Cosigned", post._id);
    }
    res.status(200).send(post)
}) 

router.delete("/:_id", (req, res, next) =>{
    iMobPosts.findByIdAndDelete(req.params._id)
    .then(() => res.sendStatus(202))
    .catch( error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:_id", async (req, res, next) =>{
    if(req.body.Capping !== undefined){
        await iMobPosts.updateMany({authoredBy: req.session.user}, {Capping: false})
        .catch( error => {
            console.log(error);
            res.sendStatus(400);
        })       
    }

    iMobPosts.findByIdAndUpdate(req.params._id, req.body)
    .then(() => res.sendStatus(204))
    .catch( error => {
        console.log(error);
        res.sendStatus(400);
    })
})

async function  retrivePosts(dataFodder){//dataFodder is my way of saying posts in the existing comments board
        //This is a refactoring of ajax requests for get, post, and put calls to make my life easier ;)
        var items = await iMobPosts.find(dataFodder)
        .populate("authoredBy")
        .populate("cosignData")
        .populate("commentOn")
        .sort({"createdAt" : -1})//Reason: if I didnt have the ".sort" the program would have placed the newest post..
        //..at the bottom of the feed instead of at the top. The "-1" reorders it so that what would appear at the
        //..bottom gets shifted to the top of the feed.
        .catch(error =>{ console.log(error); })

        feed = await MobMember.populate(items, { path: "commentOn.authoredBy"});// for user who comment on other users
        return await MobMember.populate(items, { path: "cosignData.authoredBy"});
}
module.exports = router;
