import { catchAsyncErrors } from "../middlewares/catchAsynError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({ 
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required", 400));
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  if (password.length < 8 || password.length > 15) {
    return next(new ErrorHandler("Password must be between 8 and 15 characters long", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid avatar format. Please upload JPEG, PNG or WebP images", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Ensure Cloudinary is properly configured
  if (!cloudinary.config().cloud_name) {
    return next(new ErrorHandler("Cloudinary is not configured properly", 500));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath || avatar.data, {
    folder: "Book_Store_Admin_Avatars",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary upload error:", cloudinaryResponse.error || "Unknown cloudinary error");
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    }
  });

  res.status(201).json({ 
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});
