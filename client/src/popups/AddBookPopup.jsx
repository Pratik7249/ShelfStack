import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const handleAddBook = async (e) => {
    e.preventDefault();
  
    const bookData = {
      title,
      quantity: Number(quantity),
      price: Number(price),
      author,
      description,
    };
  
    try {
      const resultAction = await dispatch(addBook(bookData)); // Wait for action to complete
  
      if (addBook.fulfilled.match(resultAction)) {
        toast.success("✅ Book added successfully!");
      } else {
        toast.error(resultAction.payload || "❌ Failed to add book.");
      }
    } catch (err) {
      console.error("❌ Error adding book:", err);
      toast.error("Something went wrong.");
    }
  };
  
  
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-gray-800"
          onClick={() => dispatch(toggleAddBookPopup())}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Book</h2>

        <form onSubmit={handleAddBook}>
          <div className="mb-4">
            <label className="font-semibold">Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Price (USD)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Enter book price"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="Enter book description"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
