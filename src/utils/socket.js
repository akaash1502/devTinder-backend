const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //Handle socket events here
    socket.on("joinChat", ({ firstName, userId, targetuserId }) => {
      const roomId = [userId, targetuserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, userId, targetuserId, text }) => { 
      
      // Save message to database (not shown in this snippet)
      try{
        const roomId = [userId, targetuserId].sort().join("_");
        // two cases
        // first ever message, create chat
        // chat already exists, append to alreadt existing chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetuserId] },
        }
        );
        //it will find chat where both userId and targetuserId are present

        if(!chat){
          chat = new Chat({
            participants: [userId,targetuserId],
            messages: [],
          })
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();
        io.to(roomId).emit("receiveMessage", { firstName, userId, text });
         
        
      }catch(err){
        console.log(err);
      }

      
    });

    socket.on("disconnect", () => {});

    // Handle typing
    socket.on("typing", ({ userId, targetuserId, firstName }) => {
      const roomId = [userId, targetuserId].sort().join("_");
      socket.to(roomId).emit("typing", { firstName });
    });

    socket.on("stopTyping", ({ userId, targetuserId }) => {
      const roomId = [userId, targetuserId].sort().join("_");
      socket.to(roomId).emit("stopTyping");
    });
  });
};

module.exports = initializeSocket;
