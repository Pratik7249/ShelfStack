import React, { useState, useEffect } from "react";
import { BookA, RotateCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReadBookPopup from "../popups/ReadBookPopup";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import {
  fetchUserBorrowedBooks,
  returnBorrowedBook,
} from "../store/slices/borrowSlice";
import { fetchAllBooks } from "../store/slices/bookSlice"; // If needed

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { borrowedBooks, loading, error } = useSelector((state) => state.borrow);
  const { books } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth); // Needed for return
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState(null);
  const [filter, setFilter] = useState("returned");

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
    if (!books || books.length === 0) {
      dispatch(fetchAllBooks());
    }
  }, [dispatch]);

  const openReadPopup = (borrowedBook) => {
    const bookDetails = books.find((book) => book._id === borrowedBook.bookId);
    setReadBook({
      title: borrowedBook.bookTitle || bookDetails?.title || "Title not available",
      author: bookDetails?.author || "Unknown Author",
      description: bookDetails?.description || "No description available",
    });
    dispatch(toggleReadBookPopup());
  };

  const handleReturn = (bookId) => {
    if (user?.email) {
      dispatch(returnBorrowedBook(user.email, bookId)).then(() => {
        dispatch(fetchUserBorrowedBooks()); // refresh
      });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const returnedBooks = borrowedBooks?.filter((book) => book.returned);
  const nonReturnedBooks = borrowedBooks?.filter((book) => !book.returned);
  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">My Borrowed Books</h2>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${filter === "returned" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("returned")}
            >
              Returned
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "notReturned" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("notReturned")}
            >
              Not Returned
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-center text-gray-500 mt-6">Loading borrowed books...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-6">{error}</p>
        ) : booksToDisplay?.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-center">Title</th>
                  <th className="px-4 py-2 text-center">Borrowed Date</th>
                  <th className="px-4 py-2 text-center">Due Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr key={book.bookId} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">{book.bookTitle || "No title"}</td>
                    <td className="px-4 py-2 text-center">{formatDate(book.borrowedDate)}</td>
                    <td className="px-4 py-2 text-center">
                      {book.dueDate ? formatDate(book.dueDate) : "Not specified"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {book.returned ? "Returned" : "Not Returned"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <BookA
                          onClick={() => openReadPopup(book)}
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                          title="Read"
                        />
                        {!book.returned && (
                          <RotateCw
                            onClick={() => handleReturn(book.bookId)}
                            className="cursor-pointer text-green-600 hover:text-green-800"
                            title="Return Book"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No borrowed books found.</p>
        )}
      </main>

      {readBookPopup && readBook && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
