// const mongoose = require("mongoose"); // Erase if already required

// // Declare the Schema of the Mongo model
// var blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   numViews: {
//     type: Number,
//     default: 0,
//   },
//   isLiked: {
//     type: Boolean,
//     default: false,
//   },
//   isDisliked: {
//     type: Boolean,
//     default: false,
//   },
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   image: {
//     type: String,
//     default:
//       "https://plus.unsplash.com/premium_photo-1666299355977-5b45612c03b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
//   },
//   author: {
//     type: String,
//     default: "Admin",
//   },{toJSON:{virtuals:true},
// toObject:{virtuals:true}},
// });

// //Export the model
// module.exports = mongoose.model("Blog", blogSchema);

const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1666299355977-5b45612c03b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
    author: {
      type: String,
      default: "Admin",
    },
    images: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Blog", blogSchema);
