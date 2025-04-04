import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  fine: {
    type: Number,
    default: 0,
  }
},
  {
    timestamps: true,
  }
);

export const Borrow = mongoose.model("Borrow", borrowSchema);