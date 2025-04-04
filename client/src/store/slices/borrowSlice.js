import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    allBorrowedBooks: [],
    userBorrowedBooks: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.userBorrowedBooks = action.payload;
      state.loading = false;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {  // ✅ FIXED missing `action`
      state.message = action.payload;
      state.loading = false;
    },
    recordBookFailed(state, action) {  // ✅ FIXED missing `action`
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },

    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.allBorrowedBooks = action.payload;
      state.loading = false;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {  
      state.message = action.payload;
      state.loading = false;
    },
    returnBookFailed(state, action) {  
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },

    resetBorrowSlice(state) {  
      state.allBorrowedBooks = [];
      state.userBorrowedBooks = [];
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const res = await axios.get("http://localhost:5000/api/v1/borrow/my-borrowed-books", { withCredentials: true });
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (error) {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(error.response?.data?.message || "Failed to fetch user borrowed books"));
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const res = await axios.get("http://localhost:5000/api/v1/borrow/borrowed-books-by-users", { withCredentials: true });
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks)); // ✅ Fixed typo
  } catch (error) {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(error.response?.data?.message || "Failed to fetch all borrowed books"));
  }
};

export const recordBorrowedBook = (email , id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await axios.post(`http://localhost:5000/api/v1/borrow/record-borrow-book/${id}`, {email}, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
  } catch (error) {
    dispatch(borrowSlice.actions.recordBookFailed(error.response?.data?.message || "Failed to record borrowed book"));
  }
};

export const returnBorrowedBook = (email,id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await axios.put(`http://localhost:5000/api/v1/borrow/return-borrowed-book/${id}`, {email}, { withCredentials: true });
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  } catch (error) {
    dispatch(borrowSlice.actions.returnBookFailed(error.response?.data?.message || "Failed to return borrowed book"));
  }
};

export const resetBorrowSlice = () => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
};

export default borrowSlice.reducer;
