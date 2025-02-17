const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestsModel = require("../models/connectionRequests");
const user = require("../models/user");
const userRouter = express.Router();
const USER_DATA = ["firstName","lastName","photoURL","about","gender","skills"];

userRouter.get("/user/requests/review", userAuth, async (req, res) => {
  try {
    const loggeninUser = req.user;
    const connectionRequests = await connectionRequestsModel
      .find({
        toUserId: loggeninUser._id,
        status: "interested",
      })
      .populate("fromUserId",USER_DATA);
    res.json({
      message: "Data",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const connections = await connectionRequestsModel.find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId",USER_DATA)
      .populate("toUserId", USER_DATA);

      
      const data = connections.map((row)=>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
          return row.toUserId;          
        }else{
          return row.fromUserId;
        }
      });
  
      res.json({
        data: data,
      });
    } catch (err) {
      res.json({ message: "Error: " + err.message });
    }
  });

userRouter.get("/user/feed",userAuth,async (req,res) => {
  try{
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page-1)*limit;
    
    const requests = await connectionRequestsModel.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ],
    }).select(["fromUserId","toUserId"]);

    const hiddenUsers = new Set();
    requests.forEach((user)=>{
      hiddenUsers.add(user.fromUserId);
      hiddenUsers.add(user.toUserId); 
    });

    const usersinFeed = await user.find({
      $and:[
        {_id : { $nin : Array.from(hiddenUsers) }},
        {_id : { $ne : loggedInUser._id }}
      ]
    }).select(USER_DATA).skip(skip).limit(limit);

    res.send(usersinFeed);

  }catch(err){
    res.send("ERROR : "+err.message);
  }

});

  
module.exports = userRouter;
