const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chatroute.js");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket.js");

require('dotenv').config();

const app = express();
require("./utils/cronjob.js"); // Import the cron job to start it


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json()); // Middleware to parse JSON data
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
// Initialize Socket.io

// Connect to DB and Start Server
connectDB()
  .then(() => {
    console.log("DB Connected Successfully");
    server.listen(3000, () => {
      console.log("Listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB: " + err.message);
  });
