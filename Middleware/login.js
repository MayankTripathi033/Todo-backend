import Login from "../Models/loginmodel.js";
import Register from "../Models/registermodel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import jsonwebtoken from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { verifyEmail } from "../utils/verifyEmail.js";
import { client } from "../database.js";
import {
  isAuthorized,
  isUserExistByEmail,
  isUserExistById,
  isValidEmail,
  setAvatarToCloudinary,
} from "./validation.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const sendOtp = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const save = await client.hSet(`${email}`, {
      otp: otp,
    });
    await client.expire(`${email}`, 300);
    const getdata = await client.hGet(`${email}`, "otp");
    await verifyEmail(email, otp);
    return save;
  } catch (error) {
    console.error("Error during OTP verification", error);
    return error;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(404).json({
        success: false,
        message: "Please fill the username and password in order to login",
      });
    }
    const result = await Register.findOne({
      email: email,
    });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const resultPassword = await bcrypt.compare(password, result.password);
    if (!resultPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }
    const token = jsonwebtoken.sign(
      { email: email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    console.log("token", token);
    let data = await Login.findOne({ email: email });
    if (!data) {
      data = new Login({
        email: email,
        user: result._id,
        token: token,
      });
      data.save();
      return res
        .status(200)
        .json({ success: true, message: "User has been found", payload: data });
    } else {
      await Login.findOneAndUpdate({ email: email }, { token: token });
      return res
        .status(200)
        .json({ success: true, message: "User has been found", payload: data });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login Request didn't Complete",
      error: error,
    });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
}).array("avatar");

export const register = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "File couldn't be uploaded",
          error: err,
        });
      }
      const file = req.files;
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "All user details (username, email, password) are required to register",
        });
      }
      const userdata = await isUserExistByEmail(email);
      if (userdata) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
      const isValid = isValidEmail(email);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email format" });
      }
      await sendOtp(email);
      if (file) {
        await setAvatarToCloudinary(file);
      }
      const result = new Register({
        username: username,
        email: email,
        password: password,
        avatar: file?.[0]?.path || "Avatar image not provided",
      });
      await result.save();
      if (!file) {
        return res
          .status(404)
          .json({ success: false, message: "File not found" });
      }
      return res.status(200).json({
        success: true,
        message:
          "User has been registered and please verify the user as the otp will expired withing 10min",
      });
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error during user registration:", error);

    // Respond with error details, ensure no sensitive data is exposed
    return res.status(500).json({
      success: false,
      message: "User couldn't be saved",
      error: error.message || "An error occurred during registration",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp && !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const userdata = await client.hGet(`${email}`, "otp");

    console.log("userdata", userdata);
    if (!userdata) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (userdata !== otp) {
      return res
        .status(401)
        .json({ success: false, message: "OTP is incorrect" });
    } else {
      await Register.findOneAndUpdate({ email: email }, { isVerified: true });
      await client.del(`${email}`);
      return res
        .status(200)
        .json({ success: true, message: "OTP has been verified" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "OTP couldn't be sent", error: error });
  }
};

export const uploadDocument = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "File couldn't be uploaded" });
  }
};

export const getDocument = async (req, res) => {
  try {
    const collection = getCollection();
    const document = await collection.find({}).toArray();
    return res.status(200).json({ document, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Document not found" });
  }
};

export const sendOtptouser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const user = await Register.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpuser = await sendOtp(email, otp);
    console.log("OTP has been sent", otpuser);
    return res
      .status(200)
      .json({ success: true, message: "OTP has been sent" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP couldn't be sent",
      error: error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Please Provide Authorization in order to Submit",
      });
    }
    let isExpiredToken = jsonwebtoken.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    ).exp;
    if (isExpiredToken < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        success: false,
        message: "Token has been expired",
      });
    }
    const user = await Register.find({});
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User has been fetched", payload: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User couldn't be fetched",
      error: error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const user = await Register.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User has been fetched", payload: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User couldn't be fetched",
      error: error,
    });
  }
};
