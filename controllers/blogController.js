const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Blog = require("../models/Blog");
const validateMongoDbId = require("../utils/validateMongodbid");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

//BLOG CREATE
exports.createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//UPDATE BLOG
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//GET A BLOG
exports.getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//GET ALL BLOG
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//DELETE BLOG
exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully", deletedBlog });
  } catch (error) {
    throw new Error(error);
  }
});

// //LIKE BLOG
// exports.likeBlog = asyncHandler(async (req, res) => {
//   const { blogId } = req.body;
//   validateMongoDbId(blogId);

//   //Fine the blog which you want to be liked
//   const blog = await Blog.findById(blogId);
//   //Find the login user
//   const loginUserId = req?.user?._id;
//   //Find if the user has liked the blog
//   const isLiked = blog?.isLiked;
//   //Find if the user has disliked the blog
//   const alreadyDisliked = blog?.dislikes?.find(
//     (userId) => userId?.toString() === loginUserId?.toString()
//   );
//   if (alreadyDisliked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       { $pull: { dislikes: loginUserId }, isDisliked: false },
//       { new: true }
//     );
//     res.json(blog);
//   }
//   if (isLiked) {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       { $pull: { likes: loginUserId }, isLiked: false },
//       { new: true }
//     );
//     res.json(blog);
//   } else {
//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       { $push: { likes: loginUserId }, isLiked: true },
//       { new: true }
//     );
//     res.json(blog);
//   }
// });

// LIKE BLOG
exports.likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // validateMongoDbId(blogId);

  // You should validate the MongoDB ID here if necessary.
  // If validateMongoDbId is a function, make sure it's properly defined and used here.

  try {
    // Find the blog you want to like
    const blog = await Blog.findById(blogId);

    // Find the logged-in user's ID
    const loginUserId = req?.user?._id;

    // Check if the user has already disliked the blog
    const alreadyDisliked = blog?.dislikes?.includes(loginUserId);

    if (alreadyDisliked) {
      // If the user has already disliked, remove the dislike and set isDisliked to false
      await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: loginUserId }, isDisliked: false },
        { new: true }
      );
    } else {
      // Check if the user has already liked the blog
      const isLiked = blog?.likes?.includes(loginUserId);

      if (isLiked) {
        // If the user has already liked, remove the like and set isLiked to false
        await Blog.findByIdAndUpdate(
          blogId,
          { $pull: { likes: loginUserId }, isLiked: false },
          { new: true }
        );
      } else {
        // If the user hasn't liked the blog, add the like and set isLiked to true
        await Blog.findByIdAndUpdate(
          blogId,
          { $push: { likes: loginUserId }, isLiked: true },
          { new: true }
        );
      }
    }

    // Fetch the updated blog
    const updatedBlog = await Blog.findById(blogId);
    res.json(updatedBlog);
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: "An error occurred" });
  }
});

// DISLIKE BLOG
exports.dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  //   validateMongoDbId(blogId);

  //Fine the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  //Find the login user
  const loginUserId = req?.user?._id;
  //Find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  //Find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { likes: loginUserId }, isLiked: false },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $pull: { dislikes: loginUserId }, isDisliked: false },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { dislikes: loginUserId }, isDisliked: true },
      { new: true }
    );
    res.json(blog);
  }
});

exports.uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file; // Use file.path instead of files.path
      const newPath = await uploader(path);
      console.log(newPath);
      urls.push(newPath);
      console.log(file);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
