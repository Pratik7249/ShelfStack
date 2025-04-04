import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure price is non-negative
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Ensure quantity is non-negative
    },
    availability: {
      type: Boolean,
      default: function () {
        return this.quantity > 0; // Automatically set availability based on quantity
      },
    },
    category: {
      type: String,
      enum: ["Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Other"], // Example categories
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);
