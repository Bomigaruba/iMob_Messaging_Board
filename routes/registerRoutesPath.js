
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
    res.status(200).render("register");//has been configured to handles
    //register requests at the ./ level and then export it from the file
})
router.post("/", async (req, res, next) =>{//this being an async function means whereever the await command is calls, the entire functino has to wait
    //until that specific line of code where it is called executes. this is control the execution flow.
    console.log(req.body);//just to check that the actual fields show up as expected in the testing stage

    //Now in the situation that a new user makes a mistake and has a space in the fields like name
    //or password that wasnt intended then I need to account for that
    var FirstName = req.body.FirstName.trim();
    //to conver my bases in cases a user was just to enter all empty fields I would need to go through
    //some QA checking
    var LastName = req.body.LastName.trim();
    var UserName = req.body.UserName.trim();
    var Email = req.body.Email.trim();
    var Password = req.body.Password;//notice that i did not include thos for password, because I know that users
    //might have some unique password cases they would want to implement that could involve spaces at certain spots

    var payload = req.body;// This will aid the potnetial new member to  ve able to put all the
    //info he just put on the screen directly into the new window he was redircted to without having to wrote it
    //all out
    //This snippet does: 1) check for empty fields...2) Check that the isnt already in use
    if(FirstName && LastName && Email && UserName && Password){
       var newiMobMember = await iMobMember.findOne({//this is a query example, and it runs ascynchronously so it could take aas long as it wants to, executing the findOne() line.
            //there is a console.log(looking into database) line that will run before this findOne completes it search.
            $or:[//SPECIFIC MONGODB OPERATOR TO LOOK FOR MULTIPLE FIELDS
                {UserName: UserName},//I want to make sure no body else is using this userName
                {Email: Email}//same idea for email
                
            ]
        })
        .catch(()=>{
            console.log(error);
            payload.errorMessage = "Whoops, internal error.";
            res.status(200).render("register", payload);
        });
        
        if(newiMobMember == null){
        //Everything Gucci, the email and username are valid. now I can make this 
            var newiMobMemberData = req.body;
            newiMobMemberData.Password = await bcrypt.hash(Password, 10);//that "10" number is the number of saltrounds that will be done on this password.i.e 2(^10) or 1024times
            //salt rounds are just a fancy way of how many iterations of the hashing calculation that will be done on what I passed in
            //the more iterations, the longer the execution time however. The positive is that we have a more secured password encryption
            iMobMember.create(newiMobMemberData)
            .then((newiMobMember)=> {
                req.session.user = newiMobMember;//Storing the newly created user in the session as a user property
                return res.redirect("/");//rediricting new user to the home page
            })
        }
        else{
            //Already in use
            if(Email == newiMobMember.Email){
                payload.errorMessage = "Already in use, can't be copying someone's entire email like that.";
            }
            else{
                payload.errorMessage = "Already in use, can't be copying someone's entire iMob name like that.";
            }
            res.status(200).render("register", payload);
        }
        console.log('Looking into database');
        //This will look for 1 "document" in the collection. documents are how mongodb refers to rows in a relational database table
        //so when i say "i am secrhing for a document" i am refering to searching for a row in a database
        //database exercise with MongoDb comes into play here. It's considered a no-SQL system because its doestn have the same sort of 
        //relational database structure like an MySQL. It works with JSON objects and store data at different nodes
        

    }
    else{
        //SERVER-SIDE VALIDATION
        //While in MongoDB, the collections tab in the clusters section of my database is how I will be able to integrate my objects
        payload.errorMessage = "All fields need to have a legal value for this to proceed.";
        res.status(200).render("register", payload); //the POST section of the register page
        //to enable this to run effectively i need to install the body-parser dependency to handle
        //request body and manipulate to do what I want.
    }
})

module.exports = router;