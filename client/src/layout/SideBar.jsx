import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import {
  RiAdminFill,
  RiDashboardLine,
  RiUser2Fill,
  RiBookMarkedLine,
  RiBookOpenLine,
  RiBook2Fill,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiCloseLine,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, clearAuthState } from "../store/slices/authSlice";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popupSlice"; // ✅ Import action
import { toast } from "react-toastify";
import AddNewAdmin from "./../popups/AddNewAdmin"; // ✅ Correct Import
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent, settingPopup }) => {
  const dispatch = useDispatch();
  const addNewAdminPopup = useSelector((state) => state.popup.addNewAdminPopup); // ✅ Correct Selector
  const { isAuthenticated, loading, error, message, user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "Admin";

  const handleLogout = () => {
    dispatch(logoutUser());
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

  if (loading) {
    return <div className="text-white p-4">Loading Sidebar...</div>;
  }

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } transition-all duration-700 md:left-0 fixed top-0 h-screen w-64 bg-black text-white flex flex-col z-50`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-4 my-8 flex justify-between items-center">
          <img src={logo_with_title} alt="Logo" className="h-10" />
          {/* Close Button (Only for Mobile) */}
          <button className="md:hidden" onClick={() => setIsSideBarOpen(false)}>
            <RiCloseLine className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 flex-1 space-y-3">
          <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedComponent("Dashboard")}>
            <RiDashboardLine className="h-5 w-5 mr-2" />
            <span>Dashboard</span>
          </button>

          <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedComponent("Books")}>
            <RiBookOpenLine className="h-5 w-5 mr-2" />
            <span>Books</span>
          </button>

          {isAdmin && (
            <>
              <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedComponent("Catalog")}>
                <RiBookMarkedLine className="h-5 w-5 mr-2" />
                <span>Catalog</span>
              </button>

              <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedComponent("Users")}>
                <RiUser2Fill className="h-5 w-5 mr-2" />
                <span>Users</span>
              </button>

              <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => dispatch(toggleAddNewAdminPopup())}>
                <RiAdminFill className="h-5 w-5 mr-2" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedComponent("My Borrowed Books")}>
              <RiBook2Fill className="h-5 w-5 mr-2" />
              <span>My Borrowed Books</span>
            </button>
          )}

          <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-800" onClick={()=>dispatch(toggleSettingPopup())}>
            <RiSettings4Line className="h-5 w-5 mr-2" />
            <span>Update Credentials</span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-6">
          <button className="flex items-center w-full p-2 rounded-md bg-red-600 hover:bg-red-700" onClick={handleLogout}>
            <RiLogoutBoxRLine className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Add New Admin Popup */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
