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
  const { user } = useSelector((state) => state.auth); // Assuming you store user info in auth
  const { borrowedBooks: userBorrowedBooks, loading, error } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    const borrowed = userBorrowedBooks?.filter((book) => !book.returned) || [];
    const returned = userBorrowedBooks?.filter((book) => book.returned) || [];

    const now = new Date();
    const overdue = borrowed.filter((book) => new Date(book.dueDate) < now);

    setTotalBorrowedBooks(borrowed.length);
    setTotalReturnedBooks(returned.length);
    setOverdueBooks(overdue.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Borrowed Books", "Returned Books"],
    datasets: [
      {
        label: "Book Status",
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
        hoverBackgroundColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        hoverOffset: 6,
        borderWidth: 1,
      },
    ],
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  const recentActivity = userBorrowedBooks?.slice(0, 5) || [];

  return (
    <main className="relative flex-1 p-6 pt-28 bg-gray-100 min-h-screen">
      <Header />

      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h2>
        <p className="text-gray-500">{formatDate(new Date())}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Currently Borrowed" value={totalBorrowedBooks} color="bg-blue-500" />
        <StatCard label="Returned Books" value={totalReturnedBooks} color="bg-green-500" />
        <StatCard label="Overdue Books" value={overdueBooks} color="bg-red-500" />
        <StatCard label="Total Records" value={userBorrowedBooks?.length || 0} color="bg-purple-500" />
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-[2] bg-white rounded-lg p-6 shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4 text-center">Borrowing Summary</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            {loading ? (
              <p className="text-sm text-gray-400">Loading chart...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error: {error}</p>
            ) : totalBorrowedBooks > 0 || totalReturnedBooks > 0 ? (
              <div className="w-full h-full">
                <Pie data={data} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No borrowing data available yet.</p>
            )}
          </div>
        </div>

        <div className="flex-[3] bg-white rounded-lg p-6 shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul className="space-y-2">
              {recentActivity.map((book, idx) => (
                <li
                  key={book.bookId + idx}
                  className="p-3 bg-gray-50 border rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{book.bookTitle || "Untitled"}</p>
                    <p className="text-sm text-gray-500">
                      Borrowed: {formatDate(book.borrowedDate)}{" "}
                      | Due: {formatDate(book.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      book.returned ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {book.returned ? "Returned" : "Not Returned"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

// ✅ Mini Card Component
const StatCard = ({ label, value, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color}`}>
    <p className="text-sm">{label}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default UserDashboard;
