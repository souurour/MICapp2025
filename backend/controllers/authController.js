const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Only allow admin registration if explicitly provided and user is an admin
  let userRole = "user";

  // Allow technician registration but not admin (admin can only be created by another admin)
  if (role === "technician") {
    userRole = "technician";
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  if (user) {
    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Admin register (create any type of user)
// @route   POST /api/auth/admin-register
// @access  Private/Admin
const adminRegister = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, contactNumber, isActive } =
    req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user with all provided fields
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
    department,
    contactNumber,
    isActive: isActive !== undefined ? isActive : true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      contactNumber: user.contactNumber,
      isActive: user.isActive,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error(
      "Your account has been deactivated. Please contact an administrator.",
    );
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    contactNumber: user.contactNumber,
    isActive: user.isActive,
    token,
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    contactNumber: user.contactNumber,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, password, contactNumber, department } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields
  user.name = name || user.name;
  user.contactNumber = contactNumber || user.contactNumber;
  user.department = department || user.department;

  // Update password if provided
  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    department: updatedUser.department,
    contactNumber: updatedUser.contactNumber,
    isActive: updatedUser.isActive,
  });
});

module.exports = {
  register,
  adminRegister,
  login,
  getMe,
  updateProfile,
};
