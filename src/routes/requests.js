const express = require("express");
const requestRouter= express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequests");
const sendEmail  = require("../utils/sendEmail");
const User = require("../models/user");




requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
  try{

    //VALIDATIONS
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if(toUserId.toString()===fromUserId.toString()){
      throw new Error("Cannot send request to self");
    }
    
    // API STATUS SHOULD BE EITHER INTERESTED OR INGNORED NOTHING ELSE SHOULD BE ALLOWED
    // THINK IN TERMS OF DATA THAT CAN BE SENT IN REQ.BODY
    const ALLOWED_STATUSES = ["interested","ignored"];
    
    if(!ALLOWED_STATUSES.includes(status)){
      throw new Error("Invalid Status");
    } 

    //EXISTING REQUEST
    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        {fromUserId,toUserId},
        {fromUserId:toUserId, toUserId:fromUserId}
      ]      
    });



    if(existingConnectionRequest){
      throw new Error("Connection Request already exists");
    }
    
    const connection = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });


    const data = await connection.save();
    //SEND EMAIL
    // const fromUser = await User.findById(fromUserId);
    const fromUser = await User.findById(fromUserId);

    if(status === "interested"){
      const emailRes = await sendEmail.run("New Connection Request",
        `You have a new connection request from ${fromUser.firstName}. Please check your account for more details`);
    
        console.log("Email sent successfully");
    }
    

    res.json({
      message: "Connection Request Sent!!",
      data,
    })


  } catch(err){
    res.status(400).send("ERROR : "+err.message);
  } 
});

//review
requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res) => {
  try{
    const loggedInUser = req.user;
    const { status,requestId } = req.params;
    const ALLOWED_STATUSES = ["accepted","rejected"];

    //validate status to make sure correct status is allowed
    if(!ALLOWED_STATUSES.includes(status)){
      throw new Error("Invalid Status");
    }

    const connectionReq = await connectionRequest.findOne({
      _id:requestId,
      toUserId: loggedInUser._id,
      status:"interested",
    });
    
    if(!connectionReq){
      throw new Error("Connection Request not found");
    }

    connectionReq.status = status;
    await connectionReq.save();

    res.json({
      message: "Connection Request" + status,
    });
  }catch(err){
    res.status(400).send("ERROR : "+err.message);
  }



});
module.exports = requestRouter;