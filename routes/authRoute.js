const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  //getalluser,
  getauser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUser);
// router.get("getusers", getalluser); //
router.get("/getusers", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getauser);
router.delete("/:id", deleteUser);
router.post("/edit-user", authMiddleware, updatedUser);
router.post("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.post("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
