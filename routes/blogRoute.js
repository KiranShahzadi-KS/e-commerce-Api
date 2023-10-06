const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controllers/blogController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, createBlog);

router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("image", 2),
  blogImgResize,
  uploadImages
);

router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);

router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
