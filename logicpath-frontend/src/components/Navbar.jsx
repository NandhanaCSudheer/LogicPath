import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isTeacher, isStudent, isGuest, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const homePath = isTeacher ? "/teacher/dashboard" : isStudent ? "/student/dashboard" : "/dashboard";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <nav className="global-navbar">
      <div className="navbar-left" onClick={() => navigate(homePath)} style={{ cursor: "pointer" }}>
        <div className="navbar-logo-badge">L</div>
        <span className="navbar-logo-text">LogicPath</span>
        {isTeacher && <span className="role-navbar-badge teacher">Teacher</span>}
        {isStudent && <span className="role-navbar-badge student">Student</span>}
      </div>

      <div className="navbar-links">
        {isTeacher ? (
          <>
            <span
              className={isActive("/teacher/dashboard") ? "active" : ""}
              onClick={() => navigate("/teacher/dashboard")}
            >
              Teacher Dashboard
            </span>
            <span
              className={isActive("/teacher/create-question") ? "active" : ""}
              onClick={() => navigate("/teacher/create-question")}
            >
              + Create Problem
            </span>
            <span
              className={isActive("/build") ? "active" : ""}
              onClick={() => navigate("/build")}
            >
              Circuit Sandbox
            </span>
            <span
              className={isActive("/simulate") ? "active" : ""}
              onClick={() => navigate("/simulate")}
            >
              Simulate
            </span>
          </>
        ) : isStudent ? (
          <>
            <span
              className={isActive("/student/dashboard") ? "active" : ""}
              onClick={() => navigate("/student/dashboard")}
            >
              Student Dashboard
            </span>
            <span
              className={isActive("/student/learning") ? "active" : ""}
              onClick={() => navigate("/student/learning")}
            >
              Learning Path
            </span>
            <span
              className={isActive("/student/problems") || isActive("/challenges") ? "active" : ""}
              onClick={() => navigate("/student/problems")}
            >
              Problems
            </span>
            <span
              className={isActive("/student/attempts") ? "active" : ""}
              onClick={() => navigate("/student/attempts")}
            >
              My Attempts
            </span>
            <span
              className={isActive("/build") ? "active" : ""}
              onClick={() => navigate("/build")}
            >
              Circuit Sandbox
            </span>
            <span
              className={isActive("/learn") ? "active" : ""}
              onClick={() => navigate("/learn")}
            >
              Learn
            </span>
          </>
        ) : (
          <>
            <span
              className={isActive("/dashboard") ? "active" : ""}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <span
              className={isActive("/build") ? "active" : ""}
              onClick={() => navigate("/build")}
            >
              Build
            </span>
            <span
              className={isActive("/simulate") ? "active" : ""}
              onClick={() => navigate("/simulate")}
            >
              Simulate
            </span>
            <span
              className={isActive("/learn") ? "active" : ""}
              onClick={() => navigate("/learn")}
            >
              Learn
            </span>
            <span
              className={isActive("/challenges") ? "active" : ""}
              onClick={() => navigate("/challenges")}
            >
              Challenges
            </span>
          </>
        )}
      </div>

      <div className="navbar-right">
        {isGuest ? (
          <span className="guest-tag">Guest Mode</span>
        ) : (
          <div className="user-profile-tag" title={user?.email || "User"}>
            <div className="avatar-circle">{initials}</div>
            <div className="user-meta-stack">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-role-label">{user?.role?.toUpperCase() || "STUDENT"}</span>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout} title="Sign Out">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
