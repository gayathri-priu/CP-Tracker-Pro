import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDashboardAPI, refreshAllAPI } from "../services/api";
import { PLATFORMS, formatNum, getScoreBadge } from "../utils/helpers";
import PlatformCard from "../components/dashboard/PlatformCard";
import DashCharts   from "../components/dashboard/DashCharts";
import AIInsights   from "../components/dashboard/AIInsights";
import "./Dashboard.css";

function Dashboard() {
  const { user }  = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,   setError]   = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getDashboardAPI();
      setData(res.data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllAPI();
      await fetchDashboard();
    } catch (err) { setError(err.message); }
    finally { setRefreshing(false); }
  };

  if (loading) return (
    <div className="dash-loading">
      <span className="spinner spinner-lg" />
      <p>Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="dash-error">
      <p>⚠ {error}</p>
      <button className="btn btn-primary" onClick={fetchDashboard}>Retry</button>
    </div>
  );

  const platforms = data?.platforms || {};
  const connectedCount = Object.values(platforms).filter(p => p?.isConnected).length;
  const scoreBadge = getScoreBadge(data?.combinedScore || 0);

  return (
    <div className="dashboard page">
      {/* Top Bar */}
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="dash-sub">{connectedCount} of 6 platforms connected</p>
        </div>
        <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <><span className="spinner" /> Refreshing...</> : "↺ Refresh All"}
        </button>
      </div>

      {/* Combined Score Banner */}
      {data?.combinedScore > 0 && (
        <div className="score-banner card">
          <div className="score-left">
            <span className="score-val">{data.combinedScore}</span>
            <div>
              <div className="score-title">Combined CP Score</div>
              <span className="badge" style={{ background: `${scoreBadge.color}18`, color: scoreBadge.color }}>
                {scoreBadge.label}
              </span>
            </div>
          </div>
          <div className="score-stats">
            <div className="score-stat">
              <span className="score-stat-val">{formatNum(data.totalSolvedAll)}</span>
              <span className="score-stat-label">Total Solved</span>
            </div>
            <div className="score-stat">
              <span className="score-stat-val">{connectedCount}</span>
              <span className="score-stat-label">Platforms</span>
            </div>
            <div className="score-stat">
              <span className="score-stat-val">
                {Object.values(platforms).reduce((s, p) => s + (p?.totalContests || 0), 0)}
              </span>
              <span className="score-stat-label">Contests</span>
            </div>
          </div>
        </div>
      )}

      {/* Platforms Grid */}
      <section className="dash-section">
        <h2 className="dash-section-title">Your Platforms</h2>
        <div className="platforms-grid">
          {Object.keys(PLATFORMS).map((key) => (
            <PlatformCard
              key={key}
              platformKey={key}
              data={platforms[key]}
              onConnected={fetchDashboard}
            />
          ))}
        </div>
      </section>

      {/* Charts + AI row */}
      {connectedCount > 0 && (
        <div className="dash-analysis-row">
          <DashCharts platforms={platforms} />
          <AIInsights
            insights={data?.aiInsights}
            combinedScore={data?.combinedScore}
            totalSolvedAll={data?.totalSolvedAll}
          />
        </div>
      )}

      {/* Empty state */}
      {connectedCount === 0 && (
        <div className="dash-empty card">
          <span className="dash-empty-icon">🚀</span>
          <h3>Connect your first platform</h3>
          <p>Enter your handle above to start tracking your competitive programming progress</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
