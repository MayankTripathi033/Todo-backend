import express from "express";
// import { getConnectedClient } from "./database.js";
import { ObjectId } from "mongodb";
import { login, register, uploadDocument } from "./Middleware/login.js";
import { deleteTodo, getTodo, postTodo } from "./Middleware/todo.js";
const router = express.Router();

// const getCollection = () => {
//   const connect = getConnectedClient();
//   const collection = connect.db("Todos").collection("todos");
//   return collection;
// };
//GET ROUTER
// router.get("/todo", async (req, res) => {
//   try {
//     const collection = getCollection();
//     const Todo = await collection.find({}).toArray();
//     res.status(200).json({ Todo, status: true });
//   } catch (error) {
//     console.log(error);
//   }
// });

//POST ROUTER
// router.post("/todo", async (req, res) => {
//   try {
//     const collection = getCollection();
//     const { todo } = req.body;
//     // console.log(req.body);
//     if (!todo) {
//       res.status(400).json({ msg: "error not found" });
//     }
//     console.log(todo);
//     const Todo = await collection.insertOne({ todo, status: false });
//     res.status(201).json({ todo, status: true, _id: Todo.insertedId });
//   } catch (error) {
//     console.log(error);
//   }
// });
router.get("/todo", getTodo);
router.post("/upload", uploadDocument);
router.post("/login", login);
router.post("/register", register);
router.post("/Todo", postTodo);
router.delete("/Todo", deleteTodo);

//PUT ROUTER
// router.put("/todo/:id", async (req, res) => {
//   try {
//     const collection = getCollection();
//     const _id = new ObjectId(req.params.id);
//     const { status } = req.body;
//     // console.log(req.params.id);
//     const UpdatedTodo = await collection.updateMany(
//       { _id },
//       { $set: { status: status } }
//     );
//     res.status(202).json({ UpdatedTodo });
//   } catch (error) {
//     console.log(error);
//   }
// });

//DELETE ROUTER
// router.delete("/todo/:id", async (req, res) => {
//   try {
//     const collection = getCollection();
//     const _id = new Object(req.params.id);
//     const deleteTodo = collection.deleteOne({ _id });
//     res.status(203).json({ deleteTodo });
//   } catch (error) {
//     console.log(error);
//   }
// });
export default router;
