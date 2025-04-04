import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser, clearAuthState } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginUser({ email, password })); // ✅ Corrected dispatch (removed FormData)

    // ✅ Navigate after successful login (this should be inside useEffect)
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
    if (isAuthenticated) {
      navigate("/"); // ✅ Redirect on authentication
    }
  }, [dispatch, error, message, isAuthenticated, navigate]);

  if(isAuthenticated) return <Navigate to={"/"} />;

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
      
      {/* RIGHT SIDE - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5 mb-6">
            <h3 className="font-medium text-4xl">Sign In</h3>
            <img src={logo} alt="logo" className="h-auto w-24 object-cover" />
          </div>
        </div>
        
        <p className="text-gray-800 text-center mb-8">Please enter your credentials to sign in.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm">
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
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link 
              to="/password/forgot" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="border-2 mt-5 w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition border-black"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <div className="block md:hidden font-semibold mt-5 text-center">
            <p>Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
