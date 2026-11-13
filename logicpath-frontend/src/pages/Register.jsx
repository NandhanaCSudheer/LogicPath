import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" or "teacher"
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      const data = await api.register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: role,
      });

      if (data.token && data.user) {
        login(data.token, data.user);
        if (data.user.role === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="auth-page">
      {/* Left side */}
      <div className="auth-left">
        <div className="brand">
          <div className="brand-icon">L</div>
          <span>LogicPath</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">START YOUR JOURNEY</p>

          <h1>
            Learn logic.
            <br />
            Build something
            <br />
            <span>meaningful.</span>
          </h1>

          <p className="hero-description">
            Create your LogicPath account as a <strong>Student</strong> to solve verified logic challenges,
            or as a <strong>Teacher</strong> to create and publish AI-verified digital logic problems.
          </p>

          <div className="process">
            <span>Learn</span>
            <span>→</span>
            <span>Design</span>
            <span>→</span>
            <span>Simulate</span>
            <span>→</span>
            <span>Optimize</span>
          </div>
        </div>

        <div className="copyright">© 2026 LogicPath</div>
      </div>

      {/* Right side */}
      <div className="auth-right">
        <div className="register-container">
          <p className="welcome">GET STARTED</p>
          <h2>Create your LogicPath account</h2>
          <p className="subtitle">Choose your platform role and begin.</p>

          {error && (
            <p className="error-message" style={{
              margin: "0 0 20px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#fff1f1",
              color: "#c43d3d",
              fontSize: "13px"
            }}>
              {error}
            </p>
          )}

          <form onSubmit={handleRegister}>
            {/* ROLE SELECTOR */}
            <div className="form-group">
              <label>Select your account role</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "6px"
              }}>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: role === "student" ? "2px solid #0799bd" : "1px solid #d1d5db",
                    background: role === "student" ? "#e0f2fe" : "#f9fafb",
                    color: role === "student" ? "#0369a1" : "#4b5563",
                    fontWeight: role === "student" ? "700" : "500",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "16px", marginBottom: "4px" }}>🎓 Student</div>
                  <div style={{ fontSize: "11px", opacity: 0.85 }}>Solve problems & ask questions</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: role === "teacher" ? "2px solid #8067e9" : "1px solid #d1d5db",
                    background: role === "teacher" ? "#ede9fe" : "#f9fafb",
                    color: role === "teacher" ? "#6d28d9" : "#4b5563",
                    fontWeight: role === "teacher" ? "700" : "500",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "16px", marginBottom: "4px" }}>👨‍🏫 Teacher</div>
                  <div style={{ fontSize: "11px", opacity: 0.85 }}>Create & verify problems</div>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the Terms and Conditions</span>
            </label>

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Creating account..." : `Create ${role === "teacher" ? "Teacher" : "Student"} account`}
              <span>→</span>
            </button>
          </form>


          <p className="signup-text">
            Already have an account?
            <button
              className="link-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;