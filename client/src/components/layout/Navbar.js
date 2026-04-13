import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">CP</div>
          <span className="navbar-logo-text">Tracker <span>Pro</span></span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="navbar-links">
            <Link to="/dashboard"   className={`nav-link ${isActive("/dashboard")   ? "active" : ""}`}>Dashboard</Link>
            <Link to="/leaderboard" className={`nav-link ${isActive("/leaderboard") ? "active" : ""}`}>Leaderboard</Link>
            <Link to="/compare"     className={`nav-link ${isActive("/compare")     ? "active" : ""}`}>Compare</Link>
            <Link to="/explore"     className={`nav-link ${isActive("/explore")     ? "active" : ""}`}>Explore</Link>
          </div>
        )}

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <>
              <div className="navbar-user">
                <div className="navbar-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span className="navbar-username">{user.name}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
