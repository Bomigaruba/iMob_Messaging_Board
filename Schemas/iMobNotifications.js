const mongoose = require("mongoose");
const { notify } = require("../routes/notificationsRoutesPath");
const Schema = mongoose.Schema;
const iMobNotificationSchema = new Schema({//this is how we can set the fields for the data types we use
    UserTo: { type: Schema.Types.ObjectId, ref: 'MobMember'},
    UserFrom:{ type: Schema.Types.ObjectId, ref: 'MobMember'},
    NotiType: String, 
    readBy: { type: Boolean, default: false},
    entityId: Schema.Types.ObjectId
}, {timestamps: true});

iMobNotificationSchema.statics.insertNotification = async (UserTo, UserFrom, NotiType, entityId) => {
    var information ={
        UserTo: UserTo,
        UserFrom: UserFrom,
        NotiType: NotiType,
        entityId: entityId
    };
    await  Notify.deleteOne(information).catch(error => console.log(error));
    return Notify.create(information).catch(error => console.log(error));
}

var Notify  =  mongoose.model('Notify', iMobNotificationSchema);
module.exports =  Notify;