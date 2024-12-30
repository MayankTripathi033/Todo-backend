import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "redis";

dotenv.config();

export const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

const uri = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
};

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
