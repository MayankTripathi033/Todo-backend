import express from "express";
import { ObjectId } from "mongodb";
import {
  login,
  register,
  sendOtptouser,
  uploadDocument,
  verifyOtp,
} from "./middleware/login.js";
import {
  deleteTodo,
  getTodo,
  postTodo,
  updateTodo,
} from "./middleware/todo.js";
const router = express.Router();

router.post("/upload", uploadDocument);
router.post("/login", login);
router.post("/register", register);
router.post("/Todo", postTodo);
router.get("/Todo", getTodo);
router.patch("/Todo", updateTodo);
router.delete("/Todo", deleteTodo);
router.post("/verifyotp", verifyOtp);
router.post("/sendOtp", sendOtptouser);
router.get("/getAllUser", getAllUsers);
router.get("/getSingleUser", getUser);

export default router;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login endpoint
 *     description: Authenticates a user with their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User has been found"
 *                 payload:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     user:
 *                       type: string
 *                       example: 63c9c9ef1e8bfc1234567890
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Password is incorrect"
 *       404:
 *         description: User not found or missing credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Login Request didn't Complete"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *
 *
 *
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration endpoint
 *     description: Allows a new user to register with their details and upload an avatar.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: password123
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The avatar file to be uploaded.
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User has been registered and please verify the user as the otp will expire within 10min"
 *       400:
 *         description: Missing required user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "All user details (username, email, password) are required to register"
 *       401:
 *         description: Invalid email format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid email format"
 *       409:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User couldn't be saved"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Create a new Todo
 *     description: Allows an authenticated user to create a new todo item.
 *     tags:
 *       - Todo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: string
 *                 description: The content of the todo item.
 *                 example: "Buy groceries"
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the todo.
 *                 example: false
 *     responses:
 *       200:
 *         description: Todo created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Todo has been posted"
 *                 result:
 *                   type: object
 *                   description: The created todo item.
 *       400:
 *         description: Bad request due to missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please fill the todo"
 *       401:
 *         description: Unauthorized access due to invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Internal server error during todo creation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todo couldn't be posted"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

/**
 * @swagger
 * /todo:
 *   delete:
 *     summary: Delete a Todo item
 *     description: Allows an authenticated user to delete a todo item by its ID.
 *     tags:
 *       - Todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo to delete.
 *     responses:
 *       200:
 *         description: Todo deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Todo has been deleted"
 *       400:
 *         description: Bad request due to missing or invalid ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide id"
 *       401:
 *         description: Unauthorized access due to invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Internal server error during todo deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todo couldn't be deleted"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

/**
 * @swagger
 * /todo:
 *   patch:
 *     summary: Update a Todo item
 *     description: Allows an authenticated user to update a todo item's completion status or content.
 *     tags:
 *       - Todo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the todo to update.
 *                 example: "63a5d0c1e3b5a79e9c8f42a1"
 *               completed:
 *                 type: boolean
 *                 description: The updated completion status of the todo.
 *                 example: true
 *               Todo:
 *                 type: string
 *                 description: The updated content of the todo.
 *                 example: "Buy groceries and cook dinner"
 *     responses:
 *       200:
 *         description: Todo updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Todo has been updated"
 *       400:
 *         description: Bad request due to missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide id"
 *       401:
 *         description: Unauthorized access due to invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Internal server error during todo update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todo couldn't be updated"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Retrieve all Todo items for a user
 *     description: Allows an authenticated user to fetch all their todo items by providing a username.
 *     tags:
 *       - Todo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todos retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All Todos"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "63a5d0c1e3b5a79e9c8f42a1"
 *                       todo:
 *                         type: string
 *                         example: "Buy groceries"
 *                       completed:
 *                         type: boolean
 *                         example: false
 *                       user:
 *                         type: string
 *                         example: "johndoe"
 *       400:
 *         description: Bad request due to missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide user"
 *       401:
 *         description: Unauthorized access due to invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Internal server error during todo retrieval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Todos couldn't be fetched"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

/**
 * @swagger
 * /verifyOtp:
 *   post:
 *     summary: Verify OTP for user email
 *     description: Verifies the OTP sent to the user's email and marks the user as verified upon success.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
 *               otp:
 *                 type: string
 *                 description: The OTP to verify.
 *           example:
 *             email: user@example.com
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: OTP successfully verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP has been verified
 *       400:
 *         description: Missing or invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide email
 *       401:
 *         description: Incorrect OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: OTP is incorrect
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: OTP couldn't be sent
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /sendOtp:
 *   post:
 *     summary: Send OTP to user's email
 *     description: Sends a one-time password (OTP) to the user's email for verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email to which the OTP will be sent.
 *           example:
 *             email: user@example.com
 *     responses:
 *       200:
 *         description: OTP successfully sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP has been sent
 *       400:
 *         description: Missing or invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide email
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: OTP couldn't be sent
 *                 error:
 *                   type: string
 *                   example: Internal error details
 */

/**
 * @swagger
 * /getAllUser:
 *   get:
 *     summary: get all user
 *     description: get all user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Get All user Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All user has been fetched
 *       400:
 *         description: Missing or invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide correct id
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal error details
 *                 error:
 *                   type: string
 *                   example: Internal error details
 */

/**
 * @swagger
 * /getAllUser:
 *   get:
 *     summary: get all user
 *     description: get all user
 *     tags:
 *       - Authentication
 *    requestParams:
 *      - in: query
 *       id: id
 *     responses:
 *       200:
 *         description: Get Single user Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Single user has been fetched
 *       400:
 *         description: Missing or invalid request parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide id
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal error details
 *                 error:
 *                   type: string
 *                   example: Internal error details
 */
