import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice"; // Ensure correct import
import { toggleAddNewAdminPopup } from "../store/slices/popupSlice";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";

const AddNewAdminComponent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(placeHolder);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>{
        setAvatarPreview(reader.result);
      }
      reader.readAsDataURL(file);
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
        <div className="p-6">
          {/* HEADER */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={keyIcon} alt="Key icon" className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Add New Admin</h3>
            </div>
            <img
              src={closeIcon}
              alt="Close icon"
              className="w-6 h-6 cursor-pointer"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
            />
          </header>

          {/* FORM */}
          <form onSubmit={handleAddNewAdmin} className="mt-4">
            {/* Name Input */}
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />

            {/* Email Input */}
            <label className="block mt-3 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />

            {/* Password Input */}
            <label className="block mt-3 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />

            {/* Avatar Upload */}
            <label className="block mt-3 mb-2">Avatar</label>
            <div className="flex items-center gap-3">
              <img src={avatarPreview} alt="Avatar Preview" className="w-12 h-12 rounded-full border" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAdminComponent;
