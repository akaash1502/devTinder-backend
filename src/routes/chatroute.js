// const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { Chat } = require("../models/chat.js");
const express = require("express");
const chatRouter = express.Router();

chatRouter.get("/getChat/:targetUserId", userAuth, async (req, res) => {
    try{
        const { targetUserId } = req.params;
        // const targetUserId = req.params.targetId;
        const userId = req.user._id;
        
        let chat = await Chat.findOne({
            participants: { $all: [userId,targetUserId] },
        }).populate("messages.senderId", "firstName lastName");

        if(!chat){
            chat = new Chat({
                participants: [userId,targetUserId],
                messages: [],
            });
        }
        await chat.save();

        return res.status(200).json({ chat });

    } catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = chatRouter;