import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const { issettingPopup } = useSelector((state) => state.popup); // ✅ kept as you confirmed
  const { borrowedBooks: userBorrowedBooks, loading, error } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  // Fetch books
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  // Log for debugging
  useEffect(() => {
    console.log("📚 Borrowed Books from Redux:", userBorrowedBooks);
  }, [userBorrowedBooks]);

  // Count logic
  useEffect(() => {
    const borrowed = userBorrowedBooks?.filter((book) => !book.returned) || [];
    const returned = userBorrowedBooks?.filter((book) => book.returned) || [];
    setTotalBorrowedBooks(borrowed.length);
    setTotalReturnedBooks(returned.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Borrowed Books", "Returned Books"],
    datasets: [
      {
        label: "Book Status",
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
        hoverBackgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      <div className="flex flex-col-reverse xl:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-[4] flex flex-col gap-7 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
          <div className="flex flex-col gap-7">
            <div className="bg-white p-5 rounded-lg transition hover:shadow-inner duration-300 flex items-center gap-4">
              <div className="w-2 bg-black h-20" />
              <div className="h-20 flex items-center justify-center bg-gray-200 p-3 rounded">
                <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium">Your Borrowed Book List</p>
            </div>
          </div>
        </div>

        {/* Right Section - Chart */}
        <div className="flex-[2] bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Borrowing Summary</h3>

          <div className="w-full h-64 flex items-center justify-center border border-gray-200 rounded">
            {loading ? (
              <p className="text-sm text-gray-400">Loading chart...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error: {error}</p>
            ) : totalBorrowedBooks > 0 || totalReturnedBooks > 0 ? (
              <Pie data={data} />
            ) : (
              <p className="text-sm text-gray-500">No borrowing data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;
