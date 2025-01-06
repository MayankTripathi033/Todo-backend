import express from "express";
import Todo from "../Models/todomodel.js";
import { verifyToken } from "../utils/verifyToken.js";
import login from "../Models/loginmodel.js";
import { sendEmailTodo } from "../utils/todoEmail.js";
import Register from "../Models/registermodel.js";

export const postTodo = async (req, res) => {
  try {
    const { todo, completed } = req.body;
    const auth = await verifyToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Token has been expired or not available",
      });
    }
    const userdata = await Register.findById(auth.id);
    if (!userdata) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!todo) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill the todo" });
    }
    const result = new Todo({
      todo: todo,
      completed: completed,
      user: userdata._id,
    });
    await sendEmailTodo(userdata.email, todo);
    await result.save();
    return res
      .status(200)
      .json({ success: true, message: "Todo has been posted", result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Todo couldn't be posted",
      error: error,
    });
  }
};

export const getTodo = async (req, res) => {
  try {
    const auth = verifyToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Token has been expired or not available",
      });
    }
    const result = await Todo.find({ user: auth.id });
    if (result.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Todos found", payload: [] });
    }
    return res
      .status(200)
      .json({ success: true, message: "All Todos", payload: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Todos couldn't be fetched",
      error: error,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const auth = verifyToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Token has been expired or not available",
      });
    }
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }
    const result = await Todo.findByIdAndDelete(id);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "No Todo found", payload: [] });
    }
    return res.status(200).json({
      success: true,
      message: "Todo has been deleted",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Todo couldn't be deleted",
      error: error,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const auth = verifyToken(req.headers.authorization);
    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Token has been expired or not available",
      });
    }
    const { id, completed, todo } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }
    const result = await Todo.findByIdAndUpdate(id, {
      todo: todo,
      completed: completed,
    });
    console.log("result", result);

    if (!result) {
      return res
        .status(402)
        .json({ success: false, message: "Todo does not get update" });
    }
    return res.status(200).json({
      success: true,
      message: "Todo has been updated",
      payload: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Todo couldn't be updated",
      error: error,
    });
  }
};
