const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("./../utils/cloudinary");
const fs = require("fs");
const path = require("path");

//Create a new user
//POST: /api/user/signup
//UNPROTECTED
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, confirmPassword } =
      req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ msg: "Fill in all fields." });
    }
    //changing email to lower case
    const newEmail = email.toLowerCase();

    //check if email or username exists
    const userExist = await User.findOne({
      $or: [{ userName: userName }, { email: newEmail }],
    });
    if (userExist) {
      if (userExist.userName == userName) {
        return res.status(400).json({ msg: "Username already exists." });
      }
      if (userExist.email == newEmail) {
        return res.status(400).json({ msg: "Email already exists." });
      }
    }

    //Checking password
    if (password.trim().length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 charcters" });
    }
    //Checking if password match with confirmPassword
    if (password != confirmPassword) {
      return res.status(400).json({ msg: "Password do not match" });
    }

    //Preparing to hash paassword
    const salt = await bcrypt.genSalt(10);
    //Hashing the paassword
    const hashedPassword = await bcrypt.hash(password, salt);
    //Pusing new user to table

    console.log("creating user");
    const newUser = await User.create({
      firstName,
      lastName,
      email: newEmail,
      userName,
      password: hashedPassword,
    });
    console.log("user created!");
    // return res.status(200).json(`${User.firstName} registered.`)
    return res.status(200).json({ msg: "Registration Sucessful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "User registration failed", error: error.message });
  }
};

//LOGIN A REGISTERED USER
//POST: /api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Fill in all fields." });
    }
    const newEmail = email.toLowerCase();
    //check if email exist
    const user = await User.findOne({
      $or: [{ email: newEmail }],
    })
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials." });
    }

    //compare password with the database password
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(400).json({ msg: "Incorrect Password." });
    }

    //get the id from generate token when user logged in
    const { _id: id, firstName } = user;
    const token = jwt.sign({ id, firstName }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    console.log("Login Suucesful");
    console.log(user.firstName);

    // return res.status(200).json({ msg: `Welcome, ${user.firstName}` });
    return res
      .status(200)
      .json({ token, msg: `Welcome, ${user.firstName}`, data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "User login failed", error: error.message });
  }
};

// LOGOUT USER
//POST: /api/users/id:
//PROTECTED
const logoutUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Error logging user", error: error.message });
  }
};

// USER PROFILE
//POST: /api/getuser/getuser:
//PROTECTED
const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (user) { 
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {  
    console.error(err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



// USERLOGINSTATUS
//POST: /api/users/id:
//PROTECTED
const userloginStatus = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    res.json(true);
  } else {
    res.json(false);
  }
};

//UPDATE USER
//POST: /api/users/update-user
//PROTECTED
const upDateUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return res.status(422).json("Please fill all fields");
    }

    //get user from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
      return res.status(422).json("Email already exists");
    }

    //compare password to the db password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return res.status(422).json("Invalid current password");
    }
    //Checking password
    if (newPassword.trim().length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 charcters" });
    }

    //compare the new password
    if (newPassword !== confirmNewPassword) {
      return res.status(422).json("New Password do not match");
    }

    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hashnewPassword = await bcrypt.hash(newPassword, salt);

    //update new info inthe database
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, userName, password: hashnewPassword },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    console.log("hbhb");
    res.status(400).json({ msg: "An error occurred" });
  }
};

//CHANGE USER PROFILE PICTURE
//POST: /api/users/change-avater
//PROTECTED
const changeAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(422).json("Please select an image");
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.avatar.path);

    // Update user's avatar URL in database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(422).json("Avatar could not be updated");
    }

    return res.status(200).json({ msg: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading avatar:", error.message);
    return res.status(400).json({
      message: "An error occurred while uploading the profile picture",
      error: error.message,
    });
  }
};

//EDIT USER PROFILE
//POST: /api/users/edit-user
//PROTECTED
const editProfile = (req, res, next) => {
  res.jons("Edit User profile");
};

module.exports = {
  registerUser,
  loginUser,
  upDateUser,
  getUser,
  logoutUser,
  userloginStatus,
  changeAvatar,
  editProfile,
};
