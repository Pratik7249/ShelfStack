import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    error: null,
    loading: false,
    message: null,
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload; // ✅ Stores books correctly
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.books.push(action.payload); // ✅ Corrected issue
      state.message = "Book added successfully!";
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const res = await axios.get("http://localhost:5000/api/v1/book/all", { withCredentials: true });
    dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books)); // ✅ Corrected API response handling
  } catch (err) {
    dispatch(bookSlice.actions.fetchBooksFailed(err.response?.data?.message || "Failed to fetch books"));
  }
};

export const addBook = (book) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const res = await axios.post(
      "http://localhost:5000/api/v1/book/admin/add",
      book,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(bookSlice.actions.addBookSuccess(res.data.book)); // ✅ Ensures the book is properly stored
  } catch (err) {
    dispatch(bookSlice.actions.addBookFailed(err.response?.data?.message || "Failed to add book"));
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
}

export default bookSlice.reducer;
