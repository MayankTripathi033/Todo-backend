import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    token: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
    },
  },
  { timestamps: true }
);

const Login = new mongoose.model("Login", LoginSchema);

export default Login;
