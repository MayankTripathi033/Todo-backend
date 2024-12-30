import express from "express";
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

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const sendOtp = async (email, otp) => {
  try {
    console.log("OTP has been sent", otp, email);
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
      { email: email, password: password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
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
      const user = await Register.findOne({ email });
      if (user) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
      const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      const isValid = regex.test(email);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email format" });
      }
      const otp = Math.floor(100000 + Math.random() * 900000);

      const otpuser = await sendOtp(email, otp);
      console.log("OTP has been sent", otpuser);
      setTimeout(async () => {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            file[0].path,
            {
              folder: "uploads",
              public_id: result._id,
              resource_type: "image",
            }
          );

          await Register.findOneAndUpdate(result._id, {
            avatar: cloudinaryResponse.secure_url,
          });

          console.log("File has been uploaded", cloudinaryResponse);
        } catch (error) {
          console.error("Error during file upload", error);
          return res
            .status(500)
            .json({ success: false, message: "File couldn't be uploaded" });
        } finally {
          fs.unlinkSync(file[0].path);
        }
      }, 5000);

      const result = new Register({
        username: username,
        email: email,
        password: password,
        avatar: file[0].path,
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

export const Todo = async (req, res) => {
  try {
    const { Task, Description } = req.body;
    const { authorization } = req.headers;
    if (!Task && !Description) {
      return res.status(401).json({
        success: false,
        message: "Please Provide Task and Description in order to Submit",
      });
    }
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Please Provide Authorization in order to Submit",
      });
    }
    console.log("Task and Description has been added", authorization);
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

    return res
      .status(200)
      .json({ success: true, message: "Task and Description has been added" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Todo function has been stopped" });
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
