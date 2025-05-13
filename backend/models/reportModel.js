const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    config: {
      type: {
        type: String,
        enum: ["performance", "maintenance", "alerts", "prediction"],
        required: [true, "Please specify report type"],
      },
      startDate: {
        type: Date,
        required: [true, "Please specify start date"],
      },
      endDate: {
        type: Date,
        required: [true, "Please specify end date"],
      },
      machineIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Machine",
        },
      ],
      includeCharts: {
        type: Boolean,
        default: true,
      },
      format: {
        type: String,
        enum: ["pdf", "excel", "csv"],
        default: "pdf",
      },
      parameters: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
    },
    fileSize: {
      type: Number, // In bytes
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("Report", reportSchema);
