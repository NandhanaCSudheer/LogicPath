import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CircuitCanvas from "../components/CircuitCanvas";
import api from "../api/client";
import "./TeacherQuestionEditor.css";

export function TeacherQuestionEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const isEditing = Boolean(id);

  /* =========================================================
     FORM STATE
     ========================================================= */

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("medium");

  const [topic, setTopic] =
    useState("Distributive Law");

  const [inputVariablesStr, setInputVariablesStr] =
    useState("A, B");

  /* =========================================================
     CIRCUIT STATE
     ========================================================= */

  const [origNodes, setOrigNodes] =
    useState([]);

  const [origConns, setOrigConns] =
    useState([]);

  const [optNodes, setOptNodes] =
    useState([]);

  const [optConns, setOptConns] =
    useState([]);

  /* =========================================================
     EDITOR STATE
     ========================================================= */

  const [editorStep, setEditorStep] =
    useState(1);

  /* =========================================================
     VERIFICATION STATE
     ========================================================= */

  const [verificationResult, setVerificationResult] =
    useState(null);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [status, setStatus] =
    useState("draft");

  const [actionMessage, setActionMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================================================
     LOAD EXISTING QUESTION
     ========================================================= */

  useEffect(() => {
    if (isEditing) {
      loadQuestion();
    }
  }, [id, isEditing]);

  async function loadQuestion() {
    try {
      setErrorMessage("");

      const res =
        await api.getTeacherQuestion(id);

      if (res.question) {
        const q = res.question;

        setTitle(
          q.title || ""
        );

        setDescription(
          q.description || ""
        );

        setDifficulty(
          q.difficulty || "medium"
        );

        setTopic(
          q.topic ||
            q.law ||
            q.learning_topic ||
            "Distributive Law"
        );

        setInputVariablesStr(
          (
            q.input_variables ||
            []
          ).join(", ")
        );

        setOrigNodes(
          q.original_circuit?.nodes ||
            []
        );

        setOrigConns(
          q.original_circuit?.connections ||
            []
        );

        setOptNodes(
          q.optimized_circuit?.nodes ||
            []
        );

        setOptConns(
          q.optimized_circuit?.connections ||
            []
        );

        setStatus(
          q.status || "draft"
        );

        if (q.verification) {
          setVerificationResult(
            q.verification
          );
        }
      }
    } catch (err) {
      setErrorMessage(
        "Failed to load question: " +
          err.message
      );
    }
  }

  /* =========================================================
     PARSE VARIABLES
     ========================================================= */

  const parseVariables = () => {
    return inputVariablesStr
      .split(",")
      .map((s) =>
        s.trim().toUpperCase()
      )
      .filter(Boolean);
  };

  /* =========================================================
     RUN VERIFICATION
     ========================================================= */

  const handleRunVerification =
    async () => {
      setIsVerifying(true);
      setErrorMessage("");
      setActionMessage("");

      try {
        const orig = {
          nodes: origNodes,
          connections: origConns,
        };

        const opt = {
          nodes: optNodes,
          connections: optConns,
        };

        let res;

        if (isEditing) {
          res =
            await api.verifyTeacherQuestion(
              id,
              {
                original_circuit:
                  orig,
                optimized_circuit:
                  opt,
              }
            );

          setVerificationResult(
            res.verification
          );
        } else {
          res =
            await api.verifyCircuits({
              original_circuit:
                orig,
              optimized_circuit:
                opt,
            });

          setVerificationResult(
            res
          );
        }

        const passed =
          res?.verification?.status ===
            "passed" ||
          res?.verification_status ===
            "PASSED" ||
          res?.status ===
            "passed";

        if (passed) {
          setActionMessage(
            "✓ AI & Deterministic Verification PASSED! Solution certified."
          );
        } else {
          setErrorMessage(
            "✗ Verification Failed. See details below."
          );
        }

        setEditorStep(4);
      } catch (err) {
        setErrorMessage(
          "Verification execution error: " +
            err.message
        );
      } finally {
        setIsVerifying(false);
      }
    };

  /* =========================================================
     SAVE DRAFT
     ========================================================= */

  const handleSaveDraft =
    async () => {
      setIsSaving(true);
      setErrorMessage("");
      setActionMessage("");

      try {
        const payload = {
          title:
            title.trim() ||
            "Untitled Logic Problem",

          description:
            description.trim(),

          category: "Boolean",

          topic,

          law: topic,

          difficulty,

          input_variables:
            parseVariables(),

          original_circuit: {
            nodes: origNodes,
            connections:
              origConns,
          },

          optimized_circuit: {
            nodes: optNodes,
            connections:
              optConns,
          },
        };

        if (isEditing) {
          await api.updateTeacherQuestion(
            id,
            payload
          );

          setActionMessage(
            "✓ Question draft saved successfully."
          );
        } else {
          const created =
            await api.createTeacherQuestion(
              payload
            );

          setActionMessage(
            "✓ Question created as draft."
          );

          navigate(
            `/teacher/edit-question/${created.question_id}`,
            {
              replace: true,
            }
          );
        }

        setTimeout(() => {
          setActionMessage("");
        }, 3500);
      } catch (err) {
        setErrorMessage(
          "Failed to save draft: " +
            err.message
        );
      } finally {
        setIsSaving(false);
      }
    };

  /* =========================================================
     PUBLISH
     ========================================================= */

  const handlePublish =
    async () => {
      const isPassed =
        verificationResult?.status ===
          "passed" ||
        verificationResult?.verification_status ===
          "PASSED";

      if (!isPassed) {
        alert(
          "Cannot publish: The problem must pass logical equivalence and optimization verification before publishing."
        );
        return;
      }

      try {
        let targetId = id;

        if (!isEditing) {
          const created =
            await api.createTeacherQuestion({
              title:
                title.trim() ||
                "Untitled Logic Problem",

              description:
                description.trim(),

              category: "Boolean",

              topic,

              law: topic,

              difficulty,

              input_variables:
                parseVariables(),

              original_circuit: {
                nodes: origNodes,
                connections:
                  origConns,
              },

              optimized_circuit: {
                nodes: optNodes,
                connections:
                  optConns,
              },
            });

          targetId =
            created.question_id;
        }

        await api.publishTeacherQuestion(
          targetId
        );

        alert(
          "🎉 Question successfully published! Students can now access and solve this problem."
        );

        navigate(
          "/teacher/dashboard"
        );
      } catch (err) {
        setErrorMessage(
          "Publishing failed: " +
            err.message
        );
      }
    };

  /* =========================================================
     VERIFICATION STATUS
     ========================================================= */

  const isVerified =
    verificationResult?.status ===
      "passed" ||
    verificationResult?.verification_status ===
      "PASSED";

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="teacher-editor-page">
      <Navbar />

      <main className="editor-main-container">

        {/* =================================================
            HEADER
            ================================================= */}

        <header className="editor-header">
          <div className="header-left">

            <button
              type="button"
              className="back-link-btn"
              onClick={() =>
                navigate(
                  "/teacher/dashboard"
                )
              }
            >
              ← Back to Teacher Dashboard
            </button>

            <h2>
              {isEditing
                ? "Edit & Verify Problem"
                : "Create New Digital Logic Problem"}
            </h2>

            <div className="editor-status-pill">
              Status:{" "}
              <strong>
                {status.toUpperCase()}
              </strong>
            </div>
          </div>

          <div className="header-actions">

            <button
              type="button"
              className="action-btn draft-btn"
              onClick={
                handleSaveDraft
              }
              disabled={isSaving}
            >
              💾 Save Draft
            </button>

            <button
              type="button"
              className="action-btn verify-btn"
              onClick={
                handleRunVerification
              }
              disabled={isVerifying}
            >
              {isVerifying
                ? "Running Engine..."
                : "⚡ Run AI Verification"}
            </button>

            <button
              type="button"
              className={`action-btn publish-btn ${
                isVerified
                  ? "enabled"
                  : "disabled"
              }`}
              onClick={
                handlePublish
              }
              disabled={
                !isVerified
              }
              title={
                isVerified
                  ? "Publish question for students"
                  : "Must pass verification first"
              }
            >
              🚀 Publish Problem
            </button>

          </div>
        </header>

        {/* =================================================
            ALERTS
            ================================================= */}

        {actionMessage && (
          <div className="editor-alert-banner success">
            {actionMessage}
          </div>
        )}

        {errorMessage && (
          <div className="editor-alert-banner error">
            {errorMessage}
          </div>
        )}

        {/* =================================================
            WORKFLOW TABS
            ================================================= */}

        <nav className="workflow-steps-nav">

          <button
            type="button"
            className={`step-btn ${
              editorStep === 1
                ? "active"
                : ""
            }`}
            onClick={() =>
              setEditorStep(1)
            }
          >
            <span className="step-num">
              1
            </span>

            <span className="step-txt">
              Question Details
            </span>
          </button>

          <button
            type="button"
            className={`step-btn ${
              editorStep === 2
                ? "active"
                : ""
            }`}
            onClick={() =>
              setEditorStep(2)
            }
          >
            <span className="step-num">
              2
            </span>

            <span className="step-txt">
              Original Problem Circuit
            </span>
          </button>

          <button
            type="button"
            className={`step-btn ${
              editorStep === 3
                ? "active"
                : ""
            }`}
            onClick={() =>
              setEditorStep(3)
            }
          >
            <span className="step-num">
              3
            </span>

            <span className="step-txt">
              Teacher's Optimized Circuit
            </span>
          </button>

          <button
            type="button"
            className={`step-btn ${
              editorStep === 4
                ? "active"
                : ""
            }`}
            onClick={() =>
              setEditorStep(4)
            }
          >
            <span className="step-num">
              4
            </span>

            <span className="step-txt">
              AI Verification Results{" "}
              {isVerified
                ? "✓"
                : ""}
            </span>
          </button>

        </nav>

        {/* =================================================
            STEP 1
            ================================================= */}

        {editorStep === 1 && (
          <section className="editor-card step-details-card">

            <h3>
              Step 1: Enter Problem Specifications
            </h3>

            <p className="card-hint">
              Provide context for students,
              including learning objectives,
              expected input variables, and
              difficulty rating.
            </p>

            <div className="editor-form-grid">

              <div className="form-field full-width">
                <label>
                  Problem Title *
                </label>

                <input
                  type="text"
                  placeholder="e.g., Boolean Absorption Law Optimization"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-field full-width">
                <label>
                  Problem Description &amp;
                  Instructions *
                </label>

                <textarea
                  rows={4}
                  placeholder="Explain what Boolean logic or digital design concept the student is practicing..."
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Difficulty Level
                </label>

                <select
                  value={
                    difficulty
                  }
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value
                    )
                  }
                >
                  <option value="easy">
                    Easy (1 - 2 gates simplification)
                  </option>

                  <option value="medium">
                    Medium (Multi-level algebra / De Morgan)
                  </option>

                  <option value="hard">
                    Hard (Multi-output or complex SOP/POS)
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  Boolean Law / Learning Topic *
                </label>

                <select
                  value={topic}
                  onChange={(e) =>
                    setTopic(
                      e.target.value
                    )
                  }
                >
                  <option value="Distributive Law">
                    Distributive Law
                  </option>

                  <option value="Commutative Law">
                    Commutative Law
                  </option>

                  <option value="Associative Law">
                    Associative Law
                  </option>

                  <option value="Identity Law">
                    Identity Law
                  </option>

                  <option value="Null/Domination Law">
                    Null / Domination Law
                  </option>

                  <option value="Idempotent Law">
                    Idempotent Law
                  </option>

                  <option value="Complement Law">
                    Complement Law
                  </option>

                  <option value="Involution Law">
                    Involution Law
                  </option>

                  <option value="Absorption Law">
                    Absorption Law
                  </option>

                  <option value="De Morgan's Laws">
                    De Morgan's Laws
                  </option>

                  <option value="Consensus Theorem">
                    Consensus Theorem
                  </option>

                  <option value="Boolean Simplification">
                    Boolean Simplification
                  </option>

                  <option value="Logic Gates">
                    Logic Gates
                  </option>

                  <option value="Circuit Optimization">
                    Circuit Optimization
                  </option>

                  <option value="K-Map Basics">
                    K-Map Basics
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  Input Variable Names
                  (comma separated)
                </label>

                <input
                  type="text"
                  placeholder="A, B, C"
                  value={
                    inputVariablesStr
                  }
                  onChange={(e) =>
                    setInputVariablesStr(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            <div className="card-footer-nav">
              <button
                type="button"
                className="step-next-btn"
                onClick={() =>
                  setEditorStep(2)
                }
              >
                Proceed to Original Circuit →
              </button>
            </div>

          </section>
        )}

        {/* =================================================
            STEP 2 - ORIGINAL CIRCUIT
            ================================================= */}

        {editorStep === 2 && (
          <section className="editor-card canvas-step-card">

            <div className="card-header-flex">

              <div>
                <h3>
                  Step 2: Construct Original
                  (Problem) Circuit
                </h3>

                <p className="card-hint">
                  This is the unoptimized
                  circuit students will see
                  and attempt to simplify.
                  Connect INPUTs, logic gates,
                  and OUTPUTs.
                </p>
              </div>

              <button
                type="button"
                className="step-next-btn"
                onClick={() =>
                  setEditorStep(3)
                }
              >
                Next: Teacher's Optimized
                Circuit →
              </button>

            </div>

            <CircuitCanvas
              nodes={origNodes}
              connections={
                origConns
              }
              onChange={(
                newNodes,
                newConnections
              ) => {
                setOrigNodes(
                  newNodes
                );

                setOrigConns(
                  newConnections
                );
              }}
              title="Original Problem Circuit (Editable)"
              height="500px"
            />

          </section>
        )}

        {/* =================================================
            STEP 3 - OPTIMIZED CIRCUIT
            ================================================= */}

        {editorStep === 3 && (
          <section className="editor-card canvas-step-card">

            <div className="card-header-flex">

              <div>
                <h3>
                  Step 3: Provide Expected
                  Optimized Circuit
                </h3>

                <p className="card-hint">
                  The teacher is the authority
                  who specifies the expected
                  minimal logic. The system
                  uses AI &amp; deterministic
                  simulation to verify
                  equivalence and metrics
                  improvement before publishing.
                </p>
              </div>

              <button
                type="button"
                className="step-next-btn accent-verify"
                onClick={
                  handleRunVerification
                }
                disabled={
                  isVerifying
                }
              >
                {isVerifying
                  ? "Verifying..."
                  : "⚡ Run Verification Now →"}
              </button>

            </div>

            <CircuitCanvas
              nodes={optNodes}
              connections={
                optConns
              }
              onChange={(
                newNodes,
                newConnections
              ) => {
                setOptNodes(
                  newNodes
                );

                setOptConns(
                  newConnections
                );
              }}
              title="Teacher Provided Optimized Circuit (Editable)"
              height="500px"
            />

          </section>
        )}

        {/* =================================================
            STEP 4 - VERIFICATION
            ================================================= */}

        {editorStep === 4 && (
          <section className="editor-card verification-step-card">

            <div className="card-header-flex">

              <div>
                <h3>
                  Step 4: AI &amp;
                  Deterministic Circuit
                  Verification
                </h3>

                <p className="card-hint">
                  Side-by-side comparison
                  of Original vs Optimized
                  circuits. All 2^N input
                  vectors are evaluated
                  deterministically.
                </p>
              </div>

              <button
                type="button"
                className="action-btn verify-btn"
                onClick={
                  handleRunVerification
                }
                disabled={
                  isVerifying
                }
              >
                {isVerifying
                  ? "Re-evaluating..."
                  : "⚡ Re-run Verification"}
              </button>

            </div>

            {verificationResult ? (
              <div className="verification-results-panel">

                {/* STATUS SUMMARY */}

                <div
                  className={`verification-summary-banner ${
                    isVerified
                      ? "pass"
                      : "fail"
                  }`}
                >
                  <div className="banner-icon">
                    {isVerified
                      ? "✓"
                      : "✗"}
                  </div>

                  <div className="banner-text">
                    <h4>
                      {isVerified
                        ? "VERIFICATION CERTIFIED: Ready to Publish"
                        : "VERIFICATION FAILED: Revisions Required"}
                    </h4>

                    <p>
                      {
                        verificationResult.message
                      }
                    </p>
                  </div>
                </div>

                {/* THREE PILLARS */}

                <div className="verification-pillars-grid">

                  <div
                    className={`pillar-card ${
                      verificationResult.equivalent
                        ? "pass"
                        : "fail"
                    }`}
                  >
                    <span className="pillar-icon">
                      {verificationResult.equivalent
                        ? "✓"
                        : "✗"}
                    </span>

                    <div className="pillar-details">
                      <h5>
                        1. Logical Equivalence
                      </h5>

                      <p>
                        {verificationResult.equivalent
                          ? "100% Truth-table match across all 2^N input states."
                          : "Outputs differed for one or more input combinations."}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`pillar-card ${
                      verificationResult.optimized
                        ? "pass"
                        : "fail"
                    }`}
                  >
                    <span className="pillar-icon">
                      {verificationResult.optimized
                        ? "✓"
                        : "✗"}
                    </span>

                    <div className="pillar-details">
                      <h5>
                        2. Optimization Check
                      </h5>

                      <p>
                        {verificationResult.optimized
                          ? "Satisfies gate count, logic depth, or silicon cost reduction."
                          : "Does not improve measurable circuit metrics."}
                      </p>
                    </div>
                  </div>

                  <div className="pillar-card pass">
                    <span className="pillar-icon">
                      ✓
                    </span>

                    <div className="pillar-details">
                      <h5>
                        3. AI Pedagogical Analysis
                      </h5>

                      <p>
                        Certified logic structure
                        and transformation
                        explanation generated.
                      </p>
                    </div>
                  </div>

                </div>

                {/* METRICS */}

                <div className="metrics-comparison-box">

                  <h4>
                    Circuit Metrics Comparison
                    (Original vs Optimized)
                  </h4>

                  <div className="metrics-side-by-side">

                    <div className="metrics-column">

                      <span className="column-title">
                        ORIGINAL CIRCUIT
                      </span>

                      <div className="metric-row">
                        <span>
                          Total Gates:
                        </span>

                        <strong>
                          {verificationResult.original_metrics?.gate_count ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Circuit Depth
                          (Delay):
                        </span>

                        <strong>
                          {verificationResult.original_metrics?.circuit_depth ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Connections
                          (Wires):
                        </span>

                        <strong>
                          {verificationResult.original_metrics?.connection_count ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Silicon Gate Cost:
                        </span>

                        <strong>
                          {verificationResult.original_metrics?.estimated_gate_cost ??
                            0}
                        </strong>
                      </div>

                    </div>

                    <div className="metrics-diff-column">

                      <span className="column-title">
                        IMPROVEMENTS
                      </span>

                      <div className="diff-pill">
                        {
                          verificationResult.improvements?.gate_reduction ??
                          0
                        }{" "}
                        fewer gates (
                        {
                          verificationResult.improvements?.gate_reduction_pct ??
                          0
                        }
                        %)
                      </div>

                      <div className="diff-pill">
                        {
                          verificationResult.improvements?.depth_reduction ??
                          0
                        }{" "}
                        lower depth (
                        {
                          verificationResult.improvements?.depth_reduction_pct ??
                          0
                        }
                        %)
                      </div>

                      <div className="diff-pill">
                        {
                          verificationResult.improvements?.connection_reduction ??
                          0
                        }{" "}
                        fewer wires
                      </div>

                    </div>

                    <div className="metrics-column optimal">

                      <span className="column-title">
                        TEACHER OPTIMIZED
                      </span>

                      <div className="metric-row">
                        <span>
                          Total Gates:
                        </span>

                        <strong>
                          {verificationResult.optimized_metrics?.gate_count ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Circuit Depth
                          (Delay):
                        </span>

                        <strong>
                          {verificationResult.optimized_metrics?.circuit_depth ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Connections
                          (Wires):
                        </span>

                        <strong>
                          {verificationResult.optimized_metrics?.connection_count ??
                            0}
                        </strong>
                      </div>

                      <div className="metric-row">
                        <span>
                          Silicon Gate Cost:
                        </span>

                        <strong>
                          {verificationResult.optimized_metrics?.estimated_gate_cost ??
                            0}
                        </strong>
                      </div>

                    </div>

                  </div>
                </div>

                {/* FAILING CASE */}

                {verificationResult.failing_case && (
                  <div className="failing-case-box">

                    <h4>
                      ⚠ Discrepancy Vector
                      Identified
                    </h4>

                    <p>
                      Input combination:{" "}
                      <code>
                        {
                          verificationResult
                            .failing_case
                            .state_description
                        }
                      </code>
                    </p>

                    <p>
                      Expected output:{" "}
                      <strong>
                        {
                          verificationResult
                            .failing_case
                            .expected_output
                        }
                      </strong>
                      , but candidate circuit
                      produced:{" "}
                      <strong>
                        {
                          verificationResult
                            .failing_case
                            .actual_output
                        }
                      </strong>
                    </p>

                    <button
                      type="button"
                      className="edit-opt-jump-btn"
                      onClick={() =>
                        setEditorStep(3)
                      }
                    >
                      ✏ Edit Optimized Circuit
                      in Step 3
                    </button>

                  </div>
                )}

                {/* AI EXPLANATION */}

                {verificationResult.ai_explanation && (
                  <div className="ai-explanation-box">

                    <div className="ai-header">
                      <span className="ai-sparkle">
                        ✨
                      </span>

                      <h4>
                        AI Circuit Analysis
                        &amp; Pedagogical Notes
                      </h4>
                    </div>

                    <pre className="ai-text">
                      {
                        verificationResult.ai_explanation
                      }
                    </pre>

                  </div>
                )}

                {/* PUBLISH */}

                <div className="verification-publish-footer">

                  <div className="publish-notice">
                    {isVerified ? (
                      <span className="ready-text">
                        ✓ All verification
                        criteria satisfied.
                        Ready for student
                        access.
                      </span>
                    ) : (
                      <span className="not-ready-text">
                        ⚠ You must fix
                        circuit errors or
                        satisfy optimization
                        criteria before
                        publishing.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`action-btn publish-btn large ${
                      isVerified
                        ? "enabled"
                        : "disabled"
                    }`}
                    onClick={
                      handlePublish
                    }
                    disabled={
                      !isVerified
                    }
                  >
                    🚀 Publish Question Now
                  </button>

                </div>

              </div>
            ) : (
              <div className="no-verification-yet">

                <p>
                  Verification has not
                  been executed yet for
                  this question.
                </p>

                <button
                  type="button"
                  className="action-btn verify-btn"
                  onClick={
                    handleRunVerification
                  }
                  disabled={
                    isVerifying
                  }
                >
                  ⚡ Run AI &amp;
                  Deterministic Verification
                  Now
                </button>

              </div>
            )}

          </section>
        )}
      </main>
    </div>
  );
}

export default TeacherQuestionEditor;