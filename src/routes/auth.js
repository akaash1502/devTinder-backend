const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validations");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
    // console.log("Request Body:", req.body); // Debug log
    // const data = req.body;
    const data = req.body;
    try{
        // console.log("VALIDATINGGG");
        validateSignUpData(data);
        // console.log("VALIDATINGGG 2");
        const { 
            firstName,
            lastName,
            gender,
            emailID,
            password } = data;
             
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({ 
            firstName,
            lastName,
            gender,
            emailID,
            password:hashedPassword
        });
        await user.save();
        return res.send("User Created Successfully");
    }catch (err) {
        if(err.code === 11000){
            return res.status(400).json({ error: "Email ID already exists" });
        } // Duplicate Key Error
        console.error("Signup Error: ", err); // Log the full error for debugging
        return res.status(400).json({ error: err.message || "Unknown error occurred" });
    }
    
});

authRouter.post("/login", async (req, res) => {
    try{
        const { emailID, password } = req.body;

        if(!validator.isEmail(emailID)){
            throw new Error("Invalid Email ID");
        }

        const user = await User.findOne({emailID:emailID});

        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token",token);
            res.send("User Logged In Successfully");
        }else{
            throw new Error("Invalid Credentials");
        }
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
});


authRouter.post("/logout", async (req, res) => {
    // CLEAN UP IS DONE IN BIG APPLICATIONS
    // FOR SMALL ONES THIS WORKS WELL
    res.cookie("token",null, {
        expires: new Date(Date.now()),
    });
    res.send("Logged Out Successfully");
});

module.exports = authRouter;