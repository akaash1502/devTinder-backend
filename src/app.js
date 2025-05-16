const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chatroute.js");
const uploadRouter = require("./routes/upload.js");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket.js");

require('dotenv').config();

const app = express();
require("./utils/cronjob.js"); // Import the cron job to start it


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Apply it globally BEFORE any route
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight
app.options("*", cors(corsOptions));

app.use(express.json()); // Middleware to parse JSON data
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", uploadRouter);

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
