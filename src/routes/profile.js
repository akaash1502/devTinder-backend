const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const validator = require('validator');
const bcrypt = require('bcrypt');

// profileRouter.use(express.json());

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
    // console.log(token);
    // res.send("readingcookie");}
  } catch (err) {
    console.log("ERROR : " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Update Fields");
    }
    const loggedInuser = req.user;
    
    Object.keys(req.body).forEach((key)=>{
      loggedInuser[key] = req.body[key];
    });

    await loggedInuser.save();

    res.json({message: `${loggedInuser.firstName} your Profile Updated Successfully`,
      data:loggedInuser,
    });

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//THIS WILL ALLOW TO EDIT PASSWORD ON EDIT PROFILE PAGE
// AS WE USE USERAUTH ALREADY SO WE DONT NEED TO bcrypt.compare();

profileRouter.patch("/password", userAuth, async (req,res) => {
  console.log(req.body);
  try{
    
    const { newPassword,confirmPassword } = req.body;
    // console.log(newpassword);

    if (!newPassword || !confirmPassword) {
      if (!newPassword) {
        throw new Error("Please provide the new password.");
      }
      if (!confirmPassword) {
        throw new Error("Please provide the confirm password.");
      }
    }
    

    if(newPassword!==confirmPassword){
      throw new Error("Both Passwords do not match");
    }

    if(!validator.isStrongPassword(newPassword)){
      throw new Error(
        "Password is too weak. It must include at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
      );
    }
    const loggedInuser = req.user;
    const hashedPassword = await bcrypt.hash(newPassword,10);
    loggedInuser.password = hashedPassword;
    await loggedInuser.save();
    // res.send("Password was changed");
    res.json({
      message: `${loggedInuser.firstName}, your password was Updated Successfully`,
      data:loggedInuser,
    });
  }
catch(err){
    res.status(400).send("ERROR : " + err.message);
  }    
});

module.exports = profileRouter;
