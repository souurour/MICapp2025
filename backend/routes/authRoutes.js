const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  adminRegister,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.post("/admin-register", protect, authorize("admin"), adminRegister);

module.exports = router;
