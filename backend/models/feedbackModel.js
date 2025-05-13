const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["suggestion", "issue", "praise", "other"],
      default: "suggestion",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "implemented", "declined", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    response: {
      type: String,
      trim: true,
    },
    attachments: [String], // Array of attachment URLs
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
