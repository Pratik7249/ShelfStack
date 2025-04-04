import { catchAsyncErrors } from "../middlewares/catchAsynError.js";
import { Book } from "../models/bookModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || price == null || quantity == null) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Auto-set availability based on quantity
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    availability: quantity > 0,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    data: book,
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  if (books.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No books found in the database",
      books: [],
    });
  }

  res.status(200).json({
    success: true,
    books,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
