const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
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
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: [true, "Please select a machine"],
    },
    priority: {
      type: String,
      enum: ["critical", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "resolved", "closed"],
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
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photos: [String], // Array of photo URLs
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Enable virtuals
    toObject: { virtuals: true },
  },
);

// Virtual for getting machine name
alertSchema.virtual("machineName", {
  ref: "Machine",
  localField: "machineId",
  foreignField: "_id",
  justOne: true,
  options: { select: "name" },
});

// Create compound index for faster queries
alertSchema.index({ status: 1, priority: 1, machineId: 1 });

module.exports = mongoose.model("Alert", alertSchema);
