import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const { borrowedBooks, loading, error, message } = useSelector((state) => state.borrow);
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

  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();
  const currentDate = new Date();

  const borrowedBooksList = borrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = borrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooksList : overdueBooks;

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">Borrowed Books</h2>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${filter === "borrowed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === "overdue" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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
                <th className="px-4 py-2 text-center">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {booksToDisplay.map((book) => (
                <tr key={book._id} className="bg-gray-100">
                  <td className="px-4 py-2 text-center">{book?.user.name}</td>
                  <td className="px-4 py-2 text-center">{formatDate(book.dueDate)}</td>
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
