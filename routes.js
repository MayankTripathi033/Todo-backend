import express from "express";
import { ObjectId } from "mongodb";
import {
  login,
  register,
  uploadDocument,
  verifyOtp,
} from "./Middleware/login.js";
import {
  deleteTodo,
  getTodo,
  postTodo,
  updateTodo,
} from "./Middleware/todo.js";
const router = express.Router();

router.post("/upload", uploadDocument);
router.post("/login", login);
router.post("/register", register);
router.post("/Todo", postTodo);
router.get("/Todo", getTodo);
router.patch("/Todo", updateTodo);
router.delete("/Todo", deleteTodo);
router.post("/verifyotp", verifyOtp);

export default router;
