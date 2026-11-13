import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [circuits, setCircuits] = useState([]);
  const [examples, setExamples] = useState([]);
  const [simCount, setSimCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    try {
      // 1. Load preset examples
      const exRes = await api.getExamples();
      if (exRes.examples) {
        setExamples(exRes.examples);
      }

      // 2. Load user's saved circuits from MongoDB
      const circRes = await api.listCircuits();
      if (circRes.circuits) {
        setCircuits(circRes.circuits);
      }

      // 3. Load simulation history count from MongoDB
      const simRes = await api.getSimulationHistory().catch(() => ({ history: [] }));
      if (simRes.history) {
        setSimCount(simRes.history.length);
      }
    } catch (err) {
      setError("Failed to load user circuits from server: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCircuit = (circuit) => {
    localStorage.setItem("logicpath_active_circuit", JSON.stringify(circuit));
    localStorage.setItem("logicpathCircuit", JSON.stringify(circuit.nodes || []));
    navigate("/build");
  };

  const handleOpenExample = (example) => {
    localStorage.setItem("logicpath_active_circuit", JSON.stringify(example));
    localStorage.setItem("logicpathCircuit", JSON.stringify(example.nodes || []));
    navigate("/build");
  };

  const handleDeleteCircuit = async (circuitId) => {
    if (!window.confirm("Are you sure you want to delete this circuit?")) return;

    try {
      await api.deleteCircuit(circuitId);
      setCircuits((prev) => prev.filter((c) => c.id !== circuitId));
      setActionMessage("Circuit deleted successfully.");
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      alert("Failed to delete circuit: " + err.message);
    }
  };

  const handleCreateNew = () => {
    localStorage.removeItem("logicpath_active_circuit");
    localStorage.removeItem("logicpathCircuit");
    navigate("/build");
  };

  // Real statistics
  const totalCircuits = circuits.length;
  const totalGates = circuits.reduce((sum, c) => sum + (c.nodes ? c.nodes.length : 0), 0);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        {/* HERO BANNER */}
        <section className="dashboard-hero">
          <div className="hero-text">
            <span className="hero-eyebrow">CONTROL CENTER</span>
            <h1>Welcome back, {user?.name || "Engineer"}!</h1>
            <p>
              Design combinational logic circuits, verify truth tables, run real-time simulations,
              and apply algebraic gate optimization.
            </p>
          </div>

          <div className="hero-cta-group">
            <button className="create-new-btn" onClick={handleCreateNew}>
              + Create New Circuit
            </button>
            <button className="explore-btn" onClick={() => navigate("/learn")}>
              📖 Educational Gates
            </button>
          </div>
        </section>

        {/* METRICS ROW */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-value">{totalCircuits}</span>
              <span className="stat-label">Saved Circuits</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧩</div>
            <div className="stat-info">
              <span className="stat-value">{totalGates}</span>
              <span className="stat-label">Total Gates Deployed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <span className="stat-value">{examples.length}</span>
              <span className="stat-label">Standard Presets Available</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <span className="stat-value">{simCount}</span>
              <span className="stat-label">Simulations Recorded</span>
            </div>
          </div>
        </section>

        {actionMessage && <div className="dashboard-alert success">{actionMessage}</div>}
        {error && <div className="dashboard-alert error">{error}</div>}

        {/* MAIN SPLIT: MY CIRCUITS & PRESET EXAMPLES */}
        <div className="dashboard-columns">
          {/* LEFT: MY CIRCUITS */}
          <section className="dashboard-section my-circuits-section">
            <div className="section-header">
              <h2>My Circuits</h2>
              <span className="count-badge">{circuits.length}</span>
            </div>

            {loading ? (
              <div className="loading-placeholder">Loading your circuits...</div>
            ) : circuits.length === 0 ? (
              <div className="empty-state">
                <p>No circuits saved yet in your cloud database.</p>
                <button className="secondary-btn" onClick={handleCreateNew}>
                  Design your first circuit
                </button>
              </div>
            ) : (
              <div className="circuits-list">
                {circuits.map((circ) => (
                  <div key={circ.id} className="circuit-card">
                    <div className="circuit-card-header">
                      <h3>{circ.name}</h3>
                      <span className="gate-tag">
                        {circ.nodes ? circ.nodes.length : 0} nodes
                      </span>
                    </div>

                    <p className="circuit-desc">
                      {circ.description || "No description provided."}
                    </p>

                    <div className="circuit-card-footer">
                      <span className="updated-date">
                        {circ.updated_at ? new Date(circ.updated_at).toLocaleDateString() : ""}
                      </span>

                      <div className="card-actions">
                        <button
                          className="card-action-btn edit"
                          onClick={() => handleOpenCircuit(circ)}
                        >
                          Open in Builder
                        </button>
                        <button
                          className="card-action-btn delete"
                          onClick={() => handleDeleteCircuit(circ.id)}
                          title="Delete circuit"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: PRESETS & CHALLENGES */}
          <section className="dashboard-section presets-section">
            <div className="section-header">
              <h2>Preset Demonstrations</h2>
              <span className="count-badge">{examples.length}</span>
            </div>

            <p className="section-subtitle">
              Explore verified standard combinational circuits with pre-wired topological networks.
            </p>

            <div className="presets-list">
              {examples.map((ex) => (
                <div key={ex.id} className="preset-item" onClick={() => handleOpenExample(ex)}>
                  <div className="preset-item-info">
                    <h4>{ex.name}</h4>
                    <p>{ex.description}</p>
                  </div>
                  <button className="preset-load-btn">→</button>
                </div>
              ))}
            </div>

            {/* CHALLENGES PROMO */}
            <div className="challenges-promo" onClick={() => navigate("/challenges")}>
              <div className="promo-badge">CHALLENGES</div>
              <h3>Test Your Engineering Skills</h3>
              <p>Solve truth table matching, XOR parity from NANDs, and Adder designs.</p>
              <span className="promo-link">View Challenges →</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
