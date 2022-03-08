const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const iMobDM = new Schema({//this is how we can set the fields for the data types we use
    DMName:{ type: String, trim: true},
    isGroupChat: { type: Boolean, default: false },
    iMobMembers: [{ type: Schema.Types.ObjectId, ref: 'MobMember'}],
    latestMessage:{type: Schema.Types.ObjectId, ref: 'Message'}
}, {timestamps: true});
var ChatRoom  =  mongoose.model('ChatRoom', iMobDM);
module.exports =  ChatRoom;