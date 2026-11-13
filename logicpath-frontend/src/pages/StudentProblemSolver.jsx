import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CircuitCanvas from "../components/CircuitCanvas";
import api from "../api/client";
import "./StudentProblemSolver.css";

export function StudentProblemSolver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Student circuit
  const [solutionNodes, setSolutionNodes] = useState([]);
  const [solutionConns, setSolutionConns] = useState([]);

  // Tabs
  const [activeTab, setActiveTab] = useState("builder");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [attemptsList, setAttemptsList] = useState([]);

  // Discussion
  const [discussions, setDiscussions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isPostingDiscussion, setIsPostingDiscussion] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No problem ID was provided.");
      setLoading(false);
      return;
    }

    loadProblemData();
  }, [id]);

  // --------------------------------------------------
  // LOAD PROBLEM
  // --------------------------------------------------

  async function loadProblemData() {
    setLoading(true);
    setError("");

    try {
      console.log("Loading student problem:", id);

      const qRes = await api.getStudentQuestion(id);

      console.log("Question API response:", qRes);

      /*
       * Different backends may return:
       *
       * { question: {...} }
       * OR
       * { data: {...} }
       * OR
       * {...question fields...}
       */

      let loadedQuestion = null;

      if (qRes?.question) {
        loadedQuestion = qRes.question;
      } else if (qRes?.data?.question) {
        loadedQuestion = qRes.data.question;
      } else if (qRes?.data) {
        loadedQuestion = qRes.data;
      } else if (qRes?._id || qRes?.id || qRes?.title) {
        loadedQuestion = qRes;
      }

      if (!loadedQuestion) {
        throw new Error(
          "The server did not return the selected problem."
        );
      }

      console.log("Loaded question:", loadedQuestion);

      setQuestion(loadedQuestion);

      // --------------------------------------------------
      // CREATE STUDENT STARTING CIRCUIT
      // --------------------------------------------------

      const originalCircuit =
        loadedQuestion.original_circuit ||
        loadedQuestion.originalCircuit ||
        loadedQuestion.circuit ||
        {};

      const originalNodes = Array.isArray(originalCircuit.nodes)
        ? originalCircuit.nodes
        : [];

      const inputNodes = originalNodes.filter(
        (node) =>
          String(node.type || "").toUpperCase() === "INPUT"
      );

      const outputNodes = originalNodes.filter(
        (node) =>
          String(node.type || "").toUpperCase() === "OUTPUT"
      );

      /*
       * If the original problem already contains input/output
       * nodes, copy those to the student's canvas.
       *
       * Otherwise create default A/B/OUT nodes.
       */

      let initialNodes = [];

      if (inputNodes.length > 0 || outputNodes.length > 0) {
        initialNodes = [
          ...inputNodes.map((node, index) => ({
            ...node,
            id: `student_input_${index}`,
            type: "INPUT",
            label:
              node.label ||
              node.name ||
              `IN ${index + 1}`,
            state: node.state ?? 0,
            x: 60,
            y: 100 + index * 100,
          })),

          ...outputNodes.map((node, index) => ({
            ...node,
            id: `student_output_${index}`,
            type: "OUTPUT",
            label:
              node.label ||
              node.name ||
              `OUT ${index + 1}`,
            x: 650,
            y: 140 + index * 100,
          })),
        ];
      } else {
        initialNodes = [
          {
            id: "student_input_0",
            type: "INPUT",
            label: "A",
            state: 0,
            x: 60,
            y: 120,
          },
          {
            id: "student_input_1",
            type: "INPUT",
            label: "B",
            state: 0,
            x: 60,
            y: 260,
          },
          {
            id: "student_output_0",
            type: "OUTPUT",
            label: "OUT",
            x: 650,
            y: 190,
          },
        ];
      }

      setSolutionNodes(initialNodes);
      setSolutionConns([]);

      // --------------------------------------------------
      // LOAD ATTEMPTS
      // --------------------------------------------------

      try {
        const attRes =
          await api.getStudentQuestionSubmissions(id);

        console.log("Attempts response:", attRes);

        if (Array.isArray(attRes)) {
          setAttemptsList(attRes);
        } else if (Array.isArray(attRes?.submissions)) {
          setAttemptsList(attRes.submissions);
        } else if (Array.isArray(attRes?.data)) {
          setAttemptsList(attRes.data);
        } else {
          setAttemptsList([]);
        }
      } catch (attemptError) {
        console.warn(
          "Could not load submission history:",
          attemptError
        );

        setAttemptsList([]);
      }

      // --------------------------------------------------
      // LOAD DISCUSSIONS
      // --------------------------------------------------

      try {
        const discRes =
          await api.getStudentDiscussions(id);

        console.log("Discussion response:", discRes);

        if (Array.isArray(discRes)) {
          setDiscussions(discRes);
        } else if (Array.isArray(discRes?.discussions)) {
          setDiscussions(discRes.discussions);
        } else if (Array.isArray(discRes?.data)) {
          setDiscussions(discRes.data);
        } else {
          setDiscussions([]);
        }
      } catch (discussionError) {
        console.warn(
          "Could not load discussions:",
          discussionError
        );

        setDiscussions([]);
      }
    } catch (err) {
      console.error(
        "Student problem loading error:",
        err
      );

      setQuestion(null);

      let message =
        "Unable to load this problem.";

      if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // SUBMIT SOLUTION
  // --------------------------------------------------

  const handleSubmitSolution = async () => {
    if (
      !solutionNodes ||
      solutionNodes.length === 0
    ) {
      alert(
        "Please build a circuit before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        submitted_circuit: {
          nodes: solutionNodes,
          connections: solutionConns,
        },
      };

      console.log(
        "Submitting solution:",
        payload
      );

      const response =
        await api.submitStudentSolution(
          id,
          payload
        );

      console.log(
        "Submission response:",
        response
      );

      setLastSubmissionResult(response);
      setShowResultModal(true);

      // Refresh attempts
      try {
        const attRes =
          await api.getStudentQuestionSubmissions(
            id
          );

        if (Array.isArray(attRes)) {
          setAttemptsList(attRes);
        } else if (
          Array.isArray(attRes?.submissions)
        ) {
          setAttemptsList(attRes.submissions);
        } else if (
          Array.isArray(attRes?.data)
        ) {
          setAttemptsList(attRes.data);
        }
      } catch (attemptError) {
        console.warn(
          "Could not refresh attempts:",
          attemptError
        );
      }
    } catch (err) {
      console.error(
        "Submission error:",
        err
      );

      alert(
        "Submission failed: " +
          (err?.message ||
            "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // POST DISCUSSION
  // --------------------------------------------------

  const handlePostQuestion = async (event) => {
    event.preventDefault();

    const message =
      newQuestionText.trim();

    if (!message) {
      return;
    }

    setIsPostingDiscussion(true);

    try {
      await api.postStudentDiscussion(
        id,
        {
          message,
        }
      );

      setNewQuestionText("");

      const discRes =
        await api.getStudentDiscussions(id);

      if (Array.isArray(discRes)) {
        setDiscussions(discRes);
      } else if (
        Array.isArray(discRes?.discussions)
      ) {
        setDiscussions(
          discRes.discussions
        );
      } else if (
        Array.isArray(discRes?.data)
      ) {
        setDiscussions(discRes.data);
      }
    } catch (err) {
      console.error(
        "Discussion error:",
        err
      );

      alert(
        "Failed to send message: " +
          (err?.message ||
            "Unknown error")
      );
    } finally {
      setIsPostingDiscussion(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="solver-page">
        <Navbar />

        <div className="solver-loading">
          <div className="loading-circle"></div>

          <h3>
            Loading problem environment...
          </h3>

          <p>
            Preparing your circuit workspace.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !question) {
    return (
      <div className="solver-page">
        <Navbar />

        <div className="solver-error">
          <div className="state-icon">
            !
          </div>

          <h3>
            Unable to load problem
          </h3>

          <p>
            {error ||
              "Question not found."}
          </p>

          <div className="error-actions">
            <button
              onClick={loadProblemData}
            >
              Try Again
            </button>

            <button
              onClick={() =>
                navigate(
                  "/student/problems"
                )
              }
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // SAFE DISPLAY VALUES
  // --------------------------------------------------

  const title =
    question.title ||
    question.name ||
    question.question ||
    "Untitled Logic Problem";

  const description =
    question.description ||
    question.question_text ||
    question.statement ||
    "Solve the digital logic problem.";

  const difficulty =
    question.difficulty ||
    "medium";

    const topic =
    question.topic ||
    question.law ||
    question.learning_topic ||
    question.boolean_law ||
    "General Logic";

  const teacherName =
    question.teacher_name ||
    question.teacherName ||
    question.created_by_name ||
    "Teacher";

  const inputVariables =
    question.input_variables ||
    question.inputs ||
    ["A", "B"];

  const originalCircuit =
    question.original_circuit ||
    question.originalCircuit ||
    question.circuit ||
    {};

  const originalNodes =
    Array.isArray(originalCircuit.nodes)
      ? originalCircuit.nodes
      : [];

  const originalConnections =
    Array.isArray(
      originalCircuit.connections
    )
      ? originalCircuit.connections
      : [];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="solver-page">
      <Navbar />

      <main className="solver-container">

        {/* HEADER */}

        <header className="solver-header-card">

          <div className="sh-left">

            <button
              className="back-link"
              onClick={() =>
                navigate(
                  "/student/problems"
                )
              }
            >
              ← Back to Problem Library
            </button>

            <div className="title-row">

              <h2>{title}</h2>

              <span
                className={`diff-pill ${String(
                  difficulty
                ).toLowerCase()}`}
              >
                {String(
                  difficulty
                ).toUpperCase()}
              </span>

              {question.user_solved && (
                <span className="solved-badge">
                  ✓ Solved
                </span>
              )}

            </div>

            <p className="problem-statement">
              {description}
            </p>

            <div className="solver-topic-badge">
            📘 {topic}
          </div>

          </div>

          <div className="sh-meta">

            <div className="sh-meta-item">
              <span className="lbl">
                Author:
              </span>

              <span className="val">
                {teacherName}
              </span>
            </div>

            <div className="sh-meta-item">
              <span className="lbl">
                Target Inputs:
              </span>

              <span className="val">
                {Array.isArray(
                  inputVariables
                )
                  ? inputVariables.join(
                      ", "
                    )
                  : String(
                      inputVariables
                    )}
              </span>
            </div>

            <div className="sh-meta-item">
              <span className="lbl">
                Your Past Attempts:
              </span>

              <span className="val">
                {attemptsList.length}
              </span>
            </div>

          </div>
        </header>

        {/* TABS */}

        <nav className="solver-tabs-nav">

          <button
            className={`sol-tab-btn ${
              activeTab === "builder"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "builder"
              )
            }
          >
            ⚡ Solve &amp; Build Circuit
          </button>

          <button
            className={`sol-tab-btn ${
              activeTab === "attempts"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "attempts"
              )
            }
          >
            📊 Submission History (
            {attemptsList.length})
          </button>

          <button
            className={`sol-tab-btn ${
              activeTab === "discussion"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "discussion"
              )
            }
          >
            💬 Ask Teacher &amp;
            Discussions (
            {discussions.length})
          </button>

        </nav>

        {/* ==================================================
            BUILDER TAB
        ================================================== */}

        {activeTab === "builder" && (
          <section className="solver-workbench-grid">

            {/* ORIGINAL CIRCUIT */}

            <div className="workbench-section-card">

              <div className="section-title-bar">

                <div>
                  <h4>
                    1. Original Circuit
                    (Problem Reference)
                  </h4>

                  <span className="hint-text">
                    Inspect the original
                    circuit before creating
                    your optimized solution.
                  </span>
                </div>

                <span className="reference-badge">
                  Reference Model
                </span>

              </div>

              {originalNodes.length > 0 ? (
                <CircuitCanvas
                  nodes={originalNodes}
                  connections={
                    originalConnections
                  }
                  readOnly={true}
                  showPalette={false}
                  title="Original Problem Circuit"
                  height="340px"
                />
              ) : (
                <div className="empty-text">
                  No original circuit was
                  provided for this problem.
                </div>
              )}

            </div>

            {/* STUDENT CIRCUIT */}

            <div className="workbench-section-card active-editor">

              <div className="section-title-bar">

                <div>
                  <h4>
                    2. Your Proposed
                    Optimized Circuit
                  </h4>

                  <span className="hint-text">
                    Build a logically
                    equivalent circuit using
                    fewer gates or lower depth.
                  </span>
                </div>

                <button
                  className="submit-solution-btn"
                  onClick={
                    handleSubmitSolution
                  }
                  disabled={
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Evaluating..."
                    : "🚀 Submit Solution"}
                </button>

              </div>

              <CircuitCanvas
                nodes={solutionNodes}
                connections={
                  solutionConns
                }
                onChange={(nodes, connections) => {
                  setSolutionNodes(
                    nodes
                  );
                  setSolutionConns(
                    connections
                  );
                }}
                readOnly={false}
                showPalette={true}
                title="Your Solution Circuit"
                height="480px"
              />

            </div>

          </section>
        )}

        {/* ==================================================
            ATTEMPTS TAB
        ================================================== */}

        {activeTab === "attempts" && (
          <section className="solver-attempts-card">

            <h3>
              Your Submission History
            </h3>

            {attemptsList.length ===
            0 ? (
              <p className="empty-text">
                No attempts submitted yet.
                Build your circuit and submit
                your solution.
              </p>
            ) : (
              <div className="attempts-table-wrap">

                <table className="eval-table">

                  <thead>
                    <tr>
                      <th>
                        Submitted At
                      </th>

                      <th>
                        Logical Equivalence
                      </th>

                      <th>
                        Gate Optimization
                      </th>

                      <th>
                        Gates
                      </th>

                      <th>
                        Depth
                      </th>

                      <th>
                        Verdict
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {attemptsList.map(
                      (attempt) => {

                        const passed =
                          attempt
                            .verification_result
                            ?.passed ===
                          true;

                        const equivalent =
                          attempt
                            .equivalence_result
                            ?.equivalent ===
                          true;

                        const optimized =
                          attempt
                            .optimization_metrics
                            ?.is_optimized ===
                          true;

                        const originalGates =
                          attempt
                            .optimization_metrics
                            ?.original_metrics
                            ?.gate_count ??
                          0;

                        const studentGates =
                          attempt
                            .optimization_metrics
                            ?.student_metrics
                            ?.gate_count ??
                          0;

                        const originalDepth =
                          attempt
                            .optimization_metrics
                            ?.original_metrics
                            ?.circuit_depth ??
                          0;

                        const studentDepth =
                          attempt
                            .optimization_metrics
                            ?.student_metrics
                            ?.circuit_depth ??
                          0;

                        const attemptId =
                          attempt.id ||
                          attempt._id ||
                          Math.random();

                        return (
                          <tr
                            key={
                              attemptId
                            }
                            className={
                              passed
                                ? "row-pass"
                                : "row-fail"
                            }
                          >

                            <td>
                              {attempt.submitted_at
                                ? new Date(
                                    attempt.submitted_at
                                  ).toLocaleString()
                                : "—"}
                            </td>

                            <td>
                              <span
                                className={`pill ${
                                  equivalent
                                    ? "pass"
                                    : "fail"
                                }`}
                              >
                                {equivalent
                                  ? "MATCH"
                                  : "MISMATCH"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`pill ${
                                  optimized
                                    ? "pass"
                                    : "fail"
                                }`}
                              >
                                {optimized
                                  ? "OPTIMIZED"
                                  : "NOT OPTIMAL"}
                              </span>
                            </td>

                            <td>
                              {originalGates}
                              {" → "}
                              <strong>
                                {studentGates}
                              </strong>
                            </td>

                            <td>
                              {originalDepth}
                              {" → "}
                              <strong>
                                {studentDepth}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`verdict-tag ${
                                  passed
                                    ? "pass"
                                    : "fail"
                                }`}
                              >
                                {passed
                                  ? "✓ SOLVED"
                                  : "✗ REVISE"}
                              </span>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>
        )}

        {/* ==================================================
            DISCUSSION TAB
        ================================================== */}

        {activeTab === "discussion" && (
          <section className="solver-discussion-card">

            <h3>
              Problem Discussion &
              Teacher Q&amp;A
            </h3>

            <p className="card-hint">
              Ask your teacher questions about
              this problem and view previous
              discussions.
            </p>

            <form
              onSubmit={
                handlePostQuestion
              }
              className="ask-teacher-form"
            >

              <textarea
                rows={3}
                placeholder="Ask your teacher a question..."
                value={
                  newQuestionText
                }
                onChange={(event) =>
                  setNewQuestionText(
                    event.target.value
                  )
                }
                disabled={
                  isPostingDiscussion
                }
              />

              <button
                type="submit"
                className="ask-btn"
                disabled={
                  isPostingDiscussion ||
                  !newQuestionText.trim()
                }
              >
                {isPostingDiscussion
                  ? "Sending..."
                  : "Send Question"}
              </button>

            </form>

            <div className="discussion-messages-list">

              {discussions.length ===
              0 ? (
                <div className="empty-disc-state">
                  <p>
                    No questions posted yet.
                    Be the first to ask!
                  </p>
                </div>
              ) : (
                discussions.map(
                  (discussion, index) => {

                    const isTeacher =
                      discussion.sender_role ===
                      "teacher";

                    return (
                      <div
                        key={
                          discussion.id ||
                          discussion._id ||
                          index
                        }
                        className={`disc-bubble ${
                          isTeacher
                            ? "teacher"
                            : "student"
                        }`}
                      >

                        <div className="bubble-header">

                          <div className="author-wrap">

                            <span
                              className={`role-badge ${
                                discussion.sender_role ||
                                "student"
                              }`}
                            >
                              {isTeacher
                                ? "👨‍🏫 Teacher"
                                : "🎓 Student"}
                            </span>

                            <span className="author-name">
                              {discussion.sender_name ||
                                "User"}
                            </span>

                          </div>

                          <span className="timestamp">
                            {discussion.created_at
                              ? new Date(
                                  discussion.created_at
                                ).toLocaleString()
                              : ""}
                          </span>

                        </div>

                        <div className="bubble-body">
                          {discussion.message ||
                            discussion.text ||
                            ""}
                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>
        )}

        {/* ==================================================
            RESULT MODAL
        ================================================== */}

        {showResultModal &&
          lastSubmissionResult && (
            <div
              className="solver-modal-overlay"
              onClick={() =>
                setShowResultModal(false)
              }
            >

              <div
                className="solver-modal-card"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div
                  className={`modal-header-banner ${
                    lastSubmissionResult.passed
                      ? "pass"
                      : "fail"
                  }`}
                >

                  <div className="m-icon">
                    {lastSubmissionResult.passed
                      ? "🎉"
                      : "⚠"}
                  </div>

                  <div>

                    <h3>
                      {lastSubmissionResult.passed
                        ? "Success! Problem Solved"
                        : "Submission Needs Improvement"}
                    </h3>

                    <p>
                      {lastSubmissionResult.feedback ||
                        "Your submission has been evaluated."}
                    </p>

                  </div>

                </div>

                <div className="modal-body-content">

                  {/* CHECKS */}

                  <div className="checks-summary-row">

                    <div
                      className={`check-card ${
                        lastSubmissionResult
                          .equivalent
                          ? "pass"
                          : "fail"
                      }`}
                    >

                      <span className="c-icon">
                        {lastSubmissionResult.equivalent
                          ? "✓"
                          : "✗"}
                      </span>

                      <div>

                        <strong>
                          Logical Equivalence
                        </strong>

                        <p>
                          {lastSubmissionResult.equivalent
                            ? "The circuit produces the expected output."
                            : "The circuit does not match the required logic."}
                        </p>

                      </div>

                    </div>

                    <div
                      className={`check-card ${
                        lastSubmissionResult
                          .is_optimized
                          ? "pass"
                          : "fail"
                      }`}
                    >

                      <span className="c-icon">
                        {lastSubmissionResult.is_optimized
                          ? "✓"
                          : "✗"}
                      </span>

                      <div>

                        <strong>
                          Optimization Target
                        </strong>

                        <p>
                          {lastSubmissionResult.is_optimized
                            ? "The circuit meets the optimization requirement."
                            : "The circuit can still be optimized."}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* METRICS */}

                  <div className="modal-metrics-card">

                    <h4>
                      Your Metrics vs
                      Original Problem
                    </h4>

                    <div className="metrics-triad">

                      <div className="triad-item">

                        <span className="t-lbl">
                          ORIGINAL GATES
                        </span>

                        <span className="t-val">
                          {lastSubmissionResult
                            .original_metrics
                            ?.gate_count ??
                            0}
                        </span>

                      </div>

                      <div className="triad-item arrow">
                        →
                      </div>

                      <div className="triad-item student">

                        <span className="t-lbl">
                          YOUR GATES
                        </span>

                        <span className="t-val">
                          {lastSubmissionResult
                            .student_metrics
                            ?.gate_count ??
                            0}
                        </span>

                      </div>

                    </div>

                    {lastSubmissionResult
                      .improvements
                      ?.gate_reduction >
                      0 && (
                      <div className="gate-saving-notice">

                        ✓ Gate Reduction:{" "}
                        {
                          lastSubmissionResult
                            .improvements
                            .gate_reduction
                        }{" "}
                        gate(s) saved (
                        {
                          lastSubmissionResult
                            .improvements
                            .gate_reduction_pct
                        }
                        %)

                      </div>
                    )}

                  </div>

                  {/* AI */}

                  {lastSubmissionResult.ai_explanation && (
                    <div className="modal-ai-explanation">

                      <div className="ai-badge-row">
                        ✨ AI Pedagogical
                        Evaluation
                      </div>

                      <pre className="ai-text-pre">
                        {
                          lastSubmissionResult
                            .ai_explanation
                        }
                      </pre>

                    </div>
                  )}

                </div>

                <div className="modal-footer-row">

                  <button
                    className="modal-close-btn"
                    onClick={() =>
                      setShowResultModal(
                        false
                      )
                    }
                  >
                    Continue Working
                  </button>

                </div>

              </div>

            </div>
          )}

      </main>
    </div>
  );
}

export default StudentProblemSolver;