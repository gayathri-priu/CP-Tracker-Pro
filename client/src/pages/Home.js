import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PLATFORMS } from "../utils/helpers";
import "./Home.css";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge badge badge-blue">🏆 Multi-Platform CP Analyzer</div>

          <h1 className="hero-title">
            Track. Analyze.<br />
            <span className="hero-accent">Dominate.</span>
          </h1>

          <p className="hero-desc">
            The only platform that unifies your competitive programming stats
            from Codeforces, LeetCode, GeeksForGeeks, CodeChef, HackerRank &amp; AtCoder
            — with AI-powered insights and personalized study plans.
          </p>

          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login"    className="btn btn-secondary btn-lg">Sign In</Link>
              </>
            )}
          </div>

          {/* Platform pills */}
          <div className="hero-platforms">
            {Object.entries(PLATFORMS).map(([key, p]) => (
              <div key={key} className="platform-pill" style={{ "--p-color": p.color, "--p-bg": p.bg }}>
                <span className="platform-pill-icon">{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-inner">
          <h2 className="section-title">Everything you need</h2>
          <p className="section-sub">One dashboard for your entire CP journey</p>

          <div className="features-grid">
            {[
              { icon: "📊", title: "Unified Dashboard",  desc: "All 6 platforms in one clean view. Rating, solved count, contest history — everything together." },
              { icon: "🤖", title: "AI Study Plans",      desc: "Get personalized study plans based on your weak topics across all platforms." },
              { icon: "📈", title: "Rating History",      desc: "Interactive charts showing your rating progression across every platform over time." },
              { icon: "🎯", title: "Weakness Detection",  desc: "AI identifies exactly which topics you struggle with and recommends targeted practice." },
              { icon: "🏅", title: "Leaderboard",         desc: "See how you rank against other CP Tracker Pro users globally with a combined CP score." },
              { icon: "⚔️", title: "User Compare",        desc: "Compare your stats side-by-side with any other user across all platforms." },
            ].map((f, i) => (
              <div key={i} className="feature-card card animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to level up?</h2>
          <p className="cta-sub">Join thousands of competitive programmers tracking their progress</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">Start for Free →</Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
