import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popupSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    error: null,
    message: null,
    loading: false,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addNewAdminRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addNewAdminSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.message = "Admin added successfully!";
    },
    addNewAdminFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllUsersRequest,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  addNewAdminRequest,
  addNewAdminSuccess,
  addNewAdminFailure,
} = userSlice.actions;

// ✅ Function to Fetch All Users
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(fetchAllUsersRequest());
  try {
    const res = await axios.get("http://localhost:5000/api/v1/user/all", { withCredentials: true });
    dispatch(fetchAllUsersSuccess(res.data.users));
  } catch (err) {
    dispatch(fetchAllUsersFailure(err.response?.data?.message || "Error fetching users"));
  }
};

// ✅ Function to Add New Admin
export const addNewAdmin = (formData) => async (dispatch) => {
  dispatch(addNewAdminRequest());
  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/user/add/new-admin",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(addNewAdminSuccess(res.data.user));
    toast.success(res.data.message);
    dispatch(toggleAddNewAdminPopup());
  } catch (err) {
    dispatch(addNewAdminFailure(err.response?.data?.message || "Error adding admin"));
    toast.error(err.response?.data?.message || "Error adding admin");
  }
};

// ✅ Export reducer
export default userSlice.reducer;
