const express = require("express");
const router = express.Router();
const { getLeaderboard, compareUsers } = require("../controllers/leaderboardController");

router.get("/", getLeaderboard);
router.get("/compare/:user1/:user2", compareUsers);

module.exports = router;
