import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middleware.js";
import { User } from "../models/user.model.js";
import { generateJWTToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
  if (user) {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "Please Provide correct credentials",
      });
    }

    generateJWTToken(user, "User signed in successfully", 200, res);
  }
});

export const signout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { email, fullName } = req.body;
  if (email.trim().length === 0 || fullName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "fullName and  email cannot be empty.",
    });
  }
  const avatar = req?.files?.avatar;
  let cloudinaryResponse = {};
  console.log({avatar});
  
  if (avatar) { 
    try {
      const oldAvatarPublicId = req.user?.avatar?.public_id;
      if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "CHAT_APP_USERS_AVATARS",
          transformation: [
            { width: 150, height: 150, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar image. Please try again later.",
      });
    }
  }
  let data = {
    fullName,
    email,
  };
  if (
    avatar &&
    cloudinaryResponse?.public_id &&
    cloudinaryResponse?.secure_url
  ) {
    data.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  let user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
