import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { ORDERED_TOPICS } from "./learningTopicsData";
import "./StudentDashboard.css";

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [backendStats, setBackendStats] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentData();
  }, []);

  async function loadStudentData() {
    setLoading(true);
    setError("");

    try {
      const [qRes, subRes, statsRes, learnRes] = await Promise.all([
        api.listStudentQuestions("").catch(() => ({ questions: [] })),
        api.getMySubmissions().catch(() => ({ submissions: [] })),
        api.getStudentStats().catch(() => null),
        api.getLearningProgress().catch(() => null),
      ]);

      if (qRes?.questions) {
        setQuestions(qRes.questions);
      }

      if (subRes?.submissions) {
        setSubmissions(subRes.submissions);
      }

      if (statsRes?.stats) {
        setBackendStats(statsRes.stats);
      }

      if (learnRes?.progress) {
        setLearningProgress(learnRes.progress);
      }
    } catch (err) {
      setError("Unable to load your learning progress from server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     AUTHORITATIVE MONGODB METRICS
     ========================= */

  const totalProblems = backendStats?.problems_available ?? questions.length;
  const solvedProblems = backendStats?.problems_completed ?? questions.filter((q) => q.user_solved).length;
  const totalAttempts = backendStats?.total_submissions ?? submissions.length;
  const passedAttempts = backendStats?.passed_submissions ?? submissions.filter((s) => s.verification_result?.passed).length;
  const failedAttempts = Math.max(0, totalAttempts - passedAttempts);

  const accuracy = backendStats?.pass_rate_pct !== undefined
    ? backendStats.pass_rate_pct
    : (totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0);

  const progress = totalProblems > 0
    ? Math.round((solvedProblems / totalProblems) * 100)
    : 0;

  const optimizedSolutions = backendStats?.optimized_submissions ?? submissions.filter(
    (s) => s.optimization_metrics?.is_optimized
  ).length;

  const equivalentSolutions = submissions.filter(
    (s) => s.equivalence_result?.equivalent
  ).length;

  /* =========================
     REAL MONGODB XP & LEVEL
     ========================= */

  // Authoritative XP from MongoDB users collection (updated by problem solves and learning progress)
  const xp = backendStats?.xp ?? user?.xp ?? 0;
  const level = backendStats?.level ?? Math.max(1, Math.floor(xp / 200) + 1);
  const xpInsideLevel = backendStats?.xp_into_level ?? (xp % 200);
  const levelProgress = backendStats?.progress_pct ?? Math.min(100, Math.round((xpInsideLevel / 200) * 100));

  /* =========================
     LEARNING PATH STATE
     ========================= */
  const completedTopicsList = learningProgress?.completed_topics || [];
  const currentTopic = ORDERED_TOPICS.find((t) => !completedTopicsList.includes(t.id)) || ORDERED_TOPICS[0];
  const topicProgressObj = learningProgress?.topic_progress?.[currentTopic.id] || {};
  const currentLevelsCompleted = topicProgressObj.completed_levels || [];

  /* =========================
     TEACHER FEEDBACK
     ========================= */

const submissionFeedbackList = submissions
  .filter(
    (s) =>
      s?.teacher_feedback &&
      s.teacher_feedback.text
  )
  .map((s) => ({
    submission_id: s.id,
    question_id: s.question_id,
    question_title: s.question_title,
    feedback: s.teacher_feedback,
    submitted_at: s.submitted_at,
  }));

const teacherFeedbackList =
  Array.isArray(backendStats?.recent_feedback) &&
  backendStats.recent_feedback.length > 0
    ? backendStats.recent_feedback
    : submissionFeedbackList;

  /* =========================
     ACHIEVEMENTS
     ========================= */

  const achievements = [
    {
      icon: "🚀",
      title: "First Step",
      description: "Attempt your first logic problem",
      unlocked: totalAttempts >= 1,
    },
    {
      icon: "🧠",
      title: "Logic Learner",
      description: "Successfully solve 3 problems",
      unlocked: solvedProblems >= 3,
    },
    {
      icon: "⚡",
      title: "Fast Progress",
      description: "Reach 5 successful attempts",
      unlocked: passedAttempts >= 5,
    },
    {
      icon: "🎯",
      title: "Accurate Thinker",
      description: "Reach 80% accuracy",
      unlocked: accuracy >= 80 && totalAttempts >= 3,
    },
    {
      icon: "🔧",
      title: "Circuit Optimizer",
      description: "Create an optimized solution",
      unlocked: optimizedSolutions >= 1,
    },
    {
      icon: "🏆",
      title: "Logic Master",
      description: "Successfully solve 10 problems",
      unlocked: solvedProblems >= 10,
    },
  ];

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  );

  /* =========================
     IMPROVEMENT INSIGHT
     ========================= */

  let improvementMessage =
    "Start solving problems to see your personal improvement insights.";

  if (totalAttempts > 0 && accuracy >= 80) {
    improvementMessage =
      "Excellent work! Your solutions are showing strong logical accuracy.";
  } else if (totalAttempts > 0 && accuracy >= 60) {
    improvementMessage =
      "Good progress! Keep practicing to improve your solution accuracy.";
  } else if (totalAttempts > 0) {
    improvementMessage =
      "Every attempt builds your logic skills. Review failed attempts and try again.";
  }

  if (optimizedSolutions > 0) {
    improvementMessage +=
      " You have also started working on circuit optimization.";
  }

  /* =========================
     RECENT ACTIVITY
     ========================= */

  const recentSubmissions = [...submissions]
    .sort(
      (a, b) =>
        new Date(b.submitted_at || 0) -
        new Date(a.submitted_at || 0)
    )
    .slice(0, 4);

  const firstName =
    user?.name?.split(" ")[0] || "Student";

  return (
    <div className="student-dashboard-page">
      <Navbar />

      <main className="student-dashboard-content">

        {/* ================= HERO ================= */}

        <section className="student-welcome">
          <div className="welcome-content">
            <span className="welcome-label">
              STUDENT LEARNING HUB
            </span>

            <h1>
              Welcome back, {firstName}! 👋
            </h1>

            <p>
              Keep learning, solving and improving your digital
              logic skills. Your learning journey continues here.
            </p>

            <div className="welcome-actions">
              <button
                className="primary-dashboard-btn"
                onClick={() => navigate("/student/learning")}
              >
                Continue Learning →
              </button>

              <button
                className="secondary-dashboard-btn"
                onClick={() => navigate("/student/problems")}
              >
                Explore Problems
              </button>
            </div>
          </div>

          <div className="welcome-visual">
            <div className="logic-orb">
              <span>∧</span>
            </div>

            <div className="orb-ring ring-one"></div>
            <div className="orb-ring ring-two"></div>

            <div className="floating-node node-one">1</div>
            <div className="floating-node node-two">0</div>
            <div className="floating-node node-three">+</div>
          </div>
        </section>

        {error && (
          <div className="dashboard-alert">
            {error}
          </div>
        )}

        {/* ================= QUICK STATS ================= */}

        <section className="dashboard-stats-grid">

          <div className="dashboard-stat-card blue-stat">
            <div className="stat-icon">⚡</div>
            <div>
              <span className="stat-label">TOTAL XP</span>
              <strong>{xp}</strong>
              <small>Level {level}</small>
            </div>
          </div>

          <div className="dashboard-stat-card purple-stat">
            <div className="stat-icon">🎯</div>
            <div>
              <span className="stat-label">ACCURACY</span>
              <strong>{accuracy}%</strong>
              <small>{passedAttempts} successful attempts</small>
            </div>
          </div>

          <div className="dashboard-stat-card green-stat">
            <div className="stat-icon">✓</div>
            <div>
              <span className="stat-label">PROBLEMS SOLVED</span>
              <strong>{solvedProblems}</strong>
              <small>of {totalProblems} available</small>
            </div>
          </div>

          <div className="dashboard-stat-card orange-stat">
            <div className="stat-icon">🔥</div>
            <div>
              <span className="stat-label">TOTAL ATTEMPTS</span>
              <strong>{totalAttempts}</strong>
              <small>Keep practicing</small>
            </div>
          </div>

        </section>

        {/* ================= PROGRESS + LEARNING ================= */}

        <section className="dashboard-main-grid">

          <div className="dashboard-card progress-card">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  YOUR JOURNEY
                </span>
                <h2>Learning Progress</h2>
              </div>

              <span className="level-badge">
                LEVEL {level}
              </span>
            </div>

            <div className="progress-main">

              <div
                className="progress-circle"
                style={{
                  "--progress": `${progress * 3.6}deg`,
                }}
              >
                <div className="progress-circle-inner">
                  <strong>{progress}%</strong>
                  <span>Complete</span>
                </div>
              </div>

              <div className="progress-info">
                <h3>
                  {progress >= 80
                    ? "You're doing great! 🚀"
                    : progress >= 40
                    ? "You're making progress! 💪"
                    : "Your journey has started! 🌱"}
                </h3>

                <p>
                  {solvedProblems} of {totalProblems} available
                  problems completed.
                </p>

                <div className="level-progress">
                  <div className="level-progress-header">
                    <span>Level {level} progress</span>
                    <span>{levelProgress}%</span>
                  </div>

                  <div className="level-progress-track">
                    <div
                      className="level-progress-fill"
                      style={{
                        width: `${levelProgress}%`,
                      }}
                    ></div>
                  </div>

                  <small>
                    {200 - xpInsideLevel > 0
                      ? `${200 - xpInsideLevel} XP until next level`
                      : "Next level unlocked!"}
                  </small>
                </div>
              </div>

            </div>
          </div>

          <div className="dashboard-card learning-card">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  CONTINUE YOUR PATH
                </span>
                <h2>Learning Progress ({completedTopicsList.length}/15 Mastered)</h2>
              </div>
            </div>

            <div className="learning-topic-icon">
              {currentTopic.icon || "⚡"}
            </div>

            <h3>{currentTopic.title}</h3>

            <p>
              {currentTopic.description || "Master Boolean laws and digital circuit design."}
            </p>

            <div className="learning-levels">
              {[
                { num: 1, name: "Basics" },
                { num: 2, name: "Intermediate" },
                { num: 3, name: "Advanced" },
                { num: 4, name: "Challenge" },
              ].map(({ num, name }) => {
                const isDone = currentLevelsCompleted.includes(num);
                const isCurrent = (topicProgressObj.current_level || 1) === num && !isDone;
                return (
                  <span
                    key={num}
                    className={isDone ? "completed-level" : isCurrent ? "active-level" : ""}
                  >
                    {isDone ? `✓ ${name}` : isCurrent ? `● ${name}` : `🔒 ${name}`}
                  </span>
                );
              })}
            </div>

            <button
              className="continue-learning-btn"
              onClick={() => navigate(`/student/learning/${currentTopic.id}`)}
            >
              Continue {currentTopic.title} →
            </button>

          </div>

        </section>

        {/* ================= IMPROVEMENT ================= */}

        <section className="dashboard-card improvement-card">

          <div className="improvement-left">

            <div className="improvement-icon">
              📈
            </div>

            <div>
              <span className="section-kicker">
                PERSONAL INSIGHT
              </span>

              <h2>Your Improvement</h2>

              <p>{improvementMessage}</p>
            </div>

          </div>

          <div className="improvement-metrics">

            <div>
              <span>Successful</span>
              <strong>{passedAttempts}</strong>
            </div>

            <div>
              <span>Failed</span>
              <strong>{failedAttempts}</strong>
            </div>

            <div>
              <span>Equivalent</span>
              <strong>{equivalentSolutions}</strong>
            </div>

            <div>
              <span>Optimized</span>
              <strong>{optimizedSolutions}</strong>
            </div>

          </div>

        </section>

        {/* ================= ACHIEVEMENTS ================= */}

        <section className="dashboard-card achievements-card">

          <div className="section-heading achievement-heading">

            <div>
              <span className="section-kicker">
                REWARDS
              </span>

              <h2>Achievements</h2>

              <p>
                Unlock achievements as you improve your
                digital logic skills.
              </p>
            </div>

            <div className="achievement-count">
              <strong>
                {unlockedAchievements.length}
              </strong>
              <span>
                / {achievements.length} unlocked
              </span>
            </div>

          </div>

          <div className="achievement-grid">

            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`achievement-item ${
                  achievement.unlocked
                    ? "unlocked"
                    : "locked"
                }`}
              >

                <div className="achievement-icon">
                  {achievement.unlocked
                    ? achievement.icon
                    : "🔒"}
                </div>

                <div className="achievement-info">
                  <h3>{achievement.title}</h3>

                  <p>
                    {achievement.description}
                  </p>

                  <span>
                    {achievement.unlocked
                      ? "UNLOCKED"
                      : "LOCKED"}
                  </span>
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section className="dashboard-bottom-grid">

          <div className="dashboard-card activity-card">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  ACTIVITY
                </span>

                <h2>Recent Attempts</h2>
              </div>

              <button
                className="text-action"
                onClick={() => navigate("/student/attempts")}
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="dashboard-loading">
                Loading your activity...
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="empty-dashboard">
                <span>🧠</span>
                <h3>Your journey starts here</h3>
                <p>
                  Solve your first problem to start
                  building your progress.
                </p>

                <button
                  onClick={() =>
                    navigate("/student/problems")
                  }
                >
                  Find a Problem
                </button>
              </div>
            ) : (
              <div className="recent-list">

                {recentSubmissions.map((submission) => {

                  const passed =
                    submission.verification_result?.passed;

                  return (
                    <div
                      className="recent-item"
                      key={submission.id}
                      style={{ cursor: submission.question_id ? "pointer" : "default" }}
                      onClick={() => submission.question_id && navigate(`/student/solve/${submission.question_id}`)}
                    >

                      <div className="recent-icon">
                        {passed ? "✓" : "!"}
                      </div>

                      <div className="recent-info">
                        <strong>
                          {submission.question_title || "Logic Problem"}
                        </strong>

                        <span>
                          {submission.submitted_at
                            ? new Date(
                                submission.submitted_at
                              ).toLocaleDateString()
                            : "Recently attempted"}
                        </span>
                      </div>

                      <span
                        className={`recent-status ${
                          passed ? "success" : "failed"
                        }`}
                      >
                        {passed
                          ? "PASSED"
                          : "RETRY"}
                      </span>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

          {/* NEXT GOAL */}

          <div className="dashboard-card goal-card">

            <div className="goal-glow"></div>

            <span className="section-kicker">
              NEXT GOAL
            </span>

            <div className="goal-icon">
              🎯
            </div>

            <h2>
              Reach Level {level + 1}
            </h2>

            <p>
              Keep solving problems and completing
              optimized solutions to earn more XP.
            </p>

            <div className="goal-xp">
              <strong>
                {200 - xpInsideLevel > 0
                  ? 200 - xpInsideLevel
                  : 0}
              </strong>

              <span> XP remaining</span>
            </div>

            <div className="goal-progress">
              <div
                style={{
                  width: `${levelProgress}%`,
                }}
              ></div>
            </div>

            <button
              onClick={() => navigate("/student/problems")}
            >
              Start Practicing →
            </button>

          </div>

        </section>

        {/* ================= TEACHER FEEDBACK ================= */}

<section className="dashboard-card teacher-feedback-card">

  <div className="section-heading">

    <div>
      <span className="section-kicker">
        INSTRUCTOR REVIEWS
      </span>

      <h2>
        Teacher Feedback
      </h2>
    </div>

    <span className="feedback-count-badge">
      {teacherFeedbackList.length}
    </span>

  </div>

  {teacherFeedbackList.length === 0 ? (

    <div className="empty-dashboard feedback-empty-state">

      <span>💬</span>

      <h3>
        No teacher feedback yet
      </h3>

      <p>
        Your teacher's feedback will appear here
        after your submitted solution is reviewed.
      </p>

    </div>

  ) : (

    <div className="teacher-feedback-grid">

      {teacherFeedbackList.map((item, idx) => {

        const feedback = item?.feedback || {};

        return (
          <div
            key={
              item?.submission_id ||
              `${item?.question_id}-${idx}`
            }
            className="feedback-item-box"
          >

            <div className="feedback-item-top">

              <div>
                <span className="feedback-problem-label">
                  PROBLEM
                </span>

                <strong>
                  {item?.question_title ||
                    "Logic Problem Solution"}
                </strong>
              </div>

              <div className="feedback-badges">

                <span
                  className={`feedback-badge-status ${
                    feedback.status || "reviewed"
                  }`}
                >
                  {feedback.status === "excellent"
                    ? "🌟 EXCELLENT"
                    : feedback.status === "correct"
                    ? "✅ CORRECT"
                    : "📝 NEEDS IMPROVEMENT"}
                </span>

                {feedback.score !== null &&
                  feedback.score !== undefined && (
                    <span className="feedback-badge-score">
                      Score: {feedback.score}/100
                    </span>
                  )}

              </div>

            </div>

            <div className="feedback-message">

              <p>
                {feedback.text ||
                  "No written feedback provided."}
              </p>

            </div>

            <div className="feedback-item-bottom">

              <span>
                👨‍🏫{" "}
                {feedback.teacher_name || "Teacher"}
              </span>

              <span>
                {feedback.updated_at
                  ? new Date(
                      feedback.updated_at
                    ).toLocaleDateString()
                  : ""}
              </span>

              {item?.question_id && (
                <button
                  className="feedback-view-btn"
                  onClick={() =>
                    navigate(
                      `/student/solve/${item.question_id}`
                    )
                  }
                >
                  View Problem →
                </button>
              )}

            </div>

          </div>
        );
      })}

    </div>

  )}

</section>

      </main>
    </div>
  );
}

export default StudentDashboard;