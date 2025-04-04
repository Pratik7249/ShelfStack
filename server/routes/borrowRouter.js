import express from "express";

import { borrowedBooks,recordBorrowedBooks, getBorrowedBooksForAdmin, returnBorrowedBook } from "../controllers/borrowController.js";
import {
  isAuthenticated,isAuthorized
} from './../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/record-borrow-book/:id", isAuthenticated,  recordBorrowedBooks);


router.get("/borrowed-books-by-users", isAuthenticated,isAuthorized("Admin"), getBorrowedBooksForAdmin);

router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

router.put("/return-borrowed-book/:bookId", isAuthenticated, returnBorrowedBook);

export default router;