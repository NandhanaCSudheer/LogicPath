import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestToken(event) {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = await api.forgotPassword({ email: email.trim() });
      setStatusMessage(data.message || "Reset token generated.");
      if (data.reset_token) {
        setResetToken(data.reset_token);
        setStep(2);
      }
    } catch (err) {
      setError(err.message || "Failed to initiate password recovery.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setStatusMessage("");

    if (!resetToken.trim()) {
      setError("Reset token is required");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = await api.resetPassword({
        token: resetToken.trim(),
        password: newPassword,
      });
      setStatusMessage(data.message || "Password successfully reset! You can now log in.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-brand">
          <div className="brand-icon">L</div>
          <span>LogicPath</span>
        </div>

        <div className="forgot-header">
          <p className="small-title">PASSWORD RECOVERY</p>
          <h1>{step === 1 ? "Forgot your password?" : "Reset your password"}</h1>
          <p>
            {step === 1
              ? "Enter your account email to receive a secure password recovery token."
              : "Enter your recovery token and new password to secure your account."}
          </p>
        </div>

        {error && (
          <p style={{
            margin: "0 0 18px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fff1f1",
            color: "#c43d3d",
            fontSize: "13px"
          }}>
            {error}
          </p>
        )}

        {statusMessage && (
          <p style={{
            margin: "0 0 18px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#eefcf3",
            color: "#1e7e45",
            fontSize: "13px"
          }}>
            {statusMessage}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Generating token..." : "Send reset link"}
              <span>→</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="token">Reset Token</label>
              <input
                id="token"
                type="text"
                placeholder="Paste your reset token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Updating password..." : "Reset Password"}
              <span>→</span>
            </button>
          </form>
        )}

        <button
          type="button"
          className="back-login"
          onClick={() => navigate("/")}
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;