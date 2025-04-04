import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccount.js";

export const app = express();

// Load environment variables
config({ path: "./config/config.env" });

// ✅ Fix CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies & authentication headers
}));

// ✅ Manually handle CORS preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Respond to preflight requests
  }
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// Background Services
notifyUsers();
removeUnverifiedAccounts();

// Database Connection
connectDB();

// Global Error Middleware
app.use(errorMiddleware);
