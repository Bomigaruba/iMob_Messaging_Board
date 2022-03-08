const express = require('express');//Main Dependecy for code
const iMobApp = express();//Initilize it
const port = process.env.PORT || 3005;//port number app will run on
const middleware = require("./Middleware_Check");//This is for checking that the user is logged in or not
const path = require("path");//this tells the express instance to listen on our port for anyone joining
const bodyParser = require("body-parser");//body-parser dependency in use
const mongoose = require("./iMobDatabase");//initialize the mongoose dependency through iMobDatabse.js file
//const Trivia = require("./Didyouknow");//
const session = require("express-session");
const server = iMobApp.listen(port, () => console.log('Server is listening on port ' + port))
const io = require("socket.io")(server, {pingTimeout: 60000});

//Creating a USER SCEHEMA, this is essentially a model where i can declare the fields for my collection
//which my data types will have. So when I insert data into this, it will look at the types i have decleared before inserting

/*
ABOVE IS WHERE THE DEPENDECIES DECLARATIONS & INITIALIZATIONS ARE SET
*/
//console.log(Trivia.facts)//

iMobApp.set("view engine", "pug");//Template engines, this has placeholders for our data on web app, like pug
iMobApp.set("views", "views");

//BODY-PARSER DEPENDENCY
iMobApp.use(bodyParser.urlencoded({extended: false}))// What this does? this seets the body to only contain key value pairs of strings or arrays. if truethen any datat type would be accepts 

iMobApp.use(express.static(path.join(__dirname, "Global")));//gives the absolute path to
//Global folder. The code snippet indicates that anythin within this folder is to be served
//as a static file to the user

//USER SESSIONS
iMobApp.use(session({
    //this is used to initialize a session for the user and hash(encrypt) it so that it is proteceted from any hijacking
    //from hackers. The contents of the secret can be anything i want, the encryption will lock it up for me so that it's unique to what I have
    //set it to
    secret: "Omaewamo-Shinderu",//It's an inside joke, you wouldn't get it
    resave: true,//forcing the session to be saved to the storage database even if nothing was done during that session. i.e the user logged in and immediately logged out
    saveUninitialized: false //
}))
//ROUTES SUB SET
const loginRoutePath = require('./routes/loginRoutesPath');
const logoutRoute = require('./routes/logout');
const registerRoutePath = require('./routes/registerRoutesPath');
const pagesRoutePath = require('./routes/pagesRoutesPath');
const mobProfileRoutePath = require('./routes/MobProfileRoutesPath');
const uploadRoute = require('./routes/uploadRoutesPath');
const searchRoute = require('./routes/searchRoutesPath');
const mobmessagesRoutes = require('./routes/MobMessagesPath');
const notificationsRoutes = require('./routes/notificationsRoutesPath');


const postApiRoutePath = require('./routes/Api/postsRoutesPath');
const usersApiRoutePath = require('./routes/Api/usersRoutesPath');
const DMsApiRoutePath = require('./routes/Api/DMs');
const pushNotificationsApiRoutePath = require('./routes/Api/pushNotifications');
const messagesApiRoutePath = require('./routes/Api/messagesRoutesPath');


iMobApp.use("/login",loginRoutePath);
iMobApp.use("/logout", logoutRoute)
iMobApp.use("/register", registerRoutePath);
iMobApp.use("/iMobPostPage", middleware.requireLogin, pagesRoutePath);//just to ensure I can catch illegal page hopping :)
iMobApp.use("/iMobProfilePage", middleware.requireLogin, mobProfileRoutePath);
iMobApp.use("/uploads", uploadRoute);
iMobApp.use("/Search", middleware.requireLogin, searchRoute);
iMobApp.use("/Messages", middleware.requireLogin, mobmessagesRoutes);
iMobApp.use("/Notifications", middleware.requireLogin, notificationsRoutes);

iMobApp.use("/Api/postsRoutesPath", postApiRoutePath);
iMobApp.use("/Api/usersRoutesPath", usersApiRoutePath);
iMobApp.use("/Api/DMs", DMsApiRoutePath);
iMobApp.use("/Api/Notifications", pushNotificationsApiRoutePath);
iMobApp.use("/Api/Messages",  messagesApiRoutePath);
//now we will see how to render content to web page
//I will initialize the middleware part that will check if the user is
//logged in. this is before the (res, req, next) snippet below
iMobApp.get("/", middleware.requireLogin, (req, res, next) =>{
    var payload = {
        pageTitle: "Lounge",
        userLoggedIn: req.session.user, //this passes the name of the mob username of the user to the home page so that they have an idea of who
        //they are signed in as.
        userLoggedInJs: JSON.stringify(req.session.user)//this is done so that i can trap teh id of who is currently logged in
        //as a variable to assign it to a display iconn on the client side. This is specifically for the base-layout.pug
    }
    res.status(200).render("home", payload);//this makes the Title of my web page more dynamic
})

io.on("connection", (socket) => {
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("join room", room => socket.join(room));
    socket.on("typing", DMid => socket.in(DMid).emit("typing"));
    socket.on("stop typing", DMid => socket.in(DMid).emit("stop typing"));
    socket.on("Notification received", DMid => socket.in(DMid).emit("Notification received"));

    socket.on("new message", newMessage => {
        var DM = newMessage.chat;
        if(!DM.iMobMembers){return console.log("user not found")}
        DM.iMobMembers.forEach(user =>{
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage);
        })
    });

})
