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

var notify  =  mongoose.model('Notify', iMobNotificationSchema);
module.exports =  notify;
