const mongoose = require("mongoose");
const schema = mongoose.Schema;
const iMobMessageSchema = new schema({//this is how we can set the fields for the data types we use
    sender: { type: schema.Types.ObjectId, ref: 'MobMember'},
    content:{ type: String, trim: true},
    chat:{type: schema.Types.ObjectId, ref: 'ChatRoom'}, 
    readBy: [{ type: schema.Types.ObjectId, ref: 'MobMember'}]
}, {timestamps: true});


var message  =  mongoose.model('Message', iMobMessageSchema);
module.exports =  message;
