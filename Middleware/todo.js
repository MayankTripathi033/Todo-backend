import express from "express";
import Todo from "../Models/Todomodel.js";
import { verifyToken } from "../utils/verifyToken.js";
import login from "../Models/loginmodel.js";
import { sendEmailTodo } from "../utils/todoEmail.js";

export const postTodo = async (req, res) => {
  try {
    const { todo, completed, user } = req.body;
    const auth = verifyToken(req.headers.authorization);
    if (auth) {
      return res.status(401).json({
        success: false,
        message: auth,
      });
    }
    const userdata = await login.findOne({ user: user });
    console.log("userdata", userdata);
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
      user: user,
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
    if (auth) {
      return res.status(401).json({
        success: false,
        message: auth,
      });
    }
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide user",
      });
    }
    const result = await Todo.find({ user: user });
    if (result.length == 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Todos found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "All Todos", result });
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
    if (auth) {
      return res.status(401).json({
        success: false,
        message: auth,
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
      return res.status(400).json({ success: false, message: "No Todo found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Todo has been deleted" });
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
    if (auth) {
      return res.status(401).json({
        success: false,
        message: auth,
      });
    }
    const { id, completed, Todo } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Todo couldn't be updated",
      error: error,
    });
  }
};
