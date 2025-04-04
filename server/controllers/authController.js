import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { catchAsyncErrors } from "../middlewares/catchAsynError.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplate.js";
import crypto from "crypto";

// 📌 User Registration with OTP Verification
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields correctly", 400));
  }

  // Check if a verified user already exists
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Check for unverified accounts
  let unverifiedUser = await User.findOne({ email, accountVerified: false });
  if (unverifiedUser && unverifiedUser.failedAttempts >= 5) {
    return next(new ErrorHandler("Too many failed registration attempts", 400));
  }

  if (password.length < 8 || password.length > 15) {
    return next(new ErrorHandler("Password must be between 8 and 15 characters long", 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ name, email, password: hashedPassword });

  // Generate OTP and send verification email
  const verificationCode = user.generateVerificationCode();
  await user.save();

  sendVerificationCode(verificationCode, email, res);
});

// 📌 OTP Verification
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return next(new ErrorHandler("Please provide both email and OTP", 400));
  }

  const user = await User.findOne({ email, accountVerified: false });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.verificationCode !== parseInt(otp, 10)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (Date.now() > new Date(user.verificationCodeExpiry).getTime()) {
    return next(new ErrorHandler("Verification code expired", 400));
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpiry = null;
  await user.save();

  sendToken(user, 200, "Account Verified", res);
});

// 📌 User Login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide both email and password", 400));
  }

  // Check if user exists and is verified
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password matches
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, "Logged In Successfully", res);
});

// 📌 User Logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", { expires: new Date(Date.now()), httpOnly: true }).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// 📌 Get User Profile
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// 📌 Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Please provide an email", 400));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("Invalid email", 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Remove any trailing slash from FRONTEND_URL to prevent double slashes
  const frontendUrl = process.env.FRONTEND_URL.endsWith('/') 
    ? process.env.FRONTEND_URL.slice(0, -1) 
    : process.env.FRONTEND_URL;
    
  const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({ email: user.email, subject: "Book LMS Password Recovery", message });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
});

// 📌 Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) return next(new ErrorHandler("Reset token is required", 400));

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ 
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
  }

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters long", 400));
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// 📌 Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) return next(new ErrorHandler("User not found", 404));

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New passwords do not match", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
