/**
 * AI Analysis Engine — Multi-Platform
 * Combines data from all platforms and generates insights
 */

const generateCombinedScore = (platforms) => {
  let score = 0;
  const cf = platforms.codeforces;
  const lc = platforms.leetcode;
  const gfg = platforms.gfg;
  const cc = platforms.codechef;
  const ac = platforms.atcoder;

  if (cf?.isConnected) score += Math.min((cf.rating / 3500) * 400, 400);
  if (lc?.isConnected) score += Math.min((lc.totalSolved / 3000) * 300, 300);
  if (gfg?.isConnected) score += Math.min((gfg.totalSolved / 500) * 150, 150);
  if (cc?.isConnected) score += Math.min((cc.rating / 3000) * 100, 100);
  if (ac?.isConnected) score += Math.min((ac.rating / 3000) * 50, 50);

  return Math.round(score);
};

const generateInsights = (platformsData) => {
  const connected = Object.entries(platformsData)
    .filter(([, v]) => v && v.isConnected)
    .map(([k, v]) => ({ platform: k, ...v }));

  if (!connected.length) return null;

  const totalSolved = connected.reduce((s, p) => s + (p.totalSolved || 0), 0);
  const totalContests = connected.reduce((s, p) => s + (p.totalContests || 0), 0);

  const allTopics = connected.flatMap(p =>
    (p.topicStats || []).filter(t => t.rate < 50 && t.total >= 3)
  );
  const weakTopics = [...new Set(allTopics.map(t => t.topic))].slice(0, 4);

  const strongTopics = connected.flatMap(p =>
    (p.topicStats || []).filter(t => t.rate >= 70 && t.solved >= 5).map(t => t.topic)
  ).slice(0, 4);

  const studyPlan = [];
  if (weakTopics.length) studyPlan.push(`🎯 Focus on: ${weakTopics.slice(0, 2).join(", ")}`);
  studyPlan.push(`📊 Solve ${Math.max(5, 20 - connected.length * 2)} problems daily`);
  studyPlan.push(`🏆 Participate in ${Math.max(2, 4 - totalContests)} contests this month`);
  if (!platformsData.leetcode?.isConnected) studyPlan.push("➕ Add LeetCode to boost interview prep");
  if (!platformsData.codeforces?.isConnected) studyPlan.push("➕ Add Codeforces for algorithmic training");
  studyPlan.push("📚 Review editorial of all wrong solutions");

  const strengths = [];
  if (strongTopics.length) strengths.push(`Strong in ${strongTopics.slice(0, 2).join(", ")}`);
  if (totalContests > 10) strengths.push("Consistent contest participation");
  if (totalSolved > 200) strengths.push(`Impressive ${totalSolved} problems solved overall`);
  if (connected.length >= 3) strengths.push("Active across multiple platforms");

  const improvements = [];
  if (weakTopics.length) improvements.push(`Improve ${weakTopics[0]} — practice 10+ problems`);
  if (totalContests < 5) improvements.push("Participate in more live contests");
  if (connected.length < 3) improvements.push("Connect more platforms for better analysis");

  const summary = `You have solved ${totalSolved} problems across ${connected.length} platform${connected.length > 1 ? "s" : ""} and participated in ${totalContests} contests. ` +
    (strengths.length ? `Key strengths: ${strengths[0]}. ` : "") +
    (weakTopics.length ? `Focus areas: ${weakTopics.slice(0, 2).join(", ")}.` : "Keep up the great work!");

  return { summary, studyPlan: studyPlan.slice(0, 5), strengths, improvements, generatedAt: new Date() };
};

module.exports = { generateCombinedScore, generateInsights };
