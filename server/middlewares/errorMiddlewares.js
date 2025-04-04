class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  console.log("Error middleware is working! 500 error occurred. Error: ", err);
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  console.log("Error: ", err);

  // Handle duplicate key error (MongoDB)
  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field entered", 400);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JSON Web Token. Please try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired. Please log in again.", 400);
  }

  // Handle invalid Mongoose ObjectId (CastError)
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found: ${err.path}`, 400);
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message).join(", ");
    err = new ErrorHandler(messages, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
