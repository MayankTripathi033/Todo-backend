import Register from "../Models/registermodel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const isUserExistByEmail = async (email) => {
  try {
    const userExist = await Register.findOne({ email: email });
    if (!userExist) {
      return false;
    }
    return userExist;
  } catch (error) {
    return error;
  }
};

const isUserExistById = async (id) => {
  try {
    const userExist = await Register.findById(id);
    if (!userExist) {
      return false;
    }
    return userExist;
  } catch (error) {
    return error;
  }
};

const isValidEmail = async () => {
  try {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const isValid = regex.test(email);
    return isValid;
  } catch (error) {
    return error;
  }
};

const setAvatarToCloudinary = async (file) => {
  try {
    if (file) {
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
    }
  } catch (error) {
    return error;
  }
};

const isAuthorized = (token) => {
  try {
    if (!token.startsWith("Bearer ")) {
      return false;
    }
    let isExpiredToken = jsonwebtoken.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET
    ).exp;
    if (isExpiredToken < Date.now().valueOf() / 1000) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return error;
  }
};

const getTransformedImageUrl = (avatarImg) => {
  try {
    const modifiedUrl = avatarImg.replace(
      "/upload/", // Find the /upload/ part of the URL
      "/upload/w_100,h_100,c_fill/" // Add transformations after /upload/
    );
    console.log("modifiedUrl", modifiedUrl);
    return modifiedUrl;
  } catch (error) {
    console.error("Error fetching or transforming the URL:", error);
    throw error;
  }
};

export {
  setAvatarToCloudinary,
  isUserExistByEmail,
  isUserExistById,
  isValidEmail,
  isAuthorized,
  getTransformedImageUrl,
};
