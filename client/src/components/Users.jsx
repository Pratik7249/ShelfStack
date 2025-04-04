import React, { useState, useEffect } from "react";
import axios from "axios";
import Headers from "../layout/Header";

// Define base API URL
const API_URL = "http://localhost:5000/api/v1";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/all`, {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        setError(`Failed to fetch users: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Headers />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
      </div>

      {users && users.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-center">ID</th>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Role</th>
                <th className="px-4 py-2 text-center">Books Borrowed</th>
                <th className="px-4 py-2 text-center">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className={(index + 1)%2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{user.name}</td>
                  <td className="px-4 py-2 text-center">{user.email}</td>
                  <td className="px-4 py-2 text-center">{user.role}</td>
                  <td className="px-4 py-2 text-center">{user?.borrowedBooks?.length || 0}</td>
                  <td className="px-4 py-2 text-center">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No registered users found.</p>
      )}
    </main>
  );
};

export default Users;
