import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { recordBorrowedBook } from "../store/slices/borrowSlice";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecordBook = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!bookId) {
      toast.error("Error: Book ID is missing!");
      return;
    }

    setLoading(true);
    dispatch(recordBorrowedBook(email, bookId))
      .unwrap()
      .then(() => {
        toast.success("Book successfully recorded for user!");
        dispatch(toggleRecordBookPopup());
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to record book.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        dispatch(toggleRecordBookPopup());
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg md:w-1/3 p-6 relative">
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-gray-800"
          onClick={() => dispatch(toggleRecordBookPopup())}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Record Book</h2>

        <form onSubmit={handleRecordBook}>
          <div className="mb-4">
            <label className="font-semibold">User Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 w-full"
              placeholder="Enter borrower's email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-md transition`}
          >
            {loading ? "Recording..." : "Record"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
