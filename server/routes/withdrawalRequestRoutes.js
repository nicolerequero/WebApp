const express = require("express");
const router = express.Router();
const withdrawalRequestController = require("../controllers/withdrawalRequestController");


router.get("/",withdrawalRequestController.getAllWithdrawalRequests);
router.post("/approve",withdrawalRequestController.approveWithdrawalRequest);
router.post("/discard",withdrawalRequestController.discardWithdrawalRequest);
module.exports = router;