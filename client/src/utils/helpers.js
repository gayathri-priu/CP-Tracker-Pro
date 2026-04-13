export const PLATFORMS = {
  codeforces: { name: "Codeforces",  color: "#e8400c", bg: "#fff5f2", icon: "CF", url: "https://codeforces.com/profile/" },
  leetcode:   { name: "LeetCode",    color: "#ffa116", bg: "#fffbeb", icon: "LC", url: "https://leetcode.com/" },
  gfg:        { name: "GeeksForGeeks", color: "#2f8d46", bg: "#f0fdf4", icon: "GFG", url: "https://auth.geeksforgeeks.org/user/" },
  codechef:   { name: "CodeChef",    color: "#5b4638", bg: "#fdf8f6", icon: "CC", url: "https://www.codechef.com/users/" },
  hackerrank: { name: "HackerRank",  color: "#00c84b", bg: "#f0fdf4", icon: "HR", url: "https://www.hackerrank.com/" },
  atcoder:    { name: "AtCoder",     color: "#006ebf", bg: "#eff6ff", icon: "AC", url: "https://atcoder.jp/users/" },
};

export const formatNum = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export const timeAgo = (date) => {
  if (!date) return "—";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

export const getRatingColor = (rating, platform = "codeforces") => {
  if (platform === "codeforces" || platform === "atcoder") {
    if (!rating) return "#94a3b8";
    if (rating < 1200) return "#64748b";
    if (rating < 1400) return "#16a34a";
    if (rating < 1600) return "#0891b2";
    if (rating < 1900) return "#2563eb";
    if (rating < 2100) return "#7c3aed";
    if (rating < 2400) return "#d97706";
    return "#dc2626";
  }
  return "#2563eb";
};

export const getScoreBadge = (score) => {
  if (score >= 800) return { label: "Elite",       color: "#dc2626" };
  if (score >= 600) return { label: "Expert",      color: "#d97706" };
  if (score >= 400) return { label: "Advanced",    color: "#7c3aed" };
  if (score >= 200) return { label: "Intermediate",color: "#2563eb" };
  return               { label: "Beginner",    color: "#16a34a" };
};
