import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice"; // ✅ FIXED IMPORT
import { updatePassword } from "../store/slices/authSlice";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";

const SettingPopup = ({ isOpen }) => {
  const dispatch = useDispatch();
  const { loading, error: apiError, message } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  // ✅ Handle password update
  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setError(null);
    dispatch(updatePassword({ currentPassword, newPassword, confirmPassword }));
  };

  // ✅ Prevent rendering when popup is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          {/* HEADER */}
          <header className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center gap-2">
              <img src={keyIcon} alt="Key icon" className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Update Password</h3>
            </div>
            <img
              src={closeIcon}
              alt="Close icon"
              className="w-6 h-6 cursor-pointer"
              onClick={() => dispatch(toggleSettingPopup())} // ✅ FIXED CLOSE FUNCTION
            />
          </header>

          {/* FORM */}
          <form onSubmit={handleUpdatePassword} className="mt-4">
            {apiError && <p className="text-red-500 text-sm mb-2">{apiError}</p>}
            {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

            {/* Current Password */}
            <label className="block mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />

            {/* New Password */}
            <label className="block mt-3 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />

            {/* Confirm Password */}
            <label className="block mt-3 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-500" : ""}`}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {/* Submit Button */}
            <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
