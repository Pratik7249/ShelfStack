import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    borrowedBooks: [],
    loading: false,
    error: null,
    message: null,
  },
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

// ✅ Role-based book fetching
export const fetchBorrowedBooks = (role) => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowedBooksRequest());
  
  let url =
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

// ✅ Ensure this function is defined
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


// ✅ Ensure this function is defined
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchBorrowedBooksRequest());

  try {
    const res = await axios.get("http://localhost:5000/api/v1/borrow/borrowed-books-by-users", {
      withCredentials: true,
    });

    console.log("Fetched Borrowed Books:", res.data); // Debugging
    dispatch(borrowSlice.actions.fetchBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (error) {
    console.error("Error Fetching Books:", error.response?.data || error.message);
    dispatch(
      borrowSlice.actions.fetchBorrowedBooksFailed(
        error.response?.data?.message || "Failed to fetch borrowed books"
      )
    );
  }
};


// ✅ Record a borrowed book
export const recordBorrowedBook = (email, id) => async (dispatch) => {
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

// ✅ Return a borrowed book
export const returnBorrowedBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await axios.put(
      `http://localhost:5000/api/v1/borrow/return-borrowed-book/${id}`,
      { email },
      { withCredentials: true }
    );
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  } catch (error) {
    dispatch(
      borrowSlice.actions.returnBookFailed(
        error.response?.data?.message || "Failed to return borrowed book"
      )
    );
  }
};

export const resetBorrowSlice = () => async (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};
export default borrowSlice.reducer;
