import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { registerUser, clearAuthState } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated, user } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    dispatch(registerUser({ data }));
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    dispatch(registerUser({ name, email, password }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(clearAuthState());
      navigateTo(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [dispatch, message, error, navigateTo, email,loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  
  return (
    <div className="flex justify-center flex-col md:flex-row h-screen">
      {/* LEFT */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto" />
          </div>
          <p className="text-gray-300 mb-12">Already have Account? Sign in now.</p>
          <Link to="/login" className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition">SIGN IN</Link>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5 mb-6">
            <h3 className="font-medium text-4xl">Sign Up</h3>
            <img src={logo} alt="logo" className="h-auto w-24 object-cover" />
          </div>
        </div>
        <p className="text-gray-800 text-center mb-8">Please provide your information to sign up.</p>
        <form onSubmit={handleRegister} className="w-full max-w-sm">
          <div className="mb-4">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name" 
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none"
              required 
            />
          </div>
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
          <div className="mb-4">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none"
              required 
            />
          </div>
          <div className="block md:hidden font-semibold mt-5 mb-4 text-center">
            <p>Already have Account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
