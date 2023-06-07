const express = require("express");
const router = express.Router();
const accountSettingsController = require("../controllers/accountSettingsController");


router.post("/general_info",accountSettingsController.changeGeneral);
router.post("/change_profile_photo",accountSettingsController.changeProfilePhotoOnly);
router.post("/change_password",accountSettingsController.changePassword);
router.post("/info",accountSettingsController.changeInfo);
module.exports = router;