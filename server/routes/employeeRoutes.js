const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/",employeeController.getAllAdminAndItinerant);
router.post("/add",employeeController.registerAdmin);
router.post("/deactivate",employeeController.deactivateEmployee);
router.post("/activate",employeeController.reactivateEmployee);

module.exports = router;