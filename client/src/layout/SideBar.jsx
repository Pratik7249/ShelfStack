import React, { useEffect, useCallback } from "react";
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
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

// Reusable Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    className={`flex items-center w-full p-2 rounded-md hover:bg-gray-800 transition ${
      isActive ? "bg-gray-700" : ""
    }`}
    onClick={onClick}
  >
    <Icon className="h-5 w-5 mr-2" />
    <span>{label}</span>
  </button>
);

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent, selectedComponent, settingPopup }) => {
  const dispatch = useDispatch();
  const addNewAdminPopup = useSelector((state) => state.popup.addNewAdminPopup);
  const { isAuthenticated, loading, error, message, user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "Admin";

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

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
          <button className="md:hidden" onClick={() => setIsSideBarOpen(false)}>
            <RiCloseLine className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 flex-1 space-y-3">
          <SidebarItem
            icon={RiDashboardLine}
            label="Dashboard"
            isActive={selectedComponent === "Dashboard"}
            onClick={() => setSelectedComponent("Dashboard")}
          />

          <SidebarItem
            icon={RiBookOpenLine}
            label="Books"
            isActive={selectedComponent === "Books"}
            onClick={() => setSelectedComponent("Books")}
          />

          {isAdmin && (
            <>
              <SidebarItem
                icon={RiBookMarkedLine}
                label="Catalog"
                isActive={selectedComponent === "Catalog"}
                onClick={() => setSelectedComponent("Catalog")}
              />
              <SidebarItem
                icon={RiUser2Fill}
                label="Users"
                isActive={selectedComponent === "Users"}
                onClick={() => setSelectedComponent("Users")}
              />
              <SidebarItem
                icon={RiAdminFill}
                label="Add New Admin"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              />
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <SidebarItem
              icon={RiBook2Fill}
              label="My Borrowed Books"
              isActive={selectedComponent === "My Borrowed Books"}
              onClick={() => setSelectedComponent("My Borrowed Books")}
            />
          )}

          <SidebarItem
            icon={RiSettings4Line}
            label="Update Credentials"
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-6">
          <button className="flex items-center w-full p-2 rounded-md bg-red-600 hover:bg-red-700" onClick={handleLogout}>
            <RiLogoutBoxRLine className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Popups */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
