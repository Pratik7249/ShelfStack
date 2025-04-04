import { catchAsyncErrors } from "../middlewares/catchAsynError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculate.js";

// Get borrowed books for the logged-in user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = req.user?.borrowedBooks || [];
  res.status(200).json({ success: true, borrowedBooks });
});

// Record book borrowing
export const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found or not verified", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is out of stock", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.some(
    (b) => b.bookId.toString() === id && !b.returned
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("User has already borrowed this book", 400));
  }

  // Update book stock
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Add book to user record
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
    returned: false,
  });
  await user.save();

  // Create a borrow record
  try {
    const borrow = new Borrow({
      user: user._id,
      name: user.name,
      email: user.email,
      book: book._id,
      dueDate,
      price: book.price,
    });

    await borrow.save();
    console.log("Borrow record saved:", borrow);
  } catch (error) {
    console.error("Error saving borrow record:", error);
    return next(new ErrorHandler("Failed to save borrow record", 500));
  }

  res.status(200).json({ success: true, message: "Book borrowed successfully" });
});

// Get all borrowed books for admin
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find().populate("user book");
  res.status(200).json({ success: true, borrowedBooks });
});

// Return borrowed book
export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && !b.returned
  );
  if (!borrowedBook) return next(new ErrorHandler("User has not borrowed this book", 400));

  borrowedBook.returned = true;
  await user.save();

  // Update book stock
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Find borrow record
  const borrow = await Borrow.findOne({ 
    book: bookId, 
    user: user._id, 
    returnDate: null 
  });
  
  if (!borrow) return next(new ErrorHandler("No active borrow record found", 404));

  // Calculate fine and update return date
  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    success: true,
    message: fine > 0 ? `Book returned with a fine of ${fine}` : "Book returned successfully with no fine.",
    fine,
    totalAmount: fine + book.price
  });
});
