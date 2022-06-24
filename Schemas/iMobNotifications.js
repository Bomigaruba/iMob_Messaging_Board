const mongoose = require("mongoose");
const { notify } = require("../routes/notificationsRoutesPath");
const schema = mongoose.Schema;
const iMobNotificationSchema = new schema({//this is how we can set the fields for the data types we use
    UserTo: { type: schema.Types.ObjectId, ref: 'MobMember'},
    UserFrom:{ type: schema.Types.ObjectId, ref: 'MobMember'},
    NotiType: String, 
    readBy: { type: Boolean, default: false},
    entityId: schema.Types.ObjectId
}, {timestamps: true});

iMobNotificationSchema.statics.insertNotification = async (userTo, userFrom, notiType, entityId) => {
    var information ={
        userTo: userTo,
        userFrom: userFrom,
        notiType: notiType,
        entityId: entityId
    };
    await  notify.deleteOne(information).catch(error => console.log(error));
    return notify.create(information).catch(error => console.log(error));
}

var notify  =  mongoose.model('Notify', iMobNotificationSchema);
module.exports =  notify;
