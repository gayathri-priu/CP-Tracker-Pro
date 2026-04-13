import "./AIInsights.css";

function AIInsights({ insights, combinedScore, totalSolvedAll }) {
  if (!insights?.summary) {
    return (
      <div className="ai-card card">
        <div className="ai-empty">
          <span className="ai-empty-icon">🤖</span>
          <p>Connect at least one platform to generate AI insights</p>
        </div>
      </div>
    );
  }

  const { summary, studyPlan = [], strengths = [], improvements = [] } = insights;

  return (
    <div className="ai-card card">
      <div className="ai-header">
        <span className="ai-badge">🤖 AI Insights</span>
        <div className="ai-score-wrap">
          <span className="ai-score">{combinedScore}</span>
          <span className="ai-score-label">CP Score</span>
        </div>
      </div>

      <p className="ai-summary">{summary}</p>

      {studyPlan.length > 0 && (
        <div className="ai-section">
          <h4 className="ai-section-title">📋 Study Plan</h4>
          <ul className="ai-list">
            {studyPlan.map((s, i) => (
              <li key={i} className="ai-list-item">
                <span className="ai-num">{String(i+1).padStart(2,"0")}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {strengths.length > 0 && (
        <div className="ai-section">
          <h4 className="ai-section-title text-green">💪 Strengths</h4>
          <div className="ai-tags">
            {strengths.map((s, i) => <span key={i} className="ai-tag tag-green">{s}</span>)}
          </div>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="ai-section">
          <h4 className="ai-section-title text-orange">⚡ Improve</h4>
          <div className="ai-tags">
            {improvements.map((s, i) => <span key={i} className="ai-tag tag-orange">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIInsights;
