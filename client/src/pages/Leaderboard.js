import { useState, useEffect } from "react";
import { getLeaderboardAPI } from "../services/api";
import { formatNum, getScoreBadge } from "../utils/helpers";
import "./Leaderboard.css";

function Leaderboard() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);

  useEffect(() => {
    setLoading(true);
    getLeaderboardAPI(page)
      .then(res => { setData(res.data.data); setPages(res.data.pagination.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="leaderboard page">
      <div className="lb-header">
        <h1 className="lb-title">Leaderboard</h1>
        <p className="lb-sub">Top competitive programmers ranked by combined CP score</p>
      </div>

      {loading ? (
        <div className="lb-loading"><span className="spinner spinner-lg" /></div>
      ) : data.length === 0 ? (
        <div className="lb-empty card">
          <span>🏆</span>
          <p>No users yet. Be the first to connect your platforms!</p>
        </div>
      ) : (
        <>
          <div className="lb-table card">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>CP Score</th>
                  <th>Total Solved</th>
                  <th>CF Rating</th>
                  <th>LC Solved</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u, i) => {
                  const rank = (page - 1) * 20 + i + 1;
                  const badge = getScoreBadge(u.combinedScore);
                  return (
                    <tr key={u._id} className="lb-row">
                      <td className="lb-rank">
                        {rank <= 3 ? medals[rank - 1] : <span className="lb-rank-num">{rank}</span>}
                      </td>
                      <td className="lb-user">
                        <div className="lb-avatar">{u.name?.[0]?.toUpperCase()}</div>
                        <span className="lb-name">{u.name}</span>
                      </td>
                      <td>
                        <div className="lb-score-cell">
                          <span className="lb-score">{u.combinedScore}</span>
                          <span className="badge" style={{ background: `${badge.color}18`, color: badge.color, fontSize: "0.65rem" }}>
                            {badge.label}
                          </span>
                        </div>
                      </td>
                      <td className="lb-num">{formatNum(u.totalSolvedAll)}</td>
                      <td className="lb-num">{u.platforms?.codeforces?.rating || "—"}</td>
                      <td className="lb-num">{formatNum(u.platforms?.leetcode?.totalSolved) || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="lb-pagination">
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Prev</button>
              <span className="lb-page-info">Page {page} of {pages}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Leaderboard;
