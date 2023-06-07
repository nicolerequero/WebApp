const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");


router.get("/",customerController.getAllCustomers);
router.post("/deactivate",customerController.deactivateCustomer);
router.post("/activate",customerController.reactivateCustomer);


module.exports = router;