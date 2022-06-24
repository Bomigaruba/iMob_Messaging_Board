const mongoose = require("mongoose");
const schema = mongoose.Schema;
const iMobDM = new schema({//this is how we can set the fields for the data types we use
    DMName:{ type: String, trim: true},
    isGroupChat: { type: Boolean, default: false },
    iMobMembers: [{ type: schema.Types.ObjectId, ref: 'MobMember'}],
    latestMessage:{type: schema.Types.ObjectId, ref: 'Message'}
}, {timestamps: true});
var chatRoom  =  mongoose.model('ChatRoom', iMobDM);
module.exports =  chatRoom;
