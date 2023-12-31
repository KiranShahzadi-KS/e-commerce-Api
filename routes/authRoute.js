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
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/cart", userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

// router.get("getusers", getalluser); //
router.get("/getusers", getAllUsers);
router.delete("/:id", deleteUser);

router.get("/get-order", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getauser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/edit-user", authMiddleware, updatedUser);
router.post("/save-address", authMiddleware, saveAddress);

router.post("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.post("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
