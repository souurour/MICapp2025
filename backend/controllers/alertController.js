const asyncHandler = require("express-async-handler");
const Alert = require("../models/alertModel");
const Machine = require("../models/machineModel");

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Filtering
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }
  if (req.query.machineId) {
    filter.machineId = req.query.machineId;
  }
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Role-based filtering
  if (req.user.role === "technician") {
    // Technicians see assigned alerts or open alerts
    filter.$or = [{ assignedTo: req.user._id }, { status: "open" }];
  } else if (req.user.role === "user") {
    // Regular users only see alerts they created
    filter.createdBy = req.user._id;
  }
  // Admins see all alerts (no filter)

  // Get alerts
  const alerts = await Alert.find(filter)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate("machineId", "name location")
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .populate("resolvedBy", "name");

  // Get total count for pagination
  const total = await Alert.countDocuments(filter);

  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };

  res.json({
    alerts,
    pagination,
  });
});

// @desc    Get alert by ID
// @route   GET /api/alerts/:id
// @access  Private
const getAlertById = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
    .populate("machineId", "name model location status")
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .populate("resolvedBy", "name");

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  // Check authorization (only creator, assigned tech, or admin can view details)
  const isCreator = alert.createdBy._id.toString() === req.user._id.toString();
  const isAssigned =
    alert.assignedTo &&
    alert.assignedTo._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  const isTechnician = req.user.role === "technician";

  if (!isCreator && !isAssigned && !isAdmin && !isTechnician) {
    res.status(403);
    throw new Error("Not authorized to view this alert");
  }

  res.json(alert);
});

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private
const createAlert = asyncHandler(async (req, res) => {
  const { title, description, machineId, priority, photos } = req.body;

  // Verify machine exists
  const machine = await Machine.findById(machineId);
  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  // Create alert
  const alert = await Alert.create({
    title,
    description,
    machineId,
    priority: priority || "medium",
    status: "open",
    createdBy: req.user._id,
    photos: photos || [],
  });

  if (alert) {
    // If machine status is operational, change it to error for critical alerts
    if (priority === "critical" && machine.status === "operational") {
      machine.status = "error";
      await machine.save();
    }

    // Populate referenced fields for response
    const populatedAlert = await Alert.findById(alert._id)
      .populate("machineId", "name location")
      .populate("createdBy", "name");

    res.status(201).json(populatedAlert);
  } else {
    res.status(400);
    throw new Error("Invalid alert data");
  }
});

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private
const updateAlert = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignedTo } = req.body;

  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  // Check authorization
  const isAdmin = req.user.role === "admin";
  const isTechnician = req.user.role === "technician";
  const isCreator = alert.createdBy.toString() === req.user._id.toString();
  const isAssigned =
    alert.assignedTo && alert.assignedTo.toString() === req.user._id.toString();

  // Only admins, technicians, creators or assigned users can update
  if (!isAdmin && !isTechnician && !isCreator && !isAssigned) {
    res.status(403);
    throw new Error("Not authorized to update this alert");
  }

  // Update fields
  alert.title = title || alert.title;
  alert.description =
    description !== undefined ? description : alert.description;
  alert.priority = priority || alert.priority;

  // Status updates with additional logic
  if (status && status !== alert.status) {
    alert.status = status;

    // If resolving
    if (status === "resolved") {
      alert.resolvedAt = new Date();
      alert.resolvedBy = req.user._id;

      // Update machine status if needed
      const machine = await Machine.findById(alert.machineId);
      if (machine && machine.status === "error") {
        // Check if this was the last open critical alert for this machine
        const otherAlerts = await Alert.countDocuments({
          machineId: alert.machineId,
          status: { $nin: ["resolved", "closed"] },
          priority: "critical",
          _id: { $ne: alert._id },
        });

        if (otherAlerts === 0) {
          machine.status = "operational";
          await machine.save();
        }
      }
    }

    // If assigning
    if (status === "assigned" && assignedTo) {
      alert.assignedTo = assignedTo;
    }
  }

  // Explicit assignedTo assignment
  if (
    assignedTo &&
    (!alert.assignedTo || assignedTo !== alert.assignedTo.toString())
  ) {
    alert.assignedTo = assignedTo;
    if (alert.status === "open") {
      alert.status = "assigned";
    }
  }

  const updatedAlert = await alert.save();

  // Populate referenced fields for response
  const populatedAlert = await Alert.findById(updatedAlert._id)
    .populate("machineId", "name location")
    .populate("createdBy", "name")
    .populate("assignedTo", "name")
    .populate("resolvedBy", "name");

  res.json(populatedAlert);
});

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private/Admin
const deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  // Only admins can delete alerts
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete alerts");
  }

  await alert.deleteOne();

  res.json({ message: "Alert removed" });
});

// @desc    Assign alert to self
// @route   PUT /api/alerts/:id/assign
// @access  Private/Technician,Admin
const assignToSelf = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  // Only technicians and admins can self-assign
  if (req.user.role !== "technician" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to assign alerts");
  }

  // Update alert
  alert.assignedTo = req.user._id;
  alert.status = "assigned";

  const updatedAlert = await alert.save();

  // Populate referenced fields for response
  const populatedAlert = await Alert.findById(updatedAlert._id)
    .populate("machineId", "name location")
    .populate("createdBy", "name")
    .populate("assignedTo", "name");

  res.json(populatedAlert);
});

module.exports = {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  assignToSelf,
};
