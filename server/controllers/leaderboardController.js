const User = require("../models/User");

// GET /api/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find({ combinedScore: { $gt: 0 } })
      .sort({ combinedScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("name combinedScore totalSolvedAll platforms.codeforces.rating platforms.leetcode.totalSolved lastAnalyzed");

    const total = await User.countDocuments({ combinedScore: { $gt: 0 } });

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
};

// GET /api/compare/:user1/:user2
exports.compareUsers = async (req, res, next) => {
  try {
    const { user1, user2 } = req.params;
    const [u1, u2] = await Promise.all([
      User.findOne({ $or: [{ name: user1 }, { email: user1 }] }),
      User.findOne({ $or: [{ name: user2 }, { email: user2 }] }),
    ]);
    if (!u1 || !u2) return res.status(404).json({ success: false, error: "One or both users not found" });
    res.status(200).json({ success: true, data: { user1: u1, user2: u2 } });
  } catch (err) { next(err); }
};
