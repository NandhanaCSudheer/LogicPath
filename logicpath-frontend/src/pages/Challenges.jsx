import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./Challenges.css";

function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    api.getChallenges()
      .then((res) => {
        if (res.challenges && res.challenges.length > 0) {
          setChallenges(res.challenges);
          setActiveChallenge(res.challenges[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenInBuilder = (challenge) => {
    // Create starter nodes for the challenge (inputs and outputs)
    const starterNodes = challenge.inputs.map((inName, idx) => ({
      id: `in_${inName.toLowerCase()}`,
      type: "INPUT",
      label: inName,
      state: 0,
      x: 100,
      y: 120 + idx * 90,
    }));

    // Find expected outputs from first expected row
    const firstRow = challenge.expectedTruthTable[0] || {};
    const outNames = Object.keys(firstRow).filter((k) => !challenge.inputs.includes(k));
    outNames.forEach((outName, idx) => {
      starterNodes.push({
        id: `out_${outName.toLowerCase()}`,
        type: "OUTPUT",
        label: outName,
        state: 0,
        x: 650,
        y: 120 + idx * 100,
      });
    });

    const activeObj = {
      id: null,
      name: `Challenge: ${challenge.title}`,
      description: challenge.description,
      nodes: starterNodes,
      connections: [],
      challenge_id: challenge.id,
    };

    localStorage.setItem("logicpath_active_circuit", JSON.stringify(activeObj));
    localStorage.setItem("logicpathCircuit", JSON.stringify(starterNodes));
    navigate("/build");
  };

  const handleVerifyActiveCircuit = async (challenge) => {
    setVerifying(true);
    setVerifyResult(null);

    try {
      const raw = localStorage.getItem("logicpath_active_circuit");
      if (!raw) {
        setVerifyResult({
          passed: false,
          message: "No active circuit found in local session. Please build a circuit first!",
        });
        return;
      }

      const active = JSON.parse(raw);
      const res = await api.verifyChallenge({
        challenge_id: challenge.id,
        nodes: active.nodes || [],
        connections: active.connections || [],
      });

      setVerifyResult(res);
    } catch (err) {
      setVerifyResult({
        passed: false,
        message: "Verification failed: " + err.message,
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="challenges-page">
      <Navbar />

      <main className="challenges-content">
        <div className="challenges-header">
          <span className="chal-eyebrow">ENGINEERING BENCHMARKS</span>
          <h1>Logic Design Challenges</h1>
          <p>
            Deterministic verification of combinational logic circuits against formal specification truth tables.
          </p>
        </div>

        <div className="challenges-layout">
          {/* CHALLENGES LIST */}
          <aside className="challenges-list">
            <h3>SELECT MISSION</h3>
            {challenges.map((c) => (
              <div
                key={c.id}
                className={`challenge-nav-card ${activeChallenge?.id === c.id ? "active" : ""}`}
                onClick={() => {
                  setActiveChallenge(c);
                  setVerifyResult(null);
                }}
              >
                <div className="chal-badge-row">
                  <span className={`diff-pill ${c.difficulty.toLowerCase()}`}>
                    {c.difficulty}
                  </span>
                </div>
                <h4>{c.title}</h4>
                <p>{c.description}</p>
              </div>
            ))}
          </aside>

          {/* ACTIVE CHALLENGE SPEC & VERIFICATION */}
          {activeChallenge && (
            <section className="challenge-detail-panel">
              <div className="chal-detail-header">
                <div>
                  <span className="chal-type-tag">{activeChallenge.difficulty.toUpperCase()} LEVEL</span>
                  <h2>{activeChallenge.title}</h2>
                </div>

                <div className="chal-header-actions">
                  <button
                    className="chal-btn builder"
                    onClick={() => handleOpenInBuilder(activeChallenge)}
                  >
                    Open Workspace in Builder →
                  </button>
                  <button
                    className="chal-btn verify"
                    onClick={() => handleVerifyActiveCircuit(activeChallenge)}
                    disabled={verifying}
                  >
                    {verifying ? "Checking truth table..." : "Verify Active Circuit"}
                  </button>
                </div>
              </div>

              {/* VERIFICATION RESULT BANNER */}
              {verifyResult && (
                <div className={`verify-banner ${verifyResult.passed ? "pass" : "fail"}`}>
                  <span className="banner-icon">{verifyResult.passed ? "✓" : "⚠"}</span>
                  <div>
                    <strong>{verifyResult.passed ? "Challenge Solved!" : "Verification Incomplete"}</strong>
                    <p>{verifyResult.message}</p>
                  </div>
                </div>
              )}

              <div className="chal-desc-card">
                <h3>Challenge Objective</h3>
                <p>{activeChallenge.description}</p>
              </div>

              {/* EXPECTED TRUTH TABLE */}
              <div className="chal-table-card">
                <h3>Target Truth Table Requirement</h3>
                <p className="sub-hint">Your circuit must match this exact state truth table for all inputs.</p>

                <div className="table-responsive-box">
                  <table className="chal-truth-table">
                    <thead>
                      <tr>
                        {Object.keys(activeChallenge.expectedTruthTable[0] || {}).map((k) => (
                          <th key={k} className={activeChallenge.inputs.includes(k) ? "in-col" : "out-col"}>
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeChallenge.expectedTruthTable.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {Object.entries(row).map(([k, val]) => (
                            <td
                              key={k}
                              className={val === 1 ? "v-1" : "v-0"}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Challenges;
