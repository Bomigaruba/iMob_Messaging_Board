const mongoose = require("mongoose");
const schema = mongoose.Schema;
const iMobPostsSchema = new schema({//this is how we can set the fields for the data types we use
    content:{
        type: String,
        trim: true
    },
    authoredBy: {
        type: schema.Types.ObjectId, //This is something unique to mongoose schema's where i can display the author of an AJAX post request
        ref: 'MobMember' 
    },
    Capping: Boolean,
    cosignFromMembers:[{ //the reason for the "[]" is because this will be an array of user object...i.e how many people cosine what you posted.
         type: schema.Types.ObjectId, //This is the exact logic that the authoredBy fields would utilize
         ref: 'MobMember' 
    }],
    cosignData:{ type: schema.Types.ObjectId,  ref: 'iMobPosts' },
    commentOn:{ type: schema.Types.ObjectId,  ref: 'iMobPosts' },
    comments:[{ 
        type: schema.Types.ObjectId, 
        ref: 'MobMember' 
   }],
   crowns:[{ 
    type: schema.Types.ObjectId, 
    ref: 'MobMember' 
    }]
},
    {timestamps: true}//this enters the realm of options in nested functions.
    //this is where i can set and see the time when all of my data was added. so on my mongodb page or even my terminal I will see "cretaedAt:2022-02-14"
    //updatesAt: 2022-02-15...
);
var iMobPosts = mongoose.model('iMobPosts', iMobPostsSchema);
module.exports = iMobPosts;
