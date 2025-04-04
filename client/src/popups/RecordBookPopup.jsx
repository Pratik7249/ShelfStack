import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";

const RecordBookPopup = ({ onSave }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Title and Author are required!");
      return;
    }
    onSave(formData);
    dispatch(toggleRecordBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg md:w-1/3 p-6 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-gray-800"
          onClick={() => dispatch(toggleRecordBookPopup())}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Record New Book</h2>

        <div className="mb-4">
          <label className="font-semibold">Book Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 w-full"
            placeholder="Enter book title"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Book Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 w-full"
            placeholder="Enter author name"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 w-full"
            placeholder="Enter book description (optional)"
            rows="3"
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Book
        </button>
      </div>
    </div>
  );
};

export default RecordBookPopup;
