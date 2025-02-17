const validator = require("validator");
const { default: isURL } = require("validator/lib/isURL");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailID, gender, password } = data;

  // First Name Validation
  if (!firstName || firstName.length < 3 || firstName.length > 30) {
    throw new Error("First name is required and must be 3-30 characters long.");
  }

  // Last Name Validation
  if (!lastName || lastName.length < 3 || lastName.length > 20) {
    throw new Error("Last name is required and must be 3-20 characters long.");
  }

  // Email Validation
  if (!emailID || !validator.isEmail(emailID)) {
    throw new Error("Invalid email address.");
  }

  // Password Validation
  if (!password || password.length < 8 || !checkpassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
    );
  }

  // Gender Validation
  if (gender && !["male", "female", "others"].includes(gender.toLowerCase())) {
    throw new Error("Gender must be one of: male, female, or others.");
  }
};


const validateEditProfileData = (req) => {
  const { firstName, lastName, gender, skills, about, photoURL } = req.body;

  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photoURL", 
    "gender", 
    "age",
    "skills", 
    "about"];

  const isUpdateAllowed = Object.keys(req.body).every((field) => 
      ALLOWED_UPDATES.includes(field)
  );
   
  if(skills && Array.isArray(skills) && skills.length>10){
    throw new Error("Skills cannot be more than 10");
  }
  
  if(firstName && (firstName.length < 3 || firstName.length>30)){
    throw new Error("First Name must be between 3 and 30 characters");
  }

  if(lastName && (lastName.length < 3 || lastName.length>30)){
    throw new Error("Last Name must be between 3 and 30 characters");
  }

  if (gender && !["male", "female", "others"].includes(gender.toLowerCase())) {
    throw new Error("Gender must be one of: male, female, or others.");
  }

  if (about && about.length > 1000){
    throw new Error("About should be less than 1000 words");
  }

  if (photoURL && !isURL(photoURL)){
    throw new Error("Photo must be given as URL");
  }  
  return isUpdateAllowed;
};

// Utility Function for Password Strength Validation
function checkpassword(password) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}

module.exports = { validateSignUpData,validateEditProfileData };
