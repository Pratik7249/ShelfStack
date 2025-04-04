import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, clearAuthState } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.auth);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgotPassword( email ));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    }
  }, [dispatch, error, message]);

  return (
    <div className="flex justify-center flex-col md:flex-row h-screen">
      {/* LEFT SIDE - Background with Sign Up Link */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto" />
          </div>
          <p className="text-gray-300 mb-12">Don't have an account? Register now.</p>
          <Link 
            to="/register" 
            className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
      
      {/* RIGHT SIDE - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5 mb-6">
            <h3 className="font-medium text-3xl">Forgot Password</h3>
            <img src={logo} alt="logo" className="h-auto w-24 object-cover" />
          </div>
        </div>
        
        <p className="text-gray-800 text-center mb-8">Enter your email to reset your password.</p>
        
        <form onSubmit={handleForgotPassword} className="w-full max-w-sm">
          <div className="mb-4">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" 
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="border-2 mt-5 w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition border-black"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
          
          <div className="block md:hidden font-semibold mt-5 text-center">
            <p>Remember your password? {" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
