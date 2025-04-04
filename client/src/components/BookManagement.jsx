import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import { BookA, NotebookPen } from "lucide-react";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector((state) => state.popup);
  const { error: borrowSliceError, message: borrowSliceMessage } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    if (book) {
      setReadBook(book);
      dispatch(toggleReadBookPopup());
    }
  };

  const [borrowBookId, setBorrowBookId] = useState("");
  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowSliceMessage, borrowSliceError]);

  const [searchedKeyword, setSearchedKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };
  const searchedBooks = books.filter((book) => book.title.toLowerCase().includes(searchedKeyword));

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user?.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                  +
                </span>
                Add Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {/* Table */}
        {books && books.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Author</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-center">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-center">Price</th>
                  <th className="px-4 py-2 text-center">Availability</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {searchedBooks.map((book, index) => (
                  <tr key={book._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">{book.title}</td>
                    <td className="px-4 py-2 text-center">{book.author}</td>
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2 text-center">{book.quantity}</td>
                    )}
                    <td className="px-4 py-2 text-center">${book.price}</td>
                    <td className="px-4 py-2 text-center">
                      {book.quantity > 0 ? "Available" : "Out of Stock"}
                    </td>
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2 text-center flex justify-center gap-2">
                        <BookA className="cursor-pointer" onClick={() => openReadPopup(book._id)} />
                        <NotebookPen className="cursor-pointer" onClick={() => openRecordBookPopup(book._id)} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No books found.</p>
        )}
      </main>
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
