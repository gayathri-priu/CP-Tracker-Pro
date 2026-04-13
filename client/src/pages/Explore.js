import { useState } from "react";
import { getPublicProfileAPI } from "../services/api";
import { PLATFORMS, formatNum, getRatingColor } from "../utils/helpers";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Explore.css";

function Explore() {
  const [platform, setPlatform] = useState("codeforces");
  const [handle,   setHandle]   = useState("");
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true); setError(""); setData(null);
    try {
      const res = await getPublicProfileAPI(platform, handle.trim());
      setData(res.data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const meta = PLATFORMS[platform];

  return (
    <div className="explore page">
      <div className="exp-header">
        <h1 className="exp-title">Explore Profiles</h1>
        <p className="exp-sub">Look up any competitive programmer — no login required</p>
      </div>

      {/* Search */}
      <form className="exp-form card" onSubmit={handleSearch}>
        <div className="exp-form-row">
          <select className="input exp-select" value={platform} onChange={e => { setPlatform(e.target.value); setData(null); }}>
            {Object.entries(PLATFORMS).map(([k, p]) => (
              <option key={k} value={k}>{p.name}</option>
            ))}
          </select>
          <input
            className="input exp-input"
            placeholder={`Search ${meta.name} handle...`}
            value={handle}
            onChange={e => setHandle(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Searching...</> : "Search →"}
          </button>
        </div>
        {error && <p className="exp-error">{error}</p>}
      </form>

      {/* Results */}
      {data && (
        <div className="exp-result animate-fade-up">
          {/* Profile */}
          <div className="exp-profile card">
            <div className="exp-profile-left">
              {data.avatar ? (
                <img src={data.avatar} alt={data.handle} className="exp-avatar-img"
                  onError={e => e.target.style.display = "none"} />
              ) : (
                <div className="exp-avatar-placeholder" style={{ background: meta.bg, color: meta.color }}>
                  {data.handle?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="exp-handle">{data.handle}</h2>
                <span className="exp-rank" style={{ color: getRatingColor(data.rating, platform) }}>
                  {data.rank}
                </span>
                {data.country && <p className="exp-country">🌍 {data.country}</p>}
                {data.organization && <p className="exp-org">🏫 {data.organization}</p>}
              </div>
            </div>
            <div className="exp-stats-row">
              {[
                { label: "Rating",   val: data.rating || "—",       color: getRatingColor(data.rating, platform) },
                { label: "Max",      val: data.maxRating || "—",    color: getRatingColor(data.maxRating, platform) },
                { label: "Solved",   val: formatNum(data.totalSolved) },
                { label: "Contests", val: data.totalContests || "—" },
                { label: "Accept %", val: data.acceptanceRate ? `${data.acceptanceRate}%` : "—" },
              ].map((s, i) => (
                <div key={i} className="exp-stat">
                  <span className="exp-stat-val" style={s.color ? { color: s.color } : {}}>{s.val}</span>
                  <span className="exp-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="exp-bottom-row">
            {/* Rating Chart */}
            {data.ratingHistory?.length > 0 && (
              <div className="exp-chart-card card">
                <h3 className="exp-section-title">Rating History</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.ratingHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={meta.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={meta.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f9" />
                    <XAxis dataKey="contest" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} domain={["dataMin - 50", "dataMax + 50"]} />
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #e4e7f0", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="rating" stroke={meta.color} strokeWidth={2} fill="url(#rGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Topics */}
            {data.topicStats?.length > 0 && (
              <div className="exp-topics card">
                <h3 className="exp-section-title">Top Topics</h3>
                <div className="exp-topic-list">
                  {data.topicStats.slice(0, 8).map((t, i) => (
                    <div key={i} className="exp-topic-row">
                      <span className="exp-topic-name">{t.topic}</span>
                      <div className="exp-topic-bar-wrap">
                        <div className="exp-topic-bar" style={{
                          width: `${t.rate}%`,
                          background: t.rate >= 70 ? "var(--green)" : t.rate >= 40 ? "var(--blue)" : "var(--red)",
                        }} />
                      </div>
                      <span className="exp-topic-pct">{t.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="exp-view-link">
            <a href={`${meta.url}${data.handle}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
              View on {meta.name} ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
