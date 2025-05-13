const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const Machine = require("../models/machineModel");
const Alert = require("../models/alertModel");
const Maintenance = require("../models/maintenanceModel");

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Create admin user and sample data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Machine.deleteMany();
    await Alert.deleteMany();
    await Maintenance.deleteMany();

    console.log("Data cleaned...");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
      department: "Management",
      contactNumber: "+1234567890",
      isActive: true,
    });

    // Create technician user
    const techUser = await User.create({
      name: "John Technician",
      email: "tech@example.com",
      password: "Tech123!",
      role: "technician",
      department: "Maintenance",
      contactNumber: "+1234567891",
      isActive: true,
    });

    // Create regular user
    const regularUser = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "User123!",
      role: "user",
      department: "Production",
      contactNumber: "+1234567892",
      isActive: true,
    });

    console.log("Users created...");

    // Create sample machines
    const machines = await Machine.insertMany([
      {
        name: "Laser Cutter A",
        model: "LC-2000",
        serialNumber: "LC2000-1234",
        location: "Hall A",
        status: "operational",
        description: "Main laser cutting machine for denim processing",
        installationDate: new Date("2021-01-15"),
        lastMaintenance: new Date("2023-07-10"),
        nextScheduledMaintenance: new Date("2023-10-10"),
        maintenanceInterval: 90,
        manufacturer: "LaserTech Industries",
        createdBy: adminUser._id,
        metrics: {
          performance: 95,
          availability: 98,
          quality: 99,
        },
      },
      {
        name: "Washing Machine B",
        model: "WM-3000",
        serialNumber: "WM3000-5678",
        location: "Hall B",
        status: "maintenance",
        description: "Industrial washing machine for denim treatment",
        installationDate: new Date("2021-05-20"),
        lastMaintenance: new Date("2023-08-05"),
        nextScheduledMaintenance: new Date("2023-11-05"),
        maintenanceInterval: 90,
        manufacturer: "WashTech Solutions",
        createdBy: adminUser._id,
        metrics: {
          performance: 88,
          availability: 85,
          quality: 92,
        },
      },
      {
        name: "Drying Unit C",
        model: "DU-1500",
        serialNumber: "DU1500-9012",
        location: "Hall A",
        status: "error",
        description: "High-capacity drying unit for processed denim",
        installationDate: new Date("2020-11-10"),
        lastMaintenance: new Date("2023-06-15"),
        nextScheduledMaintenance: new Date("2023-09-15"),
        maintenanceInterval: 90,
        manufacturer: "DryTech Corp",
        createdBy: adminUser._id,
        metrics: {
          performance: 65,
          availability: 60,
          quality: 90,
        },
      },
    ]);

    console.log("Machines created...");

    // Create sample alerts
    const alerts = await Alert.insertMany([
      {
        title: "Laser Cutter Temperature Warning",
        description:
          "Machine temperature exceeding normal operating range by 15°C.",
        machineId: machines[0]._id,
        priority: "medium",
        status: "open",
        createdBy: regularUser._id,
        createdAt: new Date("2023-09-28"),
      },
      {
        title: "Washing Machine B Vibration",
        description: "Unusual vibration detected during spin cycle.",
        machineId: machines[1]._id,
        priority: "low",
        status: "assigned",
        createdBy: regularUser._id,
        assignedTo: techUser._id,
        createdAt: new Date("2023-09-25"),
      },
      {
        title: "Drying Unit C Heating Element Failure",
        description: "Heating element not reaching target temperature.",
        machineId: machines[2]._id,
        priority: "critical",
        status: "in_progress",
        createdBy: regularUser._id,
        assignedTo: techUser._id,
        createdAt: new Date("2023-09-22"),
      },
    ]);

    console.log("Alerts created...");

    // Create sample maintenance records
    await Maintenance.insertMany([
      {
        title: "Quarterly Maintenance - Laser Cutter",
        machineId: machines[0]._id,
        maintenanceType: "preventive",
        description:
          "Regular quarterly maintenance including lens cleaning, alignment check, and calibration.",
        scheduledDate: new Date("2023-10-15"),
        estimatedDuration: 4,
        requiredParts: ["lens", "filter", "calibration-tools"],
        assignedTechnicians: [techUser._id],
        status: "scheduled",
        priority: "medium",
        createdBy: adminUser._id,
        createdAt: new Date("2023-09-20"),
      },
      {
        title: "Washing Machine Emergency Repair",
        machineId: machines[1]._id,
        maintenanceType: "corrective",
        description:
          "Fix unusual vibration detected during operation. Check motor mounts and bearings.",
        scheduledDate: new Date("2023-09-30"),
        estimatedDuration: 6,
        requiredParts: ["bearings", "motor-mounts"],
        assignedTechnicians: [techUser._id],
        status: "in_progress",
        priority: "high",
        createdBy: adminUser._id,
        createdAt: new Date("2023-09-26"),
      },
    ]);

    console.log("Maintenance records created...");

    console.log("Data import complete!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Machine.deleteMany();
    await Alert.deleteMany();
    await Maintenance.deleteMany();

    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run command: node seeder -i (import) or node seeder -d (destroy)
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
} else {
  console.log("Please use -i (import) or -d (destroy) flags");
  process.exit();
}
