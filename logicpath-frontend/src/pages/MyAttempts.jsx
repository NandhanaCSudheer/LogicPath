import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAttempts.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function MyAttempts() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("logicpath_token");

      const response = await fetch(
        `${API_BASE_URL}/api/student/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load attempts"
        );
      }

      const attempts = Array.isArray(data)
        ? data
        : data.submissions || data.data || [];

      setSubmissions(attempts);
    } catch (err) {
      setError(
        err.message || "Unable to load attempts"
      );
    } finally {
      setLoading(false);
    }
  };

  const passedCount = submissions.filter(
    (item) =>
      item.verification_result?.passed === true
  ).length;

  const failedCount =
    submissions.length - passedCount;

  const accuracy =
    submissions.length > 0
      ? Math.round(
          (passedCount / submissions.length) * 100
        )
      : 0;

  const optimizedCount = submissions.filter(
    (item) =>
      item.optimization_metrics?.is_optimized === true
  ).length;

  const filteredAttempts = useMemo(() => {
    if (filter === "passed") {
      return submissions.filter(
        (item) =>
          item.verification_result?.passed === true
      );
    }

    if (filter === "failed") {
      return submissions.filter(
        (item) =>
          item.verification_result?.passed !== true
      );
    }

    if (filter === "optimized") {
      return submissions.filter(
        (item) =>
          item.optimization_metrics?.is_optimized === true
      );
    }

    return submissions;
  }, [submissions, filter]);

  const getProblemName = (attempt) => {
    return (
      attempt.question_title ||
      attempt.problem_title ||
      attempt.question?.title ||
      attempt.question?.question ||
      "Logic Problem"
    );
  };

  const getDate = (attempt) => {
    const date =
      attempt.submitted_at ||
      attempt.created_at ||
      attempt.updated_at;

    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString();
  };

  const getStatus = (attempt) => {
    return attempt.verification_result?.passed === true
      ? "Passed"
      : "Needs Improvement";
  };

  const getScore = (attempt) => {
    if (attempt.score !== undefined) {
      return attempt.score;
    }

    if (
      attempt.verification_result?.score !== undefined
    ) {
      return attempt.verification_result.score;
    }

    return attempt.verification_result?.passed
      ? 100
      : 0;
  };

  return (
    <div className="my-attempts-page">
      <div className="attempts-container">

        <section className="attempts-header">
          <div>
            <span className="attempts-eyebrow">
              YOUR PRACTICE HISTORY
            </span>

            <h1>My Attempts</h1>

            <p>
              Review your previous solutions, see where
              you improved, and identify areas that need
              more practice.
            </p>
          </div>

          <button
            className="practice-button"
            onClick={() =>
              navigate("/student/problems")
            }
          >
            Practice Problems →
          </button>
        </section>

        <section className="attempt-stats">

          <div className="attempt-stat">
            <div className="attempt-stat-icon blue">
              ↗
            </div>

            <div>
              <strong>{submissions.length}</strong>
              <span>Total Attempts</span>
            </div>
          </div>

          <div className="attempt-stat">
            <div className="attempt-stat-icon green">
              ✓
            </div>

            <div>
              <strong>{passedCount}</strong>
              <span>Passed</span>
            </div>
          </div>

          <div className="attempt-stat">
            <div className="attempt-stat-icon orange">
              !
            </div>

            <div>
              <strong>{failedCount}</strong>
              <span>Needs Improvement</span>
            </div>
          </div>

          <div className="attempt-stat">
            <div className="attempt-stat-icon purple">
              %
            </div>

            <div>
              <strong>{accuracy}%</strong>
              <span>Accuracy</span>
            </div>
          </div>

        </section>

        <section className="attempts-toolbar">

          <div>
            <h2>Submission History</h2>

            <p>
              Every solution you have submitted appears
              here.
            </p>
          </div>

          <div className="attempt-filters">

            <button
              className={
                filter === "all" ? "active" : ""
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "passed" ? "active" : ""
              }
              onClick={() => setFilter("passed")}
            >
              Passed
            </button>

            <button
              className={
                filter === "failed" ? "active" : ""
              }
              onClick={() => setFilter("failed")}
            >
              Needs Improvement
            </button>

            <button
              className={
                filter === "optimized" ? "active" : ""
              }
              onClick={() => setFilter("optimized")}
            >
              Optimized
            </button>

          </div>
        </section>

        {loading && (
          <div className="attempts-empty">
            <div className="attempt-loading"></div>

            <h3>
              Loading your attempts...
            </h3>
          </div>
        )}

        {!loading && error && (
          <div className="attempts-empty">

            <div className="attempt-empty-icon">
              !
            </div>

            <h3>
              Unable to load attempts
            </h3>

            <p>{error}</p>

            <button onClick={fetchAttempts}>
              Try Again
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          filteredAttempts.length === 0 && (
            <div className="attempts-empty">

              <div className="attempt-empty-icon">
                ◇
              </div>

              <h3>
                No attempts found
              </h3>

              <p>
                Solve a problem and your submission
                history will appear here.
              </p>

              <button
                onClick={() =>
                  navigate("/student/problems")
                }
              >
                Find a Problem
              </button>

            </div>
          )}

        {!loading &&
          !error &&
          filteredAttempts.length > 0 && (
            <section className="attempt-list">

              {filteredAttempts.map(
                (attempt, index) => {

                  const passed =
                    attempt.verification_result
                      ?.passed === true;

                  const optimized =
                    attempt.optimization_metrics
                      ?.is_optimized === true;

                  return (
                    <article
                      className="attempt-card"
                      key={
                        attempt._id ||
                        attempt.id ||
                        index
                      }
                    >

                      <div className="attempt-main">

                        <div
                          className={`attempt-status ${
                            passed
                              ? "passed"
                              : "failed"
                          }`}
                        >
                          {passed ? "✓" : "!"}
                        </div>

                        <div className="attempt-info">

                          <div className="attempt-type">
                            {attempt.question_type ||
                              attempt.type ||
                              "Logic Problem"}
                          </div>

                          <h3>
                            {getProblemName(attempt)}
                          </h3>

                          <span className="attempt-date">
                            Submitted{" "}
                            {getDate(attempt)}
                          </span>

                        </div>

                      </div>

                      <div className="attempt-result">

                        <div className="attempt-score">
                          <strong>
                            {getScore(attempt)}
                          </strong>

                          <span>Score</span>
                        </div>

                        <span
                          className={`result-badge ${
                            passed
                              ? "result-passed"
                              : "result-failed"
                          }`}
                        >
                          {getStatus(attempt)}
                        </span>

                        {optimized && (
                          <span className="optimized-badge">
                            ⚡ Optimized
                          </span>
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </section>
          )}

        {!loading &&
          !error &&
          submissions.length > 0 && (
            <section className="attempt-insight">

              <div className="insight-icon">
                ◈
              </div>

              <div>

                <h3>
                  Your progress
                </h3>

                <p>
                  You have completed{" "}
                  {passedCount} successful
                  submission
                  {passedCount !== 1 ? "s" : ""}{" "}
                  with an overall accuracy of{" "}
                  {accuracy}%.
                  {optimizedCount > 0 &&
                    ` ${optimizedCount} solution${
                      optimizedCount !== 1
                        ? "s"
                        : ""
                    } achieved optimization.`}
                </p>

              </div>

            </section>
          )}

      </div>
    </div>
  );
}

export default MyAttempts;