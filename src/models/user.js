//We define user schema
const mongoose = require('mongoose');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength: 3,
        maxLength: 30,
        trim:true,
        validate: {
            validator: function (name) {
              return validator.isAlpha(name, "en-US", { ignore: " " }); // Allow spaces in names
            },
            message: "First name can only contain alphabetic characters and spaces.",
        }
},
    // Short hand notation firstName: String lastName: String
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        trim:true,
        validate: {
            validator: function (name) {
              return validator.isAlpha(name, "en-US", { ignore: " " }); // Allow spaces in names
            },
            message: "Last name can only contain alphabetic characters and spaces.",
        }
    },
    emailID: {
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        trim: true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID" + value);
            }
        }
    },
    password: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (password) {
              // Use a custom validation with `validator` methods
              const strongPassword = validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
              });
              return strongPassword;
            },
            message:
              "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
          },
    },
    age: {
        type: Number,
        min:[18, "Age must be atleast 18"],
    },
    gender: {
        type: String,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    about : {
        type: String,
        maxLength: 200,
        default: function () {
            return `Hey there! I am ${this.firstName || "using devTinder"}`;
        },
    },
    skills : {
        type: [String],
    },
    photoURL : {
        type: String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
        // validate: {
        //     validator: validator.isURL, // Validate URL format
        //     message: "Invalid photo URL.",
        // },
    },
},
{
    timestamps:true,
},
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.validatePassword = async function(password){
    const user = this;
    const isPasswordValid = await bcrypt.compare(password,user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);