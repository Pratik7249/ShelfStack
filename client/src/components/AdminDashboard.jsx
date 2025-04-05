import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";
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
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";

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

// (All imports remain the same, no change here)

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { borrowedBooks } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const totalUsers = users?.length || 0;
  const totalAdmins = users?.filter((user) => user.role === "Admin").length || 0;
  const totalBooks = books?.length || 0;
  const totalBorrowed = borrowedBooks?.length || 0;

  const totalReturned = borrowedBooks?.filter((item) => item?.returned === true).length || 0;
  const totalCurrentlyBorrowed = totalBorrowed - totalReturned;

  const usersChartData = {
    labels: ["Admins", "Users", "Books"],
    datasets: [
      {
        label: "Library Overview",
        data: [totalAdmins, totalUsers - totalAdmins, totalBooks],
        backgroundColor: ["#4B5563", "#1D4ED8", "#10B981"],
        borderColor: ["#374151", "#1E3A8A", "#047857"],
        borderWidth: 1,
      },
    ],
  };

  const borrowedChartData = {
    labels: ["Currently Borrowed", "Returned"],
    datasets: [
      {
        label: "Borrowed Books Stats",
        data: [totalCurrentlyBorrowed, totalReturned],
        backgroundColor: ["#F97316", "#22C55E"],
        borderColor: ["#EA580C", "#15803D"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col gap-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor users, books, and borrowing activities in real-time.</p>
        </div>
        <img src={logo} alt="Logo" className="w-12 h-12" />
      </header>

      {/* Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-5 shadow-md flex items-center gap-4">
          <img src={adminIcon} alt="Admins" className="w-12 h-12" />
          <div>
            <h2 className="text-gray-600 text-sm">Total Admins</h2>
            <p className="text-xl font-semibold">{totalAdmins}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md flex items-center gap-4">
          <img src={usersIcon} alt="Users" className="w-12 h-12" />
          <div>
            <h2 className="text-gray-600 text-sm">Total Users</h2>
            <p className="text-xl font-semibold">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-md flex items-center gap-4">
          <img src={bookIcon} alt="Books" className="w-12 h-12" />
          <div>
            <h2 className="text-gray-600 text-sm">Total Books</h2>
            <p className="text-xl font-semibold">{totalBooks}</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Users & Books Distribution</h2>
          <div className="w-full max-w-md mx-auto">
            <Pie data={usersChartData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Overview</h2>
          <p className="text-gray-500 text-sm mb-2">Track total borrowed vs returned books</p>
          <div className="w-full max-w-md mx-auto">
            <Pie data={borrowedChartData} />
          </div>
        </div>
      </section>

      {/* 📚 Context Footer */}
      <footer className="bg-white rounded-lg p-6 shadow-inner text-center text-gray-600 mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">About this System</h3>
        <p className="max-w-2xl mx-auto text-sm">
          This Library Management System is designed to streamline the administration of books,
          user roles, and borrowing records. Admins can oversee inventory, track borrowed and
          returned books, and manage user roles — all through this responsive and intuitive dashboard.
          It's built with modern tools like React, Redux Toolkit, and Chart.js to ensure a seamless user experience.
        </p>
        <p className="text-xs text-gray-400 mt-4">© {new Date().getFullYear()} LMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;

