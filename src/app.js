const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile"); 
const requestRouter = require("./routes/requests");
const { userAuth } = require("./middlewares/auth.js");
const userRouter = require("./routes/user.js");


app.use(express.json()); // Middleware to parse JSON data
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
  .then(() => {
    console.log("DB Connected Successfully");
    app.listen(3000, () => {
      console.log("Listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB "+err.message);
  });
