import express from "express";
import router from "./routes.js";
import { client, mongodbconnect } from "./database.js";
import { specs, swaggerUi } from "./swagger.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json()); //Converts JSON string to JSON object
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const port = process.env.PORT || 3001;

app.use("/api", router);

const startServer = async () => {
  await client.connect();
  await mongodbconnect();
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
};
startServer();
