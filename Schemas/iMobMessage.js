const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const iMobMessageSchema = new Schema({//this is how we can set the fields for the data types we use
    sender: { type: Schema.Types.ObjectId, ref: 'MobMember'},
    content:{ type: String, trim: true},
    chat:{type: Schema.Types.ObjectId, ref: 'ChatRoom'}, 
    readBy: [{ type: Schema.Types.ObjectId, ref: 'MobMember'}]
}, {timestamps: true});


var Message  =  mongoose.model('Message', iMobMessageSchema);
module.exports =  Message;