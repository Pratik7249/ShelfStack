import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, clearAuthState } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png"; // ✅ Ensure this is imported

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [dispatch, message, error]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        {/* BACK BUTTON (unchanged) */}
        <Link
          to="/register"
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
        >
          Back
        </Link>

        {/* OTP FORM CONTAINER */}
        <div className="max-w-sm w-full text-center">
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          </div>

          {/* HEADER TEXT */}
          <h1 className="text-3xl font-semibold mb-4">Check your Mailbox</h1>
          <p className="text-gray-700 mb-6">Please enter the OTP to proceed</p>

          {/* OTP FORM */}
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none text-center text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              {loading ? "Verifying..." : "VERIFY"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        <div className="text-center h-[400px]">
          {/* LOGO WITH TITLE */}
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>

          {/* SIGN-UP PROMPT */}
          <p className="text-gray-300 mb-6">New to our platform? Sign up now.</p>
          
          {/* FIXED SIGN-UP BUTTON */}
          <Link
            to="/register"
            className="border-2 border-white px-8 py-2 w-full font-semibold bg-transparent text-white rounded-lg hover:bg-white hover:text-black transition duration-300 ease-in-out"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;
