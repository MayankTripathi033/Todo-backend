import express from "express";
import router from "./routes.js";
import { client, mongodbconnect } from "./database.js";
import { specs, swaggerUi } from "./swagger.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json()); //Converts JSON string to JSON object
const corsOptions = {
  origin: "*", // Allow only specific frontend domain
  methods: ["GET", "POST", "DELETE", "PATCH"], // Allow only specific methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const port = process.env.PORT || 3001;

app.use("/api", router); //App Router

const startServer = async () => {
  await client.connect();
  await mongodbconnect();
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};
startServer();
