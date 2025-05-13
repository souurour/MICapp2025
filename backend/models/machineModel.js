const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a machine name"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Please add a model number"],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, "Please add a serial number"],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["operational", "maintenance", "error", "offline"],
      default: "operational",
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    lastMaintenance: {
      type: Date,
      default: Date.now,
    },
    nextScheduledMaintenance: {
      type: Date,
    },
    maintenanceInterval: {
      type: Number, // Days
      default: 90,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    metrics: {
      performance: {
        type: Number,
        default: 100,
      },
      availability: {
        type: Number,
        default: 100,
      },
      quality: {
        type: Number,
        default: 100,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("Machine", machineSchema);
