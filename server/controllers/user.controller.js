import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middleware.js";
import { User } from "../models/user.model.js";
import { generateJWTToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
export const signup = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide complete details",
    });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }
  const isEmailAlreadyRegistered = await User.findOne({ email });
  if (isEmailAlreadyRegistered) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "",
      url: "",
    },
  });

  generateJWTToken(user, "user successfully registered", 201, res);
});
export const signin = catchAsyncErrors(async (req, res, next) => {
  console.log("req",req);
  
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide emal and password",
    });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
  const isEmailRegistered = await User.findOne({ email });
  if (!isEmailRegistered) {
    return res.status(400).json({
      success: false,
      message: "User Not Found",
    });
  }
  if (isEmailRegistered) {
    const match = await bcrypt.compare(password, isEmailRegistered.password);
    if (match) {
      res.status(200).json({
        success: true,
        message: "User signed in successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Please Provide correct credentials",
      });
    }
  }
});
export const signout = catchAsyncErrors(async (req, res, next) => {});
export const getUser = catchAsyncErrors(async (req, res, next) => {});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {});
