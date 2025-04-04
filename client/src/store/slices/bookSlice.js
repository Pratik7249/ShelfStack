import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice"; // ✅ Close popup after adding

// ✅ Fetch all books from API
export const fetchAllBooks = createAsyncThunk("book/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/v1/book/all", {
      withCredentials: true,
    });

    if (!data?.books) throw new Error("Invalid response from server");
    return data.books; // ✅ Return books data
  } catch (err) {
    console.error("Error Fetching Books:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.message || "Failed to fetch books");
  }
});

// ✅ Add a book
export const addBook = createAsyncThunk("book/add", async (book, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/book/admin/add",
      book,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(fetchAllBooks()); // ✅ Refresh book list after adding
    dispatch(toggleAddBookPopup()); // ✅ Close popup after success
    return data.book; // ✅ Return added book
  } catch (err) {
    console.error("❌ Error Adding Book:", err.response?.data || err.message);
    return rejectWithValue(err.response?.data?.message || "Failed to add book");
  }
});

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    error: null,
    loading: false,
    message: null,
  },
  reducers: {
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Books
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ Add Book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
        state.message = "Book added successfully!";
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Reset slice
export const { resetBookSlice } = bookSlice.actions;
export default bookSlice.reducer;
