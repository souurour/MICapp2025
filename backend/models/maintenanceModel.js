const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: [true, "Please select a machine"],
    },
    maintenanceType: {
      type: String,
      enum: ["preventive", "corrective", "predictive", "routine"],
      default: "preventive",
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, "Please specify a scheduled date"],
    },
    completedDate: {
      type: Date,
    },
    estimatedDuration: {
      type: Number, // Hours
      required: [true, "Please specify estimated duration"],
    },
    actualDuration: {
      type: Number, // Hours
    },
    requiredParts: [String],
    assignedTechnicians: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
    notifyUsers: {
      type: Boolean,
      default: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Enable virtuals
    toObject: { virtuals: true },
  },
);

// Virtual for getting machine name
maintenanceSchema.virtual("machineName", {
  ref: "Machine",
  localField: "machineId",
  foreignField: "_id",
  justOne: true,
  options: { select: "name" },
});

// Create compound index for faster queries
maintenanceSchema.index({ status: 1, scheduledDate: 1, machineId: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
