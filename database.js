import dotenv from "dotenv";
// import { MongoClient } from "mongodb";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
  // serverApi: {
  //   version: "1",
  //   strict: true,
  //   depreciationErrors: true,
  // },
};

let conn;

export async function mongodbconnect() {
  // if (!conn) {
  try {
    console.log("Connecting to MongoDB...");
    conn = await mongoose.connect(uri, options);
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Could not connect to MongoDB");
  }
  // } else {
  //   console.log("Using existing MongoDB connection.");
  // }
}

// export const getConnectedClient = () => conn;
