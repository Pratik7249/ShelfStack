import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import SettingPopup from "../popups/SettingPopup";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isSettingPopupOpen = useSelector((state) => state.popup.issettingPopup); // ✅ FIXED STATE KEY
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2">
          <img src={userIcon} alt="User Logo" className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
              {user?.name || "Guest"}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>
          <span className="bg-black h-14 w-[2px]" />
          <img
            src={settingIcon}
            alt="Setting Icon"
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              console.log("Setting icon clicked! Dispatching toggleSettingPopup...");
              dispatch(toggleSettingPopup());
            }}
          />
        </div>
      </header>

      {/* ✅ Setting Popup */}
      <SettingPopup isOpen={isSettingPopupOpen} />
    </>
  );
};

export default Header;
