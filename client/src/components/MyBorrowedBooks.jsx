import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReadBookPopup from "../popups/ReadBookPopup";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book); // Fetch all books
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState(null);
  const [filter, setFilter] = useState("returned");

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const openReadPopup = (borrowedBook) => {
    const bookDetails = books.find((book) => book._id === borrowedBook.bookId);

    if (bookDetails) {
      setReadBook({
        title: borrowedBook.bookTitle || "Title not available",
        author: bookDetails.author || "Unknown Author",
        description: bookDetails.description || "No description available",
      });
      dispatch(toggleReadBookPopup());
    } else {
      console.error("Book details not found for:", borrowedBook);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned);
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => !book.returned);
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

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-center">Title</th>
                  <th className="px-4 py-2 text-center">Borrowed Date</th>
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
                      {book.returned ? "Returned" : "Not Returned"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <BookA 
                        onClick={() => openReadPopup(book)} 
                        className="cursor-pointer text-blue-600" 
                      />
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

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
