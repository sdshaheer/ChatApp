const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cloudinary = require("../Utils/cloudinary");

exports.registerController = async (req, res) => {
  try {
    console.log("in register controller");
    const { name, email, password } = req.body;
    const file = req.file;
    let result;
    console.log(file);

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "please provide all fileds",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (file) {
      result = await cloudinary.uploader.upload(file.path, {
        folder: "PROFILE_PICTURES",
      });
    }

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    console.log(user);

    return res.status(200).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registering new user",
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "please provide all fileds",
      });
    }
    const user = await userModel.findOne({ email });
    if (user == null) {
      return res.status(400).send({
        success: false,
        message: "user doesnt exits",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "password does'nt match",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_KEY, {
      expiresIn: "1hr",
    });

    return res.status(200).send({
      success: true,
      message: "user login successfully",
      accessToken,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registering new user",
    });
  }
};

exports.findUsersController = async (req, res) => {
  console.log(req.query.search);
  if (req.query.search == "") {
    return res.status(200).send({
      success: true,
      message: "users successfully retrieved",
      users: [],
    });
  }
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel.find(keyword, { password: 0 }).find({
      _id: { $ne: req.userId },
    });
    console.log(users);
    return res.status(200).send({
      success: true,
      message: "users successfully retrieved",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching searched users",
    });
  }
};
