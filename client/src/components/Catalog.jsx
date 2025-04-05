import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBorrowedBooks,
  returnBorrowedBook,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const { borrowedBooks, loading, error, message } = useSelector(
    (state) => state.borrow
  );
  const [filter, setFilter] = useState("borrowed");

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString();

  const currentDate = new Date();

  const borrowedBooksList = borrowedBooks?.map((book) => ({
    ...book,
    status: new Date(book.dueDate) > currentDate ? "Borrowed" : "Overdue",
  }));

  const booksToDisplay =
    filter === "borrowed"
      ? borrowedBooksList.filter((book) => book.status === "Borrowed")
      : borrowedBooksList.filter((book) => book.status === "Overdue");

  const handleReturnBook = (bookId, email) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      dispatch(returnBorrowedBook({ email, bookId }));
    }
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          Borrowed Books
        </h2>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "borrowed" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "overdue" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </div>
      </header>

      {loading ? (
        <p>Loading books...</p>
      ) : booksToDisplay.length > 0 ? (
        <div className="overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center">Username</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Due Date</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {booksToDisplay.map((book) => (
                <tr key={book._id} className="bg-gray-100">
                  <td className="px-4 py-2 text-center">
                    {book?.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {book?.user?.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatDate(book.dueDate)}
                  </td>
                  <td
                    className={`px-4 py-2 text-center font-semibold ${
                      book.status === "Overdue"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {book.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                      onClick={() =>
                        handleReturnBook(book._id, book?.user?.email)
                      }
                    >
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3>No books found.</h3>
      )}
    </main>
  );
};

export default Catalog;