import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from 'react-router-dom';
import SideBar from './../layout/SideBar';
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import Catalog from "../components/Catalog";
import BookManagement from "../components/BookManagement";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import { getUser } from "../store/slices/authSlice";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }  
  
  const renderComponent = () => {
    const isAdmin = user?.role === "Admin";
    
    // Switch statement to determine which component to render
    switch(selectedComponent) {
      case "Dashboard":
        return user?.role === "Admin" ? <AdminDashboard /> : <UserDashboard />;
      case "Books":
        return <BookManagement />;
      case "Catalog":
        if(user?.role === "Admin") {
          return <Catalog />;
        }
        return <UserDashboard />;
      case "Users": 
        if(user?.role === "Admin") {
          return <Users />;
        }
        return <UserDashboard />;
      case "My Borrowed Books":
        return <MyBorrowedBooks />;
      default:
        return user?.role === "Admin" ? <AdminDashboard /> : <UserDashboard />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-900">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu className="text-2xl cursor-pointer" onClick={() => setIsSideBarOpen(!isSideBarOpen)} />
      </div>
      <SideBar 
        isSideBarOpen={isSideBarOpen} 
        setIsSideBarOpen={setIsSideBarOpen} 
        setSelectedComponent={setSelectedComponent}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Home;
