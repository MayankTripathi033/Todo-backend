import express from "express";
import router from "./routes.js";
import { mongodbconnect } from "./database.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json()); //Converts JSON string to JSON object
const port = process.env.PORT || 3001;

app.use("/api", router);

const startServer = async () => {
  await mongodbconnect();
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};
startServer();
