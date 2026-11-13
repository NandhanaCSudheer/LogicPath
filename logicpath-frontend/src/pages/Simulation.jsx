import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./Simulation.css";

function Simulation() {
  const navigate = useNavigate();

  const [circuitData, setCircuitData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [inputStates, setInputStates] = useState({});
  const [simResults, setSimResults] = useState(null);
  const [truthTable, setTruthTable] = useState(null);
  const [booleanExpressions, setBooleanExpressions] = useState(null);
  const [savedCircuits, setSavedCircuits] = useState([]);
  const [presetExamples, setPresetExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initSimulationData();
  }, []);

  const initSimulationData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch user cloud circuits and preset library in parallel
      const [circRes, exRes] = await Promise.all([
        api.listCircuits().catch(() => ({ circuits: [] })),
        api.getExamples().catch(() => ({ examples: [] })),
      ]);

      const cloudCircs = circRes.circuits || [];
      const presets = exRes.examples || [];
      setSavedCircuits(cloudCircs);
      setPresetExamples(presets);

      // Check active circuit from storage
      let active = null;
      const raw = localStorage.getItem("logicpath_active_circuit");
      if (raw) {
        try {
          active = JSON.parse(raw);
        } catch {}
      }

      if (!active || !active.nodes || active.nodes.length === 0) {
        // Default to first preset (e.g. Half Adder) if no active circuit
        active = presets[0] || cloudCircs[0] || null;
      }

      if (active && active.nodes && active.nodes.length > 0) {
        applyCircuitToSimulation(active);
      } else {
        setError("No circuit available to simulate. Design one in Builder or select a preset.");
      }
    } catch (err) {
      setError("Failed to load simulation environment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyCircuitToSimulation = (circuit) => {
    setError("");
    setCircuitData(circuit);
    setNodes(circuit.nodes || []);
    setConnections(circuit.connections || []);

    // Save as active circuit
    localStorage.setItem("logicpath_active_circuit", JSON.stringify(circuit));
    localStorage.setItem("logicpathCircuit", JSON.stringify(circuit.nodes || []));

    // Initialize inputs
    const initialInputs = {};
    (circuit.nodes || [])
      .filter((n) => n.type === "INPUT")
      .forEach((n) => {
        initialInputs[n.id] = n.state ?? 0;
      });
    setInputStates(initialInputs);

    // Run simulation, truth table and expressions
    runSimulation(circuit.nodes || [], circuit.connections || [], initialInputs);
    generateTable(circuit.nodes || [], circuit.connections || []);
    generateExpressions(circuit.nodes || [], circuit.connections || []);
  };

  const handleSelectCircuit = (e) => {
    const selectedVal = e.target.value;
    const found =
      savedCircuits.find((c) => c.id === selectedVal || c.name === selectedVal) ||
      presetExamples.find((ex) => ex.id === selectedVal || ex.name === selectedVal);

    if (found) {
      applyCircuitToSimulation(found);
    }
  };

  const runSimulation = async (currNodes, currConns, inVals) => {
    try {
      const res = await api.simulateCircuit({
        nodes: currNodes,
        connections: currConns,
        input_values: inVals,
      });

      if (res.success) {
        setSimResults(res);
      } else {
        setError(res.errors?.[0] || "Simulation evaluation error.");
      }
    } catch (err) {
      setError("Simulation connection error: " + err.message);
    }
  };

  const generateTable = async (currNodes, currConns) => {
    try {
      const res = await api.generateTruthTable({
        nodes: currNodes,
        connections: currConns,
      });
      if (res.success) {
        setTruthTable(res);
      }
    } catch {}
  };

  const generateExpressions = async (currNodes, currConns) => {
    try {
      const res = await api.generateBooleanExpression({
        nodes: currNodes,
        connections: currConns,
      });
      if (res.success) {
        setBooleanExpressions(res.expressions);
      }
    } catch {}
  };

  const handleToggleInput = (nodeId) => {
    const nextInputs = {
      ...inputStates,
      [nodeId]: inputStates[nodeId] === 1 ? 0 : 1,
    };
    setInputStates(nextInputs);
    runSimulation(nodes, connections, nextInputs);
  };

  const handleResetInputs = () => {
    const reset = {};
    Object.keys(inputStates).forEach((k) => (reset[k] = 0));
    setInputStates(reset);
    runSimulation(nodes, connections, reset);
  };

  const inputNodes = nodes.filter((n) => n.type === "INPUT");
  const outputNodes = nodes.filter((n) => n.type === "OUTPUT");
  const gateNodes = nodes.filter((n) => !["INPUT", "OUTPUT"].includes(n.type));

  return (
    <div className="simulation-page">
      <Navbar />

      <main className="simulation-content">
        {/* HEADER */}
        <div className="simulation-top-bar">
          <div>
            <span className="sim-eyebrow">REAL-TIME EVALUATION</span>
            <h1>{circuitData?.name || "Circuit Simulation"}</h1>
            <p className="sim-sub">
              Dynamic multi-level logic analysis, live state toggling, and verified truth table.
            </p>
          </div>

          <div className="sim-actions-group">
            <div className="sim-circuit-select-wrapper">
              <label htmlFor="sim-select" className="sim-select-label">Circuit:</label>
              <select
                id="sim-select"
                className="sim-circuit-select"
                value={circuitData?.id || circuitData?.name || ""}
                onChange={handleSelectCircuit}
              >
                {savedCircuits.length > 0 && (
                  <optgroup label="Your Cloud Circuits">
                    {savedCircuits.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nodes?.length || 0} nodes)
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Standard Presets">
                  {presetExamples.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button className="sim-btn secondary" onClick={handleResetInputs}>
              ↺ Reset Inputs (All 0)
            </button>
            <button className="sim-btn primary" onClick={() => navigate("/build")}>
              ← Edit in Builder
            </button>
          </div>
        </div>

        {error && <div className="sim-error-banner">{error}</div>}

        {/* STATUS BANNER */}
        {simResults && (
          <div className="simulation-success">
            ✓ Circuit simulated successfully — {inputNodes.length} input(s) detected,{" "}
            {gateNodes.length} gate(s), and {outputNodes.length} output(s) evaluated in topological order.
          </div>
        )}

        <div className="simulation-layout">
          {/* LEFT: LIVE CONTROLLER & CIRCUIT PREVIEW */}
          <section className="sim-left-panel">
            {/* INPUT CONTROLLER CARD */}
            <div className="sim-card">
              <h3>INPUT CONTROLS (Click to Toggle)</h3>
              <p className="card-sub">Change input binary signals to observe downstream logic response.</p>

              {inputNodes.length === 0 ? (
                <p className="empty-hint">No INPUT nodes in this circuit.</p>
              ) : (
                <div className="input-toggle-grid">
                  {inputNodes.map((node) => {
                    const val = inputStates[node.id] ?? 0;
                    return (
                      <div
                        key={node.id}
                        className={`input-toggle-item ${val === 1 ? "is-one" : "is-zero"}`}
                        onClick={() => handleToggleInput(node.id)}
                      >
                        <span className="input-label">{node.label || node.id}</span>
                        <span className="input-value-box">{val}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* INTERMEDIATE LOGIC GATES */}
            {gateNodes.length > 0 && (
              <div className="sim-card">
                <h3>INTERMEDIATE LOGIC GATES</h3>
                <p className="card-sub">Computed internal gate states along the topological path.</p>
                <div className="gate-states-grid">
                  {gateNodes.map((node) => {
                    const label = node.label || node.id;
                    const val = simResults?.node_values?.[node.id] ?? 0;
                    return (
                      <div key={node.id} className="gate-state-item">
                        <div className="gate-state-header">
                          <span className="gate-type-tag">{node.type}</span>
                          <span className="gate-label-text">{label}</span>
                        </div>
                        <div className={`gate-val-pill ${val === 1 ? "high" : "low"}`}>
                          {val === 1 ? "1 (HIGH)" : "0 (LOW)"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OUTPUT SIGNALS CARD */}
            <div className="sim-card">
              <h3>COMPUTED OUTPUT RESULTS</h3>
              <p className="card-sub">Final evaluated logic outputs produced by the circuit.</p>

              {outputNodes.length === 0 ? (
                <p className="empty-hint">No OUTPUT nodes in this circuit.</p>
              ) : (
                <div className="output-results-grid">
                  {outputNodes.map((node) => {
                    const label = node.label || node.id;
                    const val = simResults?.node_values?.[node.id] ?? 0;
                    return (
                      <div key={node.id} className="output-result-item">
                        <span className="output-label">{label}</span>
                        <div className={`output-value-badge ${val === 1 ? "high" : "low"}`}>
                          {val === 1 ? "1 (HIGH)" : "0 (LOW)"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BOOLEAN EXPRESSIONS CARD */}
            {booleanExpressions && Object.keys(booleanExpressions).length > 0 && (
              <div className="sim-card">
                <h3>BOOLEAN EXPRESSIONS</h3>
                {Object.entries(booleanExpressions).map(([outLbl, expr]) => (
                  <div key={outLbl} className="expr-display-item">
                    <span className="expr-out-title">{outLbl} =</span>
                    <div className="expr-badges">
                      <code>{expr.standard || expr.verbose}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: DYNAMIC TRUTH TABLE */}
          <section className="sim-right-panel">
            <div className="sim-card full-height">
              <div className="card-header-with-badge">
                <h3>DYNAMIC TRUTH TABLE</h3>
                {truthTable?.rows && (
                  <span className="badge-count">
                    {truthTable.rows.length} Combinations (2<sup>{truthTable.input_headers?.length}</sup>)
                  </span>
                )}
              </div>

              <p className="card-sub">
                Complete state space generated through algorithmic evaluation. Current active state is highlighted.
              </p>

              {truthTable?.rows ? (
                <div className="truth-table-scroll-box">
                  <table className="truth-table">
                    <thead>
                      <tr>
                        {truthTable.input_headers?.map((h) => (
                          <th key={h} className="col-in">{h}</th>
                        ))}
                        {truthTable.output_headers?.map((h) => (
                          <th key={h} className="col-out">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {truthTable.rows.map((row, rIdx) => {
                        // Check if this row matches the currently active inputs
                        const isActiveRow = truthTable.input_headers.every(
                          (h) => {
                            const matchingNode = inputNodes.find((n) => (n.label || n.id) === h);
                            const activeVal = matchingNode ? inputStates[matchingNode.id] : 0;
                            return row[h] === activeVal;
                          }
                        );

                        return (
                          <tr key={rIdx} className={isActiveRow ? "active-sim-row" : ""}>
                            {truthTable.input_headers.map((h) => (
                              <td key={h} className="cell-in">{row[h]}</td>
                            ))}
                            {truthTable.output_headers.map((h) => (
                              <td
                                key={h}
                                className={`cell-out ${row[h] === 1 ? "val-1" : "val-0"}`}
                              >
                                {row[h]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-hint">Add inputs and outputs to generate truth table.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Simulation;