import { useState } from "react";
import { getPublicProfileAPI } from "../services/api";
import { PLATFORMS, formatNum, getRatingColor } from "../utils/helpers";
import "./Compare.css";

function StatRow({ label, val1, val2 }) {
  const n1 = parseFloat(val1) || 0;
  const n2 = parseFloat(val2) || 0;
  const winner = n1 > n2 ? "left" : n2 > n1 ? "right" : "tie";
  return (
    <div className="cmp-stat-row">
      <span className={`cmp-val ${winner === "left" ? "cmp-winner" : ""}`}>{val1 || "—"}</span>
      <span className="cmp-label">{label}</span>
      <span className={`cmp-val ${winner === "right" ? "cmp-winner" : ""}`}>{val2 || "—"}</span>
    </div>
  );
}

function UserColumn({ data, platform }) {
  if (!data) return <div className="cmp-empty-col">No data</div>;
  const meta = PLATFORMS[platform];
  return (
    <div className="cmp-user-col">
      <div className="cmp-user-header" style={{ background: meta.bg }}>
        <div className="cmp-user-icon" style={{ color: meta.color }}>{meta.icon}</div>
        <div className="cmp-user-handle">{data.handle}</div>
        <div className="cmp-user-rank" style={{ color: getRatingColor(data.rating, platform) }}>
          {data.rank}
        </div>
      </div>
    </div>
  );
}

function Compare() {
  const [platform, setPlatform] = useState("codeforces");
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!h1.trim() || !h2.trim()) return;
    setLoading(true); setError(""); setData1(null); setData2(null);
    try {
      const [r1, r2] = await Promise.all([
        getPublicProfileAPI(platform, h1.trim()),
        getPublicProfileAPI(platform, h2.trim()),
      ]);
      setData1(r1.data.data);
      setData2(r2.data.data);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="compare page">
      <div className="cmp-header">
        <h1 className="cmp-title">Compare Users</h1>
        <p className="cmp-sub">Compare two competitive programmers head to head</p>
      </div>

      {/* Search Form */}
      <form className="cmp-form card" onSubmit={handleCompare}>
        <div className="cmp-form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Platform</label>
            <select className="input" value={platform} onChange={e => setPlatform(e.target.value)}>
              {Object.entries(PLATFORMS).map(([key, p]) => (
                <option key={key} value={key}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">User 1 Handle</label>
            <input className="input" placeholder="Enter first handle" value={h1} onChange={e => setH1(e.target.value)} />
          </div>
          <div className="cmp-vs">VS</div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">User 2 Handle</label>
            <input className="input" placeholder="Enter second handle" value={h2} onChange={e => setH2(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ alignSelf: "flex-end" }}>
            {loading ? <><span className="spinner" /> Comparing...</> : "Compare →"}
          </button>
        </div>
        {error && <div className="auth-error">{error}</div>}
      </form>

      {/* Results */}
      {data1 && data2 && (
        <div className="cmp-results card animate-fade-up">
          {/* Headers */}
          <div className="cmp-grid-header">
            <div className="cmp-user-info">
              <div className="cmp-avatar">{data1.handle?.[0]?.toUpperCase()}</div>
              <div>
                <div className="cmp-handle">{data1.handle}</div>
                <div className="cmp-rank-label" style={{ color: getRatingColor(data1.rating, platform) }}>{data1.rank}</div>
              </div>
            </div>
            <div className="cmp-vs-badge">VS</div>
            <div className="cmp-user-info cmp-user-right">
              <div>
                <div className="cmp-handle">{data2.handle}</div>
                <div className="cmp-rank-label" style={{ color: getRatingColor(data2.rating, platform) }}>{data2.rank}</div>
              </div>
              <div className="cmp-avatar">{data2.handle?.[0]?.toUpperCase()}</div>
            </div>
          </div>

          <div className="divider" />

          {/* Stats */}
          <div className="cmp-stats">
            <StatRow label="Rating"        val1={data1.rating}        val2={data2.rating} />
            <StatRow label="Max Rating"    val1={data1.maxRating}     val2={data2.maxRating} />
            <StatRow label="Problems Solved" val1={data1.totalSolved} val2={data2.totalSolved} />
            <StatRow label="Contests"      val1={data1.totalContests} val2={data2.totalContests} />
            <StatRow label="Acceptance %"  val1={data1.acceptanceRate} val2={data2.acceptanceRate} />
          </div>

          {/* Topic comparison */}
          {(data1.topicStats?.length > 0 || data2.topicStats?.length > 0) && (
            <>
              <div className="divider" />
              <h3 className="cmp-section-title">Top Topics</h3>
              <div className="cmp-topics">
                <div className="cmp-topic-col">
                  {data1.topicStats?.slice(0, 5).map((t, i) => (
                    <div key={i} className="cmp-topic-item">
                      <span>{t.topic}</span>
                      <span className="cmp-topic-rate">{t.rate}%</span>
                    </div>
                  ))}
                </div>
                <div className="cmp-topic-col">
                  {data2.topicStats?.slice(0, 5).map((t, i) => (
                    <div key={i} className="cmp-topic-item">
                      <span>{t.topic}</span>
                      <span className="cmp-topic-rate">{t.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Compare;
