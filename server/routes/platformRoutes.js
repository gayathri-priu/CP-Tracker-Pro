const express = require("express");
const router = express.Router();
const { connectPlatform, getPublicProfile, getDashboard, refreshAll } = require("../controllers/platformController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboard);
router.post("/connect", protect, connectPlatform);
router.post("/refresh-all", protect, refreshAll);
router.get("/:platform/:handle", getPublicProfile);

module.exports = router;
