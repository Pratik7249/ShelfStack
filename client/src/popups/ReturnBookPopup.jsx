import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { returnBorrowedBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const ReturnBookPopup = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(book?.user?.email || "");

  const handleReturnBook = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required!");
      return;
    }

    dispatch(returnBorrowedBook(email, book._id));
    dispatch(toggleReturnBookPopup());
    onClose(); // Close popup after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg md:w-1/3 p-6 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Return Book</h2>

        <form onSubmit={handleReturnBook}>
          <div className="mb-4">
            <label className="font-semibold">User Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 w-full"
              placeholder="Enter borrower's email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Return
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
