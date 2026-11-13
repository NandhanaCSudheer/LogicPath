
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { ORDERED_TOPICS } from "./learningTopicsData";
import "./LearningPath.css";

function LearningPath() {
  const navigate = useNavigate();

  const [completedTopics, setCompletedTopics] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    setLoading(true);
    setError("");

    try {
      const res = await api.getLearningProgress();

      if (res?.progress) {
        setCompletedTopics(res.progress.completed_topics || []);
        setTopicProgress(res.progress.topic_progress || {});
        setTotalXP(res.progress.total_learning_xp || 0);
      }
    } catch (err) {
      console.error("Failed to load learning progress:", err);

      setError(
        "Failed to load learning progress. Please make sure you are logged in."
      );
    } finally {
      setLoading(false);
    }
  }

  const isTopicUnlocked = (index) => {
    if (index === 0) {
      return true;
    }

    const previousTopic = ORDERED_TOPICS[index - 1];

    if (!previousTopic) {
      return false;
    }

    return (
      completedTopics.includes(previousTopic.id) ||
      Boolean(topicProgress[previousTopic.id]?.completed)
    );
  };

  const isTopicCompleted = (topicId) => {
    return (
      completedTopics.includes(topicId) ||
      Boolean(topicProgress[topicId]?.completed)
    );
  };

  const openTopic = (topic, index) => {
    if (!isTopicUnlocked(index)) {
      return;
    }

    navigate(`/student/learning/${topic.id}`);
  };

  return (
    <div className="learning-path-page">
      <Navbar />

      <main className="learning-path-container">

        {/* ================= HEADER ================= */}

        <section className="learning-path-header">
          <div className="learning-header-content">
            <span className="learning-badge">
              STUDENT LEARNING PATH
            </span>

            <h1>
              Master Digital Logic &amp; Boolean Algebra
            </h1>

            <p>
              Master 15 fundamental Boolean algebra laws and digital
              design concepts. Complete all 4 levels in each topic
              to unlock the next law.
            </p>
          </div>

          <div className="learning-stats">

            <div className="learning-stat-card">
              <strong>{totalXP}</strong>
              <span>Total XP</span>
            </div>

            <div className="learning-stat-card">
              <strong>
                {completedTopics.length} / {ORDERED_TOPICS.length}
              </strong>
              <span>Laws Mastered</span>
            </div>

            <div className="learning-stat-card">
              <strong>
                {completedTopics.length === ORDERED_TOPICS.length
                  ? "🏆"
                  : ORDERED_TOPICS.length - completedTopics.length}
              </strong>

              <span>
                {completedTopics.length === ORDERED_TOPICS.length
                  ? "Completed"
                  : "Remaining"}
              </span>
            </div>

          </div>
        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="learning-error-banner">
            {error}
          </div>
        )}

        {/* ================= INTRO ================= */}

        <section className="path-intro">
          <h2>Sequential Learning Path</h2>

          <p>
            Each Boolean law must be mastered in order.
            Complete Level 1 through Level 4 with at least
            80% score to unlock the next stage.
          </p>
        </section>

        {/* ================= TOPICS ================= */}

        {loading ? (
          <div className="learning-loading">
            <div className="loading-spinner"></div>
            <p>Loading your learning progress...</p>
          </div>
        ) : (
          <div className="learning-topics">

            {ORDERED_TOPICS.map((topic, index) => {
              const unlocked = isTopicUnlocked(index);
              const completed = isTopicCompleted(topic.id);

              const tp = topicProgress[topic.id] || {};

              const completedLevelsCount =
                tp.completed_levels?.length ||
                (completed ? 4 : 0);

              return (
                <div
                  key={topic.id}
                  className={`learning-topic-card ${
                    !unlocked ? "locked-topic" : ""
                  } ${
                    completed ? "completed-topic" : ""
                  }`}
                  onClick={() => {
                    if (unlocked) {
                      openTopic(topic, index);
                    }
                  }}
                >

                  {/* NUMBER */}

                  <div className="topic-number">
                    {completed ? "✓" : index + 1}
                  </div>

                  {/* ICON */}

                  <div className="topic-icon">
                    {completed
                      ? "🏆"
                      : unlocked
                      ? topic.icon
                      : "🔒"}
                  </div>

                  {/* CONTENT */}

                  <div className="topic-content">

                    <div className="topic-title-row">

                      <h3>{topic.title}</h3>

                      {completed ? (
                        <span className="completed-label">
                          ✅ COMPLETED
                        </span>
                      ) : unlocked ? (
                        <span className="available-label">
                          🔓 UNLOCKED
                        </span>
                      ) : (
                        <span className="coming-label">
                          🔒 LOCKED
                        </span>
                      )}

                    </div>

                    <p>
                      {topic.description}
                    </p>

                    <div className="topic-footer">

                      <span>
                        🎮 4 Levels
                        {" "}
                        ({completedLevelsCount}/4 Done)
                      </span>

                      <span>
                        ⭐ 10 Questions / Level
                      </span>

                      <span>
                        🏆 300 XP
                      </span>

                    </div>

                  </div>

                  {/* ARROW */}

                  <div className="topic-arrow">
                    {completed
                      ? "✓"
                      : unlocked
                      ? "→"
                      : "🔒"}
                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ================= FINAL COMPLETION ================= */}

        {!loading &&
          completedTopics.length === ORDERED_TOPICS.length && (
            <div className="learning-complete-banner">

              <div className="completion-icon">
                🏆
              </div>

              <div>
                <h2>
                  Boolean Algebra Mastered!
                </h2>

                <p>
                  Congratulations! You have completed all 15
                  Boolean algebra learning paths. You are ready
                  to solve any digital logic design challenge
                  in the Problem Arena!
                </p>
              </div>

            </div>
          )}

      </main>
    </div>
  );
}

export default LearningPath;