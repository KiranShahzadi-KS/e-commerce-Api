const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Lenovo", "Hp"],
    },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required: true,
    },
    ratings: [
      {
        star: Number,
        Comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: { type: String, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
