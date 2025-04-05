import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";

// Initial state
const initialState = {
  borrowedBooks: [],
  loading: false,
  error: null,
  message: null,
};

// Create slice
const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    fetchBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBorrowedBooksSuccess(state, action) {
      state.borrowedBooks = action.payload;
      state.loading = false;
    },
    fetchBorrowedBooksFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.message = action.payload;
      state.loading = false;
    },
    recordBookFailed(state, action) {
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
    },

    resetBorrowSlice(state) {
      state.borrowedBooks = [];
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// Thunk: Fetch borrowed books based on role
export const fetchBorrowedBooks = (role) => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowedBooksRequest());

  const url =
    role === "admin"
      ? "http://localhost:5000/api/v1/borrow/borrowed-books-by-users"
      : "http://localhost:5000/api/v1/borrow/my-borrowed-books";

  try {
    const res = await axios.get(url, { withCredentials: true });
    dispatch(borrowSlice.actions.fetchBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (error) {
    dispatch(
      borrowSlice.actions.fetchBorrowedBooksFailed(
        error.response?.data?.message || "Failed to fetch borrowed books"
      )
    );
  }
};

// Thunk: Fetch only logged-in user's borrowed books
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowedBooksRequest());

  try {
    const res = await axios.get("http://localhost:5000/api/v1/borrow/my-borrowed-books", {
      withCredentials: true,
    });
    dispatch(borrowSlice.actions.fetchBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (error) {
    dispatch(
      borrowSlice.actions.fetchBorrowedBooksFailed(
        error.response?.data?.message || "Failed to fetch borrowed books"
      )
    );
  }
};

// Thunk: Fetch all borrowed books (admin only)
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowedBooksRequest());

  try {
    const res = await axios.get("http://localhost:5000/api/v1/borrow/borrowed-books-by-users", {
      withCredentials: true,
    });
    dispatch(borrowSlice.actions.fetchBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (error) {
    dispatch(
      borrowSlice.actions.fetchBorrowedBooksFailed(
        error.response?.data?.message || "Failed to fetch borrowed books"
      )
    );
  }
};

// Thunk: Record a borrowed book
export const recordBorrowedBook = ({ email, id }) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await axios.post(
      `http://localhost:5000/api/v1/borrow/record-borrow-book/${id}`,
      { email },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    dispatch(toggleRecordBookPopup());
  } catch (error) {
    dispatch(
      borrowSlice.actions.recordBookFailed(
        error.response?.data?.message || "Failed to record borrowed book"
      )
    );
  }
};

// ✅ Thunk: Return a borrowed book (fixed)
export const returnBorrowedBook = createAsyncThunk(
  "borrow/returnBorrowedBook",
  async ({ bookId, email }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/borrow/return-borrowed-book/${bookId}`,
        { email },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to return book"
      );
    }
  }
);

// Action: Reset slice state
export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

// Export reducer
export default borrowSlice.reducer;
