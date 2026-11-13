import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }

    const savedEmail = localStorage.getItem("logicpath_saved_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, user, navigate]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await api.login({
        email: email.trim(),
        password,
      });

      if (rememberMe) {
        localStorage.setItem(
          "logicpath_saved_email",
          email.trim()
        );
      } else {
        localStorage.removeItem("logicpath_saved_email");
      }

      login(data.token, data.user);

      if (data.user?.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (data.user?.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lp-login-page">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="lp-bg-grid"></div>
      <div className="lp-bg-glow lp-glow-one"></div>
      <div className="lp-bg-glow lp-glow-two"></div>

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="lp-login-header">
        <div
          className="lp-brand"
          onClick={() => navigate("/")}
        >
          <div className="lp-brand-mark">
            <span>L</span>
          </div>

          <div>
            <strong>LogicPath</strong>
            <small>Digital Logic Learning</small>
          </div>
        </div>

        <div className="lp-header-status">
          <span className="status-dot"></span>
          Interactive Learning Platform
        </div>
      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="lp-login-main">

        {/* LEFT SIDE */}

        <div className="lp-login-intro">

          <div className="lp-intro-label">
            <span>01</span>
            DIGITAL LOGIC LAB
          </div>

          <h1>
            Think in
            <span> Logic.</span>
            <br />
            Build with
            <span> LogicPath.</span>
          </h1>

          <p className="lp-intro-description">
            Learn Boolean algebra, design digital circuits,
            simulate your ideas and solve logic problems through
            an interactive learning experience.
          </p>

          {/* Logic Circuit */}

          <div className="lp-circuit-card">

            <div className="circuit-top">
              <span>LIVE CIRCUIT</span>

              <div className="circuit-status">
                <i></i>
                READY
              </div>
            </div>

            <div className="circuit-board">

              <div className="input-row input-a">
                <span className="signal-label">A</span>
                <span className="signal-line"></span>
              </div>

              <div className="input-row input-b">
                <span className="signal-label">B</span>
                <span className="signal-line"></span>
              </div>

              <div className="logic-gate-box">
                <small>LOGIC GATE</small>
                <strong>AND</strong>
                <span>AND</span>
              </div>

              <span className="gate-line gate-output"></span>

              <div className="output-node">
                <span>OUT</span>
                <i></i>
              </div>

            </div>

            <div className="truth-strip">
              <span>A</span>
              <span>B</span>
              <span>OUT</span>
              <strong>1</strong>
              <strong>1</strong>
              <strong>1</strong>
            </div>

          </div>

          {/* Feature Pills */}

          <div className="lp-feature-row">

            <div className="lp-feature">
              <span>◈</span>
              <div>
                <strong>Build</strong>
                <small>Digital circuits</small>
              </div>
            </div>

            <div className="lp-feature">
              <span>⌁</span>
              <div>
                <strong>Simulate</strong>
                <small>Test your logic</small>
              </div>
            </div>

            <div className="lp-feature">
              <span>◆</span>
              <div>
                <strong>Optimize</strong>
                <small>Simplify expressions</small>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="lp-login-panel">

          <div className="lp-login-card">

            <div className="lp-card-icon">
              ⇥
            </div>

            <div className="lp-card-heading">
              <span>WELCOME BACK</span>

              <h2>Sign in</h2>

              <p>
                Continue your LogicPath learning journey.
              </p>
            </div>

            {error && (
              <div className="lp-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div className="lp-input-group">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <div className="lp-input-wrapper">

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="lp-input-group">

                <div className="lp-password-heading">

                  <label htmlFor="password">
                    PASSWORD
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="lp-input-wrapper">

                  <span className="input-icon">
                    •••
                  </span>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* REMEMBER */}

              <label className="lp-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span className="custom-check"></span>

                <span>
                  Remember this device
                </span>

              </label>

              {/* SUBMIT */}

              <button
                type="submit"
                className="lp-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "AUTHENTICATING..."
                    : "ENTER LOGICPATH"}
                </span>

                <strong>
                  {loading ? "..." : "→"}
                </strong>
              </button>

            </form>

            <div className="lp-card-divider">
              <span></span>
              <small>NEW TO LOGICPATH?</small>
              <span></span>
            </div>

            <button
              type="button"
              className="lp-create-account"
              onClick={() => navigate("/register")}
            >
              Create your student or teacher account
              <span>→</span>
            </button>

            <div className="lp-security-note">
              <span>◉</span>
              Your session is protected with secure authentication.
            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="lp-login-footer">
        <span>© 2026 LogicPath</span>

        <div>
          <span>BUILD</span>
          <b>•</b>
          <span>SIMULATE</span>
          <b>•</b>
          <span>LEARN</span>
          <b>•</b>
          <span>OPTIMIZE</span>
        </div>
      </footer>

    </main>
  );
}

export default Login;