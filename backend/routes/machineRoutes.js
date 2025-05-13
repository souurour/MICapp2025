const express = require("express");
const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  updateMachineStatus,
  updateMachineMetrics,
} = require("../controllers/machineController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible to all authenticated users
router.get("/", getMachines);
router.get("/:id", getMachineById);

// Routes for admin and technician only
router.post("/", authorize("admin", "technician"), createMachine);
router.put("/:id", authorize("admin", "technician"), updateMachine);
router.put(
  "/:id/status",
  authorize("admin", "technician"),
  updateMachineStatus,
);
router.put(
  "/:id/metrics",
  authorize("admin", "technician"),
  updateMachineMetrics,
);

// Routes for admin only
router.delete("/:id", authorize("admin"), deleteMachine);

module.exports = router;
