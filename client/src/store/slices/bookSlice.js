import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice"; // ✅ Import to close popup after adding

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
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.books.push(action.payload);
      state.message = "Book added successfully!";
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.books = state.books.map(book =>
        book._id === action.payload._id ? action.payload : book
      );
      state.message = "Book returned successfully!";
    },
    returnBookFailed(state, action) {
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

// ✅ Fetch all books from API
export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());

  try {
    const res = await axios.get("http://localhost:5000/api/v1/book/all", {
      withCredentials: true,
    });

    dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
  } catch (err) {
    dispatch(
      bookSlice.actions.fetchBooksFailed(err.response?.data?.message || "Failed to fetch books")
    );
  }
};

// ✅ Add a book
export const addBook = (book) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());


  try {
    const res = await axios.post("http://localhost:5000/api/v1/book/admin/add", book, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });


    dispatch(bookSlice.actions.addBookSuccess(res.data.book));
    dispatch(fetchAllBooks()); // ✅ Refresh book list after adding
    dispatch(toggleAddBookPopup()); // ✅ Close popup after success
  } catch (err) {
    console.error("Error Adding Book:", err.response?.data); // 🛠️ Debugging - log error
    dispatch(
      bookSlice.actions.addBookFailed(err.response?.data?.message || "Failed to add book")
    );
  }
};

// ✅ Return a book
export const returnBook = (bookId) => async (dispatch) => {
  dispatch(bookSlice.actions.returnBookRequest());

  try {
    const res = await axios.put(`http://localhost:5000/api/v1/book/return/${bookId}`, {}, {
      withCredentials: true,
    });

    dispatch(bookSlice.actions.returnBookSuccess(res.data.book));
    dispatch(fetchAllBooks()); // ✅ Refresh book list after returning
  } catch (err) {
    dispatch(
      bookSlice.actions.returnBookFailed(err.response?.data?.message || "Failed to return book")
    );
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;
