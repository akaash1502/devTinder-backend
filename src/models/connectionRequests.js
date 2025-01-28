const mongoose = require('mongoose');
const User = require('./user');
const connectionRequestsSchema = new mongoose.Schema({
    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //reference to user model
        required:true,
    },

    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    status : {
        type: String,
        required:true,
        enum:{
            values: ["ingore","interested","accepted","rejected"],
            message: "`{VALUE}` is incorrect status type",
        },
    },      
},
{ timestamps:true, }
);

const connectionRequestsModel = mongoose.model(
    "ConnectionRequest",
    connectionRequestsSchema
);

module.exports = connectionRequestsModel;