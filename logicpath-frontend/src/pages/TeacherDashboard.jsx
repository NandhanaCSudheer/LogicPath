import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/client";
import "./TeacherDashboard.css";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("questions");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [actionMessage, setActionMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================
  // SUBMISSIONS & DISCUSSIONS
  // ============================================

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [discussionsList, setDiscussionsList] = useState([]);

  const [replyText, setReplyText] = useState({});
  const [isReplying, setIsReplying] = useState(false);

  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [discussionsLoading, setDiscussionsLoading] = useState(false);

  // ============================================
  // INITIAL DASHBOARD LOAD
  // ============================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    try {
      const [qRes, statsRes] = await Promise.all([
        api.listTeacherQuestions(),
        api.getTeacherStats().catch(() => ({ stats: null })),
      ]);

      console.log("Teacher questions response:", qRes);
      console.log("Teacher stats response:", statsRes);

      if (qRes?.questions) {
        setQuestions(qRes.questions);
      } else {
        setQuestions([]);
      }

      if (statsRes?.stats) {
        setStats(statsRes.stats);
      } else {
        setStats(null);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        "Failed to load teacher dashboard: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // PUBLISH
  // ============================================

  const handlePublish = async (questionId) => {
    try {
      await api.publishTeacherQuestion(questionId);

      setActionMessage(
        "✓ Question published! Students can now access this problem."
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, status: "published" }
            : q
        )
      );

      // Refresh stats
      try {
        const statsRes = await api.getTeacherStats();
        if (statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (statsError) {
        console.warn(
          "Could not refresh teacher stats:",
          statsError
        );
      }

      setTimeout(() => {
        setActionMessage("");
      }, 4000);
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Publish failed: " + err.message);
    }
  };

  // ============================================
  // UNPUBLISH
  // ============================================

  const handleUnpublish = async (questionId) => {
    try {
      await api.unpublishTeacherQuestion(questionId);

      setActionMessage(
        "Question unpublished (archived from students)."
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, status: "unpublished" }
            : q
        )
      );

      // Refresh stats
      try {
        const statsRes = await api.getTeacherStats();
        if (statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (statsError) {
        console.warn(
          "Could not refresh teacher stats:",
          statsError
        );
      }

      setTimeout(() => {
        setActionMessage("");
      }, 4000);
    } catch (err) {
      console.error("Unpublish failed:", err);
      alert("Unpublish failed: " + err.message);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteTeacherQuestion(questionId);

      setQuestions((prev) =>
        prev.filter((q) => q.id !== questionId)
      );

      setActionMessage("Question deleted.");

      // Refresh stats
      try {
        const statsRes = await api.getTeacherStats();

        if (statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (statsError) {
        console.warn(
          "Could not refresh teacher stats:",
          statsError
        );
      }

      setTimeout(() => {
        setActionMessage("");
      }, 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  // ============================================
  // VIEW SUBMISSIONS FOR ONE QUESTION
  // ============================================

  const handleViewSubmissions = async (question) => {
    setSelectedQuestion(question);
    setActiveTab("submissions");
    setSubmissionsLoading(true);
    setSubmissionsList([]);

    try {
      console.log(
        "Loading submissions for question:",
        question.id
      );

      const res = await api.getQuestionSubmissions(
        question.id
      );

      console.log(
        "Question submissions response:",
        res
      );

      setSubmissionsList(
        Array.isArray(res?.submissions)
          ? res.submissions
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load question submissions:",
        err
      );

      setSubmissionsList([]);

      alert(
        "Failed to load submissions: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // ============================================
  // VIEW ALL TEACHER SUBMISSIONS
  // ============================================

  const handleViewAllSubmissions = async () => {
    setSelectedQuestion(null);
    setActiveTab("submissions");
    setSubmissionsLoading(true);
    setSubmissionsList([]);

    try {
      console.log(
        "Loading all teacher submissions..."
      );

      const res =
        await api.getAllTeacherSubmissions();

      console.log(
        "All teacher submissions response:",
        res
      );

      setSubmissionsList(
        Array.isArray(res?.submissions)
          ? res.submissions
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load all submissions:",
        err
      );

      setSubmissionsList([]);

      alert(
        "Failed to load submissions: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // ============================================
  // VIEW DISCUSSIONS
  // ============================================

  const handleViewDiscussions = async (question) => {
    setSelectedQuestion(question);
    setActiveTab("inquiries");
    setDiscussionsLoading(true);
    setDiscussionsList([]);

    try {
      console.log(
        "Loading discussions for:",
        question.id
      );

      const res = await api.getTeacherDiscussions(
        question.id
      );

      console.log(
        "Teacher discussions response:",
        res
      );

      setDiscussionsList(
        Array.isArray(res?.discussions)
          ? res.discussions
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load inquiries:",
        err
      );

      setDiscussionsList([]);

      alert(
        "Failed to load inquiries: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setDiscussionsLoading(false);
    }
  };

  // ============================================
  // SEND TEACHER REPLY
  // ============================================

  const handleSendReply = async (discId) => {
    const text = replyText[discId];

    if (
      !text ||
      !text.trim() ||
      !selectedQuestion
    ) {
      return;
    }

    setIsReplying(true);

    try {
      await api.replyTeacherDiscussion(
        selectedQuestion.id,
        {
          message: text.trim(),
          reply_to: discId,
        }
      );

      setReplyText((prev) => ({
        ...prev,
        [discId]: "",
      }));

      const res =
        await api.getTeacherDiscussions(
          selectedQuestion.id
        );

      setDiscussionsList(
        Array.isArray(res?.discussions)
          ? res.discussions
          : []
      );

      setActionMessage(
        "Reply sent to student!"
      );

      setTimeout(() => {
        setActionMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to send reply:",
        err
      );

      alert(
        "Failed to send reply: " +
          (err?.message || "Unknown error")
      );
    } finally {
      setIsReplying(false);
    }
  };

  // ============================================
  // FILTER QUESTIONS
  // ============================================

  const filteredQuestions = questions.filter((q) => {
  const title = q?.title || "";
  const description = q?.description || "";

  const normalizedStatus =
    String(q?.status || "")
      .trim()
      .toLowerCase();

  const verificationStatus =
    String(q?.verification?.status || "")
      .trim()
      .toLowerCase();

  const isVerified =
    verificationStatus === "passed" ||
    q?.verification?.equivalent === true;

  let matchesStatus = true;

  switch (statusFilter) {
  case "published":
    matchesStatus =
      normalizedStatus === "published";
    break;

  case "verified":
  matchesStatus = isVerified;
  break;

  case "draft":
    matchesStatus =
      normalizedStatus === "draft";
    break;

  case "all":
  default:
    matchesStatus = true;
    break;
}

  const search =
    searchQuery.trim().toLowerCase();

  const matchesSearch =
    !search ||
    title.toLowerCase().includes(search) ||
    description.toLowerCase().includes(search);

  return matchesStatus && matchesSearch;
});

  // ============================================
  // VERIFICATION HELPERS
  // ============================================

  const isQuestionVerified = (question) => {
    return (
      question?.verification?.status ===
        "passed" ||
      (
        question?.verification
          ?.equivalent === true &&
        question?.verification
          ?.optimized === true
      )
    );
  };

  const getOriginalGateCount = (question) => {
    const metrics =
      question?.verification?.metrics;

    if (
      metrics?.original_gate_count !==
      undefined
    ) {
      return metrics.original_gate_count;
    }

    if (
      metrics?.original_metrics
        ?.gate_count !== undefined
    ) {
      return metrics.original_metrics.gate_count;
    }

    return null;
  };

  const getOptimizedGateCount = (question) => {
    const metrics =
      question?.verification?.metrics;

    if (
      metrics?.optimized_gate_count !==
      undefined
    ) {
      return metrics.optimized_gate_count;
    }

    if (
      metrics?.optimized_metrics
        ?.gate_count !== undefined
    ) {
      return metrics.optimized_metrics.gate_count;
    }

    return null;
  };

  return (
    <div className="teacher-dashboard-page">
      <Navbar />

      <main className="teacher-dashboard-content">

        {/* ==========================================
            HERO SECTION
        ========================================== */}

        <section className="teacher-hero-card">
          <div className="hero-text-col">
            <span className="hero-pill">
              TEACHER PORTAL
            </span>

            <h1>
              Digital Logic Curriculum &amp;
              Problem Studio
            </h1>

            <p>
              Author logic problems with
              problem and optimal circuits,
              certify solutions using our
              deterministic &amp; AI-assisted
              verification engine, and review
              student progress.
            </p>
          </div>

          <div className="hero-actions-col">
            <button
              className="create-problem-hero-btn"
              onClick={() =>
                navigate(
                  "/teacher/create-question"
                )
              }
            >
              + Create New Problem
            </button>
          </div>
        </section>

        {/* ==========================================
            METRICS ROW
        ========================================== */}

        <section className="teacher-stats-row">

          <div className="teacher-stat-box">
            <span className="stat-label">
              TOTAL PROBLEMS
            </span>

            <span className="stat-val">
              {stats?.total_questions ??
                questions.length}
            </span>

            <span className="stat-sub">
              Authored questions
            </span>
          </div>

          <div className="teacher-stat-box">
            <span className="stat-label">
              PUBLISHED
            </span>

            <span className="stat-val accent-green">
              {stats?.published_questions ??
                questions.filter(
                  (q) =>
                    q.status ===
                    "published"
                ).length}
            </span>

            <span className="stat-sub">
              Live for students
            </span>
          </div>

          <div className="teacher-stat-box">
            <span className="stat-label">
              STUDENT SUBMISSIONS
            </span>

            <span className="stat-val accent-blue">
              {stats?.total_submissions ??
                0}
            </span>

            <span className="stat-sub">
              Attempted solutions
            </span>
          </div>

          <div className="teacher-stat-box">
            <span className="stat-label">
              PASS RATE
            </span>

            <span className="stat-val accent-purple">
              {stats?.pass_rate_pct ??
                0}
              %
            </span>

            <span className="stat-sub">
              {stats?.passed_submissions ??
                0}{" "}
              verified solutions
            </span>
          </div>

        </section>

        {/* ==========================================
            ALERTS
        ========================================== */}

        {actionMessage && (
          <div className="teacher-alert-banner success">
            {actionMessage}
          </div>
        )}

        {error && (
          <div className="teacher-alert-banner error">
            {error}
          </div>
        )}

        {/* ==========================================
            TABS
        ========================================== */}

        <div className="teacher-tabs-container">

          <div className="teacher-tabs-bar">

            <button
              className={`t-tab-btn ${
                activeTab ===
                "questions"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveTab(
                  "questions"
                );
                setSelectedQuestion(
                  null
                );
              }}
            >
              📚 My Logic Problems (
              {questions.length})
            </button>

            <button
              className={`t-tab-btn ${
                activeTab ===
                "submissions"
                  ? "active"
                  : ""
              }`}
              onClick={
                handleViewAllSubmissions
              }
            >
              📊 Student Submissions
            </button>

            <button
              className={`t-tab-btn ${
                activeTab ===
                "inquiries"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  "inquiries"
                )
              }
            >
              💬 Student Inquiries
              {selectedQuestion
                ? ` (${selectedQuestion.title})`
                : ""}
            </button>

          </div>

          {/* ========================================
              QUESTION FILTERS
          ======================================== */}

          {activeTab === "questions" && (
            <div className="questions-filter-toolbar">

              <div className="search-wrap">
                <input
                  type="text"
                  placeholder="Search problem title or description..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                />
              </div>

             <div className="status-filter-pills">
            {[
              {
                key: "all",
                label: "ALL",
              },
              {
                key: "published",
                label: "PUBLISHED",
              },
              {
                key: "verified",
                label: "VERIFIED",
              },
              {
                key: "draft",
                label: "DRAFT",
              },
            ].map((filter) => (
              <button
                key={filter.key}
                className={`filter-pill ${
                  statusFilter === filter.key ? "active" : ""
                }`}
                onClick={() => setStatusFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
            </div>
          )}

        </div>

        {/* ==========================================
            TAB 1 — QUESTIONS
        ========================================== */}

        {activeTab === "questions" && (
          <div className="questions-list-section">

            {loading ? (
              <div className="loading-placeholder">
                Loading your
                questions...
              </div>
            ) : filteredQuestions.length ===
              0 ? (
              <div className="empty-questions-state">

                <div className="empty-icon">
                  💡
                </div>

                <h3>
                  No logic problems found
                </h3>

                <p>
                  Create your first
                  question and verify
                  the optimal circuit
                  to publish to
                  students.
                </p>

                <button
                  className="create-problem-hero-btn"
                  onClick={() =>
                    navigate(
                      "/teacher/create-question"
                    )
                  }
                >
                  + Create Your First
                  Problem
                </button>

              </div>
            ) : (
              <div className="questions-grid">

                {filteredQuestions.map(
                  (q) => {
                    const isVerified =
                      isQuestionVerified(
                        q
                      );

                    const canPublish =
                      isVerified &&
                      q.status !==
                        "published";

                    const originalGateCount =
                      getOriginalGateCount(
                        q
                      );

                    const optimizedGateCount =
                      getOptimizedGateCount(
                        q
                      );

                    return (
                      <div
                        key={q.id}
                        className="teacher-question-card"
                      >

                        {/* ============================
                            CARD HEADER
                        ============================ */}

                        <div className="q-card-header">

                          <div className="q-badges">

                            <span
                              className={`difficulty-pill ${
                                q.difficulty ||
                                "medium"
                              }`}
                            >
                              {(
                                q.difficulty ||
                                "medium"
                              ).toUpperCase()}
                            </span>

                            <span
                              className={`status-pill-badge ${
                                q.status ||
                                "draft"
                              }`}
                            >
                              {(
                                q.status ||
                                "draft"
                              ).toUpperCase()}
                            </span>

                          </div>

                          {/* ==========================
                              VERIFICATION DISPLAY
                          ========================== */}

                         <div className="q-verification-indicator">
                            {isVerified ? (
                              <span
                                className="v-tag pass"
                                title="Circuit verification passed"
                              >
                                ✓ VERIFIED
                              </span>
                            ) : (
                              <span
                                className="v-tag pending"
                                title="Verification required"
                              >
                                ⚠ NOT VERIFIED
                              </span>
                            )}
</div>

                        </div>

                        {/* IMPORTANT:
                            q-card-header is now closed correctly.
                        */}

                        <h3 className="q-card-title">
                          {q.title}
                        </h3>

                        <p className="q-card-desc">
                          {q.description ||
                            "No description provided."}
                        </p>

                        {/* ============================
                            CIRCUIT META
                        ============================ */}

                        <div className="q-circuit-meta">

                          <div className="meta-item">
                            <span className="meta-lbl">
                              Inputs:
                            </span>

                            <span className="meta-val">
                              {q.input_variables?.join(
                                ", "
                              ) ||
                                "None"}
                            </span>
                          </div>

                          <div className="meta-item">
                            <span className="meta-lbl">
                              Original Gates:
                            </span>

                            <span className="meta-val">
                              {q.original_circuit
                                ?.nodes
                                ?.filter(
                                  (n) =>
                                    ![
                                      "INPUT",
                                      "OUTPUT",
                                    ].includes(
                                      n.type?.toUpperCase()
                                    )
                                )
                                .length ??
                                0}
                            </span>
                          </div>

                          <div className="meta-item">
                            <span className="meta-lbl">
                              Submissions:
                            </span>

                            <span className="meta-val">
                              {q.submissions_count ??
                                0}
                            </span>
                          </div>

                        </div>

                        {/* ============================
                            CARD ACTIONS
                        ============================ */}

                        <div className="q-card-actions">

                          <button
                            className="q-act-btn edit"
                            onClick={() =>
                              navigate(
                                `/teacher/edit-question/${q.id}`
                              )
                            }
                            title="Open editor and run verification"
                          >
                            ✏ Edit &amp; Verify
                          </button>

                          {canPublish && (
                            <button
                              className="q-act-btn publish"
                              onClick={() =>
                                handlePublish(
                                  q.id
                                )
                              }
                              title="Publish to students"
                            >
                              🚀 Publish
                            </button>
                          )}

                          {q.status ===
                            "published" && (
                            <button
                              className="q-act-btn unpublish"
                              onClick={() =>
                                handleUnpublish(
                                  q.id
                                )
                              }
                              title="Hide from students"
                            >
                              Unpublish
                            </button>
                          )}

                          <button
                            className="q-act-btn view-subs"
                            onClick={() =>
                              handleViewSubmissions(
                                q
                              )
                            }
                            title="View student attempts"
                          >
                            Submissions (
                            {q.submissions_count ??
                              0}
                            )
                          </button>

                          <button
                            className="q-act-btn inquiries"
                            onClick={() =>
                              handleViewDiscussions(
                                q
                              )
                            }
                            title="View student questions"
                          >
                            Inquiries (
                            {q.discussions_count ??
                              0}
                            )
                          </button>

                          <button
                            className="q-act-btn delete"
                            onClick={() =>
                              handleDelete(
                                q.id
                              )
                            }
                            title="Delete problem"
                          >
                            🗑
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 2 — STUDENT SUBMISSIONS
        ========================================== */}

        {activeTab === "submissions" && (
          <div className="submissions-section">

            <div className="sub-header-bar">

              <h3>
                {selectedQuestion
                  ? `Submissions for: "${selectedQuestion.title}"`
                  : "All Student Submissions"}
              </h3>

              {selectedQuestion && (
                <button
                  className="mini-outline-btn"
                  onClick={
                    handleViewAllSubmissions
                  }
                >
                  View All Submissions
                </button>
              )}

            </div>

            {submissionsLoading ? (
              <div className="loading-placeholder">
                Loading student
                submissions...
              </div>
            ) : submissionsList.length ===
              0 ? (
              <div className="empty-sub-state">

                <p>
                  {selectedQuestion
                    ? "No student submissions recorded yet for this question."
                    : "No student submissions recorded yet."}
                </p>

              </div>
            ) : (
              <div className="submissions-table-wrap">

                <table className="teacher-data-table">

                  <thead>
                    <tr>
                      <th>
                        Student
                      </th>

                      <th>
                        Problem
                      </th>

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
                        XP
                      </th>

                      <th>
                        Result
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {submissionsList.map(
                      (sub) => {

                        const isPassed =
                          Boolean(
                            sub
                              ?.verification_result
                              ?.passed
                          );

                        const origGates =
                          sub
                            ?.optimization_metrics
                            ?.original_metrics
                            ?.gate_count ??
                          "N/A";

                        const stGates =
                          sub
                            ?.optimization_metrics
                            ?.student_metrics
                            ?.gate_count ??
                          "N/A";

                        const origDepth =
                          sub
                            ?.optimization_metrics
                            ?.original_metrics
                            ?.circuit_depth ??
                          "N/A";

                        const stDepth =
                          sub
                            ?.optimization_metrics
                            ?.student_metrics
                            ?.circuit_depth ??
                          "N/A";

                        return (
                          <tr
                            key={sub.id}
                            className={
                              isPassed
                                ? "row-pass"
                                : "row-fail"
                            }
                          >

                            <td>
                              <strong>
                                {
                                  sub.student_name ||
                                  "Student"
                                }
                              </strong>

                              <div className="sub-email">
                                {
                                  sub.student_email ||
                                  ""
                                }
                              </div>
                            </td>

                            <td>
                              {
                                sub.question_title ||
                                "Unknown Problem"
                              }
                            </td>

                            <td>
                              {sub.submitted_at
                                ? new Date(
                                    sub.submitted_at
                                  ).toLocaleString()
                                : "N/A"}
                            </td>

                            <td>
                              {sub
                                ?.equivalence_result
                                ?.equivalent ? (
                                <span className="table-badge pass">
                                  PASS
                                </span>
                              ) : (
                                <span className="table-badge fail">
                                  FAIL
                                </span>
                              )}
                            </td>

                            <td>
                              {sub
                                ?.optimization_metrics
                                ?.is_optimized ? (
                                <span className="table-badge pass">
                                  OPTIMIZED
                                </span>
                              ) : (
                                <span className="table-badge fail">
                                  NOT
                                  OPTIMIZED
                                </span>
                              )}
                            </td>

                            <td>
                              {origGates} →{" "}
                              <strong>
                                {stGates}
                              </strong>
                            </td>

                            <td>
                              {origDepth} →{" "}
                              <strong>
                                {stDepth}
                              </strong>
                            </td>

                            <td>
                              <strong>
                                {sub.xp_awarded ??
                                  0}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`result-tag ${
                                  isPassed
                                    ? "pass"
                                    : "fail"
                                }`}
                              >
                                {isPassed
                                  ? "✓ SOLVED"
                                  : "✗ INCOMPLETE"}
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

          </div>
        )}

        {/* ==========================================
            TAB 3 — STUDENT INQUIRIES
        ========================================== */}

        {activeTab === "inquiries" && (
          <div className="inquiries-section">

            <div className="sub-header-bar">

              <h3>
                {selectedQuestion
                  ? `Discussion Thread for: "${selectedQuestion.title}"`
                  : "Select a question to view inquiries"}
              </h3>

            </div>

            {!selectedQuestion ? (
              <div className="select-question-hint">

                <p>
                  Please select a question
                  from the "My Logic Problems"
                  tab by clicking "Inquiries".
                </p>

              </div>
            ) : discussionsLoading ? (
              <div className="loading-placeholder">
                Loading student
                inquiries...
              </div>
            ) : discussionsList.length ===
              0 ? (
              <div className="empty-sub-state">

                <p>
                  No questions asked by
                  students yet for this
                  problem.
                </p>

              </div>
            ) : (
              <div className="discussion-thread-container">

                {discussionsList.map(
                  (d) => {

                    const isTeacher =
                      d.sender_role ===
                      "teacher";

                    return (
                      <div
                        key={d.id}
                        className={`discussion-message-card ${
                          isTeacher
                            ? "teacher-msg"
                            : "student-msg"
                        }`}
                      >

                        <div className="disc-msg-header">

                          <div className="disc-sender-info">

                            <span
                              className={`sender-role-tag ${d.sender_role}`}
                            >
                              {isTeacher
                                ? "👨‍🏫 Teacher"
                                : "🎓 Student"}
                            </span>

                            <span className="sender-name">
                              {
                                d.sender_name ||
                                "User"
                              }
                            </span>

                          </div>

                          <span className="disc-timestamp">
                            {d.created_at
                              ? new Date(
                                  d.created_at
                                ).toLocaleString()
                              : ""}
                          </span>

                        </div>

                        <div className="disc-msg-body">
                          {d.message}
                        </div>

                        {/* Reply form */}
                        {!isTeacher && (
                          <div className="reply-inline-form">

                            <input
                              type="text"
                              placeholder="Type teacher response to student..."
                              value={
                                replyText[
                                  d.id
                                ] || ""
                              }
                              onChange={(e) =>
                                setReplyText(
                                  (prev) => ({
                                    ...prev,
                                    [d.id]:
                                      e.target
                                        .value,
                                  })
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key ===
                                  "Enter"
                                ) {
                                  handleSendReply(
                                    d.id
                                  );
                                }
                              }}
                            />

                            <button
                              type="button"
                              className="send-reply-btn"
                              onClick={() =>
                                handleSendReply(
                                  d.id
                                )
                              }
                              disabled={
                                isReplying
                              }
                            >
                              {isReplying
                                ? "Sending..."
                                : "Reply"}
                            </button>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default TeacherDashboard;