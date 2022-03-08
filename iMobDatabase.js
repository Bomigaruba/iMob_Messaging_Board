const mongoose = require("mongoose");
//Good practice to account for deprecation warnings that will occur in browser due to my
//"raw" usage of this database structure.
//mongoose.set("useNewUrlParser", true)// this particularly addresses the url parser issue that occur with MongoDB Client.
//mongoose.set("UseUnifiedTopology", true)//The current server directory for MongoDB that handles monitoring is deprecated
//mongoose.set("UseFindAndModify", false)//This outdated mongodb function would normally help me to find and call other functions. this helps me avoid warnings in the terminal.
class iMobDatabase{
//Makes use of a bit of object-oriented programming
    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://Garubabomi:Gb2050!!@imobapp.lwcxb.mongodb.net/iMobDB?retryWrites=true&w=majority")
        //this connect function allows callbacks to it. if it runs and its succeful it goes to the then() stage and if it fails it
        //goes to the catch() block. What's in the connect fuction is the link to my MongoDB database objects for users.
        .then( ()=>{ //anonymous function
                console.log("Database connection works")
                //This will also give database deprecation
                //information if ithe is experiencing weirdness the connection bandwidth
            
        })
        .catch( //anonymous function
            (err)=> {
                console.log("houston we have a problem" + err)//Catches and tells me the specific error with the err variable
            
        })

    }

}

module.exports = new iMobDatabase();