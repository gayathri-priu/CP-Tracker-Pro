const User = require("../models/User");
const { fetchCodeforces, fetchLeetCode, fetchGFG, fetchCodeChef, fetchHackerRank, fetchAtCoder } = require("../services/platformAPIs");
const { generateCombinedScore, generateInsights } = require("../services/analyzer");

const platformFetchers = {
  codeforces: fetchCodeforces,
  leetcode:   fetchLeetCode,
  gfg:        fetchGFG,
  codechef:   fetchCodeChef,
  hackerrank: fetchHackerRank,
  atcoder:    fetchAtCoder,
};

// POST /api/platforms/connect  { platform, handle }
exports.connectPlatform = async (req, res, next) => {
  try {
    const { platform, handle } = req.body;
    if (!platformFetchers[platform]) {
      return res.status(400).json({ success: false, error: "Unknown platform" });
    }

    const data = await platformFetchers[platform](handle);

    const update = {
      [`platforms.${platform}`]: {
        handle: data.handle || handle,
        rating: data.rating,
        maxRating: data.maxRating,
        rank: data.rank,
        totalSolved: data.totalSolved,
        totalContests: data.totalContests,
        acceptanceRate: data.acceptanceRate,
        avatar: data.avatar,
        isConnected: true,
        lastFetched: new Date(),
      },
    };

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });

    // Recalculate combined score
    const score = generateCombinedScore(user.platforms);
    const totalSolvedAll = Object.values(user.platforms).reduce((s, p) => s + (p?.totalSolved || 0), 0);
    const insights = generateInsights(user.platforms);

    await User.findByIdAndUpdate(req.user._id, {
      combinedScore: score,
      totalSolvedAll,
      aiInsights: insights,
      lastAnalyzed: new Date(),
    });

    res.status(200).json({ success: true, data, message: `${platform} connected!` });
  } catch (err) { next(err); }
};

// GET /api/platforms/:platform/:handle  (public)
exports.getPublicProfile = async (req, res, next) => {
  try {
    const { platform, handle } = req.params;
    if (!platformFetchers[platform]) {
      return res.status(400).json({ success: false, error: "Unknown platform" });
    }
    const data = await platformFetchers[platform](handle);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/platforms/dashboard  (auth)
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// POST /api/platforms/refresh-all  (auth)
exports.refreshAll = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const connected = Object.entries(user.platforms)
      .filter(([, v]) => v?.isConnected && v?.handle)
      .map(([platform, v]) => ({ platform, handle: v.handle }));

    const results = await Promise.allSettled(
      connected.map(({ platform, handle }) => platformFetchers[platform](handle))
    );

    const updateObj = {};
    connected.forEach(({ platform }, i) => {
      if (results[i].status === "fulfilled") {
        const d = results[i].value;
        updateObj[`platforms.${platform}`] = {
          ...d, isConnected: true, lastFetched: new Date(),
        };
      }
    });

    const updated = await User.findByIdAndUpdate(req.user._id, updateObj, { new: true });
    const score = generateCombinedScore(updated.platforms);
    const insights = generateInsights(updated.platforms);
    await User.findByIdAndUpdate(req.user._id, { combinedScore: score, aiInsights: insights, lastAnalyzed: new Date() });

    res.status(200).json({ success: true, message: "All platforms refreshed" });
  } catch (err) { next(err); }
};
