const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const platformProfileSchema = new mongoose.Schema({
  handle: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  rank: { type: String, default: "unrated" },
  totalSolved: { type: Number, default: 0 },
  totalContests: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
  lastFetched: { type: Date },
  isConnected: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },

    platforms: {
      codeforces:  { type: platformProfileSchema, default: () => ({}) },
      leetcode:    { type: platformProfileSchema, default: () => ({}) },
      gfg:         { type: platformProfileSchema, default: () => ({}) },
      codechef:    { type: platformProfileSchema, default: () => ({}) },
      hackerrank:  { type: platformProfileSchema, default: () => ({}) },
      atcoder:     { type: platformProfileSchema, default: () => ({}) },
    },

    combinedScore: { type: Number, default: 0 },
    totalSolvedAll: { type: Number, default: 0 },
    aiInsights: {
      summary: String,
      studyPlan: [String],
      strengths: [String],
      improvements: [String],
      generatedAt: Date,
    },

    lastAnalyzed: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
