import { useState } from "react";
import { PLATFORMS, formatNum, getRatingColor } from "../../utils/helpers";
import { connectPlatformAPI } from "../../services/api";
import "./PlatformCard.css";

function PlatformCard({ platformKey, data, onConnected }) {
  const [handle,  setHandle]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [mode,    setMode]    = useState("view"); // view | connect

  const meta = PLATFORMS[platformKey];

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true); setError("");
    try {
      await connectPlatformAPI({ platform: platformKey, handle: handle.trim() });
      setMode("view");
      setHandle("");
      if (onConnected) onConnected();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const isConnected = data?.isConnected;
  const ratingColor = getRatingColor(data?.rating, platformKey);

  return (
    <div className="platform-card card" style={{ "--p-color": meta.color, "--p-bg": meta.bg }}>
      {/* Header */}
      <div className="pc-header">
        <div className="pc-icon" style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </div>
        <div className="pc-name-wrap">
          <span className="pc-name">{meta.name}</span>
          {isConnected && (
            <span className="pc-handle font-mono">@{data.handle}</span>
          )}
        </div>
        <div className="pc-status">
          {isConnected
            ? <span className="badge badge-green">● Connected</span>
            : <span className="badge badge-gray">Not connected</span>
          }
        </div>
      </div>

      {/* Stats */}
      {isConnected && mode === "view" && (
        <div className="pc-stats">
          <div className="pc-stat">
            <span className="pc-stat-val" style={{ color: ratingColor }}>{data.rating || "—"}</span>
            <span className="pc-stat-label">Rating</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-val">{formatNum(data.totalSolved)}</span>
            <span className="pc-stat-label">Solved</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-val">{data.totalContests || "—"}</span>
            <span className="pc-stat-label">Contests</span>
          </div>
          <div className="pc-stat">
            <span className="pc-stat-val">{data.rank || "—"}</span>
            <span className="pc-stat-label">Rank</span>
          </div>
        </div>
      )}

      {/* Connect Form */}
      {(!isConnected || mode === "connect") && (
        <form className="pc-connect-form" onSubmit={handleConnect}>
          <input
            className="input"
            placeholder={`Enter ${meta.name} handle`}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            autoComplete="off"
          />
          {error && <p className="pc-error">{error}</p>}
          <div className="pc-form-actions">
            <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Connecting...</> : "Connect"}
            </button>
            {isConnected && (
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setMode("view")}>Cancel</button>
            )}
          </div>
        </form>
      )}

      {/* Footer actions */}
      {isConnected && mode === "view" && (
        <div className="pc-footer">
          <button className="btn btn-ghost btn-sm" onClick={() => setMode("connect")}>Change handle</button>
          <a href={`${meta.url}${data.handle}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            View Profile ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default PlatformCard;
