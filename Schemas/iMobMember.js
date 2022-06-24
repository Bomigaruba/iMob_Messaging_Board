const mongoose = require("mongoose");
const schema = mongoose.Schema;
const iMobMemberSchema = new schema({//this is how we can set the fields for the data types we use
    FirstName:{
        type: String,
        required: true,
        //validation test, using trim can take care of spaces either side of the
        //entries it would remove them before the user entered it.
        trim: true
    },
    LastName:{
        type: String,
        required: true,
        trim: true
    },
    cosigns:[{//explanation for this on the iMobPosts.js file
        type: schema.Types.ObjectId, 
        ref: 'iMobPosts' //this is to show all the post this particular iMobMember has Liked.
   }],
   crowns:[{//explanation for this on the iMobPosts.js file
    type: schema.Types.ObjectId, 
    ref: 'iMobPosts' //this is to show all the post this particular iMobMember has Liked.
   }],
    UserName:{
        type: String,
        required: true,
        trim: true,
        //validation test, uniqque will prevent the user from having a username that is already taken
        //same idea for the email field next
        unique: true
    },
    linked:[{//all the people who will have content shown on your feed
        type: schema.Types.ObjectId, 
        ref: 'MobMember' //this is to show all the post this particular iMobMember have linked up w/ you.
    }],
    confirmedLinked:[{//all the people who will have content shown on your feed
        type: schema.Types.ObjectId, 
        ref: 'MobMember' //this is to show all the post this particular iMobMember have linked up w/ you.
    }],
    Email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    linked:[{//all the people who will have content shown on your feed
        type: schema.Types.ObjectId, 
        ref: 'MobMember' //this is to show all the post this particular iMobMember have linked up w/ you.
    }],
    confirmedLinked:[{//all the people who will have content shown on your feed
        type: schema.Types.ObjectId, 
        ref: 'MobMember' //this is to show all the post this particular iMobMember have linked up w/ you.
    }],
    Password:{
        type: String,
        required: true,
    },
    MugShotPic:{
        //optional for user
        type: String,
        default:"/images/Pikachu_Default.jpg"
    },
    BackdropPic:{
        //optional for user
        type: String,
        default:"/images/Who.jpg"
    },

    cosigns:[{//explanation for this on the iMobPosts.js file
        type: schema.Types.ObjectId, 
        ref: 'iMobPosts' //this is to show all the post this particular iMobMember has Liked.
   }],
   crowns:[{//explanation for this on the iMobPosts.js file
    type: schema.Types.ObjectId, 
    ref: 'iMobPosts' //this is to show all the post this particular iMobMember has Liked.
   }],


},
    {timestamps: true}//this enters the realm of options in nested functions.
    //this is where i can set and see the time when all of my data was added. so on my mongodb page or even my terminal I will see "cretaedAt:2022-02-14"
    //updatesAt: 2022-02-15...
);
var mobMember = mongoose.model('MobMember',iMobMemberSchema);//how to export a model so that all
//connections to this database(mongoose) have access to this schema.
module.exports = mobMember;
