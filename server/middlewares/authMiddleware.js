import { catchAsyncErrors } from "./catchAsynError.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Ensure req.cookies exists
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 403));
  }
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User is not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("User role is not authorized to perform this action", 403));
    }

    next();
  };
};
