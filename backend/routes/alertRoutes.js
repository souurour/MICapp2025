const express = require("express");
const {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
  assignToSelf,
} = require("../controllers/alertController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible to all authenticated users
router.get("/", getAlerts);
router.get("/:id", getAlertById);
router.post("/", createAlert);

// Routes for admin/technician
router.put("/:id", updateAlert);
router.put("/:id/assign", authorize("admin", "technician"), assignToSelf);

// Routes for admin only
router.delete("/:id", authorize("admin"), deleteAlert);

module.exports = router;
