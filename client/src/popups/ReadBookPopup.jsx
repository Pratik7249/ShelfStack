import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();

  if (!book || !book.title) {
    console.log("Book data is missing:", book);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg md:w-1/3 p-6 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-gray-800"
          onClick={() => dispatch(toggleReadBookPopup(null))}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">View Book Info</h2>

        <div className="mb-4">
          <label className="font-semibold">Book Title</label>
          <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
            {book.title || "Title not available"}
          </p>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Book Author</label>
          <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
            {book.author || "Unknown Author"}
          </p>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Description</label>
          <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
            {book.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
