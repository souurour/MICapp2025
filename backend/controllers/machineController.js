const asyncHandler = require("express-async-handler");
const Machine = require("../models/machineModel");

// @desc    Get all machines
// @route   GET /api/machines
// @access  Private
const getMachines = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Filtering
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.location) {
    filter.location = req.query.location;
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { model: { $regex: req.query.search, $options: "i" } },
      { serialNumber: { $regex: req.query.search, $options: "i" } },
      { location: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Get machines
  const machines = await Machine.find(filter)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate("createdBy", "name");

  // Get total count for pagination
  const total = await Machine.countDocuments(filter);

  // Pagination result
  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };

  res.json({
    machines,
    pagination,
  });
});

// @desc    Get machine by ID
// @route   GET /api/machines/:id
// @access  Private
const getMachineById = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id).populate(
    "createdBy",
    "name",
  );

  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  res.json(machine);
});

// @desc    Create new machine
// @route   POST /api/machines
// @access  Private/Admin,Technician
const createMachine = asyncHandler(async (req, res) => {
  const {
    name,
    model,
    serialNumber,
    location,
    description,
    status,
    installationDate,
    manufacturer,
    maintenanceInterval,
    notes,
  } = req.body;

  // Check if machine with same serial number already exists
  const machineExists = await Machine.findOne({ serialNumber });
  if (machineExists) {
    res.status(400);
    throw new Error("Machine with this serial number already exists");
  }

  // Calculate next maintenance date
  const nextMaintenance = new Date();
  nextMaintenance.setDate(
    nextMaintenance.getDate() + (parseInt(maintenanceInterval) || 90),
  );

  // Create machine
  const machine = await Machine.create({
    name,
    model,
    serialNumber,
    location,
    description,
    status: status || "operational",
    installationDate: installationDate || Date.now(),
    lastMaintenance: Date.now(),
    nextScheduledMaintenance: nextMaintenance,
    maintenanceInterval: parseInt(maintenanceInterval) || 90,
    manufacturer,
    notes,
    createdBy: req.user._id,
    metrics: {
      performance: 100,
      availability: 100,
      quality: 100,
    },
  });

  if (machine) {
    res.status(201).json(machine);
  } else {
    res.status(400);
    throw new Error("Invalid machine data");
  }
});

// @desc    Update machine
// @route   PUT /api/machines/:id
// @access  Private/Admin,Technician
const updateMachine = asyncHandler(async (req, res) => {
  const {
    name,
    model,
    serialNumber,
    location,
    description,
    status,
    installationDate,
    manufacturer,
    maintenanceInterval,
    notes,
  } = req.body;

  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  // Check if updating to an existing serial number
  if (serialNumber && serialNumber !== machine.serialNumber) {
    const machineExists = await Machine.findOne({ serialNumber });
    if (machineExists) {
      res.status(400);
      throw new Error("Machine with this serial number already exists");
    }
  }

  // Update fields
  machine.name = name || machine.name;
  machine.model = model || machine.model;
  machine.serialNumber = serialNumber || machine.serialNumber;
  machine.location = location || machine.location;
  machine.description =
    description !== undefined ? description : machine.description;
  machine.status = status || machine.status;
  machine.installationDate = installationDate || machine.installationDate;
  machine.manufacturer =
    manufacturer !== undefined ? manufacturer : machine.manufacturer;
  machine.notes = notes !== undefined ? notes : machine.notes;

  // Update maintenance interval and next maintenance date if provided
  if (maintenanceInterval) {
    machine.maintenanceInterval = parseInt(maintenanceInterval);

    // Recalculate next maintenance date from last maintenance
    const nextMaintenance = new Date(machine.lastMaintenance);
    nextMaintenance.setDate(
      nextMaintenance.getDate() + parseInt(maintenanceInterval),
    );
    machine.nextScheduledMaintenance = nextMaintenance;
  }

  const updatedMachine = await machine.save();

  res.json(updatedMachine);
});

// @desc    Delete machine
// @route   DELETE /api/machines/:id
// @access  Private/Admin
const deleteMachine = asyncHandler(async (req, res) => {
  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  await machine.deleteOne();

  res.json({ message: "Machine removed" });
});

// @desc    Update machine status
// @route   PUT /api/machines/:id/status
// @access  Private/Admin,Technician
const updateMachineStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  machine.status = status;
  const updatedMachine = await machine.save();

  res.json({ status: updatedMachine.status });
});

// @desc    Update machine metrics
// @route   PUT /api/machines/:id/metrics
// @access  Private/Admin,Technician
const updateMachineMetrics = asyncHandler(async (req, res) => {
  const { performance, availability, quality } = req.body;

  const machine = await Machine.findById(req.params.id);

  if (!machine) {
    res.status(404);
    throw new Error("Machine not found");
  }

  // Update metrics
  if (performance !== undefined) {
    machine.metrics.performance = performance;
  }
  if (availability !== undefined) {
    machine.metrics.availability = availability;
  }
  if (quality !== undefined) {
    machine.metrics.quality = quality;
  }

  const updatedMachine = await machine.save();

  res.json(updatedMachine.metrics);
});

module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  updateMachineStatus,
  updateMachineMetrics,
};
