
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import {
  topicData,
  ORDERED_TOPICS,
} from "./learningTopicsData";
import "./LearningTopic.css";

export function LearningTopic() {
  const navigate = useNavigate();
  const { topicId } = useParams();

  const [completedTopics, setCompletedTopics] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeLevel, setActiveLevel] = useState(1);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [quizResult, setQuizResult] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, [topicId]);

  async function fetchProgress() {
    setLoading(true);
    setError("");

    try {
      const res = await api.getLearningProgress();

      if (res?.progress) {
        setCompletedTopics(
          res.progress.completed_topics || []
        );

        setTopicProgress(
          res.progress.topic_progress || {}
        );
      }
    } catch (err) {
      console.error(
        "Failed to load learning progress:",
        err
      );

      setError(
        "Failed to verify learning progress from server."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     TOPIC DATA
     ====================================================== */

  const currentTopicMeta = ORDERED_TOPICS.find(
    (topic) => topic.id === topicId
  );

  const currentTopicData = topicData[topicId];

  if (!currentTopicMeta || !currentTopicData) {
    return (
      <div className="learning-topic-page">
        <Navbar />

        <div className="topic-not-found">
          <div className="not-found-icon">
            🔍
          </div>

          <h2>Topic Not Found</h2>

          <p>
            The requested learning topic "{topicId}"
            does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/student/learning")
            }
          >
            ← Back to Learning Path
          </button>
        </div>
      </div>
    );
  }

  /* ======================================================
     TOPIC UNLOCK
     ====================================================== */

  const topicIndex =
    ORDERED_TOPICS.findIndex(
      (topic) => topic.id === topicId
    );

  const previousTopic =
    ORDERED_TOPICS[topicIndex - 1];

  const isTopicUnlocked =
    topicIndex === 0 ||
    completedTopics.includes(previousTopic?.id) ||
    Boolean(
      topicProgress[previousTopic?.id]?.completed
    );

  /* ======================================================
     CURRENT PROGRESS
     ====================================================== */

  const currentTp =
    topicProgress[topicId] || {};

  const completedLevels =
    currentTp.completed_levels || [];

  /* ======================================================
     LEVEL UNLOCK
     ====================================================== */

  const isLevelUnlocked = (levelNumber) => {
    if (!isTopicUnlocked) {
      return false;
    }

    if (levelNumber === 1) {
      return true;
    }

    return completedLevels.includes(
      levelNumber - 1
    );
  };

  const isLevelCompleted = (levelNumber) => {
    return completedLevels.includes(
      levelNumber
    );
  };

  /* ======================================================
     LEVEL SELECTION
     ====================================================== */

  const handleSelectLevel = (levelNumber) => {
    if (!isLevelUnlocked(levelNumber)) {
      return;
    }

    setActiveLevel(levelNumber);

    setSelectedAnswers({});

    setQuizSubmitted(false);

    setQuizResult(null);
  };

  /* ======================================================
     ANSWER SELECTION
     ====================================================== */

  const handleAnswerSelect = (
    questionIndex,
    optionIndex
  ) => {
    if (quizSubmitted) {
      return;
    }

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex,
    }));
  };

  /* ======================================================
     QUIZ SUBMISSION
     ====================================================== */

  const handleSubmitQuiz = async () => {
    const currentQuestions =
      currentTopicData.levels[
        activeLevel - 1
      ]?.questions || [];

    if (
      Object.keys(selectedAnswers).length <
      currentQuestions.length
    ) {
      alert(
        `Please answer all ${currentQuestions.length} questions before submitting.`
      );

      return;
    }

    setSubmitting(true);

    let correctCount = 0;

    currentQuestions.forEach(
      (question, index) => {
        if (
          selectedAnswers[index] ===
          question.answer
        ) {
          correctCount++;
        }
      }
    );

    const total = currentQuestions.length;

    const scorePct =
      total > 0
        ? Math.round(
            (correctCount / total) * 100
          )
        : 0;

    const passed = scorePct >= 80;

    let xpGained = 0;

    if (passed) {
      try {
        const res =
          await api.completeLearningLevel({
            topic_id: topicId,
            level_number: activeLevel,
            score: scorePct,
          });

        if (res?.success) {
          xpGained =
            res.xp_gained || 0;

          await fetchProgress();
        }
      } catch (err) {
        console.error(
          "Error submitting level completion:",
          err
        );

        setError(
          "Level passed, but progress could not be saved. Please try again."
        );
      }
    }

    setQuizResult({
      score: scorePct,
      passed,
      correctCount,
      total,
      xpGained,
    });

    setQuizSubmitted(true);

    setSubmitting(false);
  };

  /* ======================================================
     RETRY
     ====================================================== */

  const handleRetry = () => {
    setSelectedAnswers({});

    setQuizSubmitted(false);

    setQuizResult(null);

    setError("");
  };

  /* ======================================================
     NEXT LEVEL
     ====================================================== */

  const handleNextLevel = () => {
    if (
      activeLevel < 4 &&
      isLevelUnlocked(activeLevel + 1)
    ) {
      handleSelectLevel(
        activeLevel + 1
      );
    } else {
      navigate("/student/learning");
    }
  };

  /* ======================================================
     LOCKED TOPIC
     ====================================================== */

  if (!loading && !isTopicUnlocked) {
    return (
      <div className="learning-topic-page">
        <Navbar />

        <main className="topic-locked-container">
          <div className="topic-locked-card">

            <div className="locked-badge-icon">
              🔒
            </div>

            <span className="locked-label">
              TOPIC LOCKED
            </span>

            <h2>
              Complete the Previous Topic
            </h2>

            <p>
              You must complete all 4 levels of{" "}
              <strong>
                {previousTopic?.title}
              </strong>{" "}
              before unlocking{" "}
              <strong>
                {currentTopicMeta.title}
              </strong>.
            </p>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/student/learning")
              }
            >
              ← Return to Learning Path
            </button>

          </div>
        </main>
      </div>
    );
  }

  const activeLevelData =
    currentTopicData.levels[
      activeLevel - 1
    ];

  const questions =
    activeLevelData?.questions || [];

  return (
    <div className="learning-topic-page">
      <Navbar />

      <main className="learning-topic-container">

        {/* =================================================
            HEADER
            ================================================= */}

        <section className="topic-page-header">

          <button
            className="back-link-btn"
            onClick={() =>
              navigate("/student/learning")
            }
          >
            ← Back to Learning Path
          </button>

          <div className="header-title-block">

            <span className="topic-badge">
              {currentTopicMeta.icon} TOPIC{" "}
              {topicIndex + 1}
            </span>

            <h1>
              {currentTopicMeta.title}
            </h1>

            <p>
              {currentTopicMeta.description}
            </p>

          </div>

        </section>

        {/* =================================================
            ERROR
            ================================================= */}

        {error && (
          <div className="topic-error-banner">
            {error}
          </div>
        )}

        {/* =================================================
            LEVEL TABS
            ================================================= */}

        <section className="level-tabs-nav">

          {currentTopicData.levels.map(
            (level, index) => {
              const levelNumber =
                index + 1;

              const unlocked =
                isLevelUnlocked(
                  levelNumber
                );

              const completed =
                isLevelCompleted(
                  levelNumber
                );

              const active =
                activeLevel ===
                levelNumber;

              return (
                <button
                  key={levelNumber}
                  className={`level-tab-btn ${
                    active ? "active" : ""
                  } ${
                    !unlocked
                      ? "locked"
                      : ""
                  } ${
                    completed
                      ? "completed"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectLevel(
                      levelNumber
                    )
                  }
                  disabled={!unlocked}
                >

                  <div className="tab-icon">
                    {completed
                      ? "✅"
                      : unlocked
                      ? "🔓"
                      : "🔒"}
                  </div>

                  <div className="tab-info">
                    <span className="tab-num">
                      Level {levelNumber}
                    </span>

                    <span className="tab-title">
                      {level.title}
                    </span>
                  </div>

                </button>
              );
            }
          )}

        </section>

        {/* =================================================
            LEVEL LOCKED
            ================================================= */}

        {!isLevelUnlocked(activeLevel) ? (
          <div className="level-locked-banner">
            🔒 Level {activeLevel} is locked.
            You must achieve at least 80% on
            Level {activeLevel - 1} to unlock
            this level.
          </div>
        ) : (
          <section className="quiz-card">

            {/* =================================================
                QUIZ HEADER
                ================================================= */}

            <div className="quiz-header">

              <div>
                <span className="level-label">
                  LEVEL {activeLevel}
                </span>

                <h2>
                  {activeLevelData.title}
                </h2>
              </div>

              <span className="passing-rule-tag">
                Passing Score: 80%
              </span>

            </div>

            {/* =================================================
                RESULT
                ================================================= */}

            {quizSubmitted &&
              quizResult && (
                <div
                  className={`quiz-result-banner ${
                    quizResult.passed
                      ? "passed"
                      : "failed"
                  }`}
                >

                  <div className="result-icon">
                    {quizResult.passed
                      ? "🎉"
                      : "❌"}
                  </div>

                  <div className="result-text">

                    <h3>
                      {quizResult.passed
                        ? "Level Passed!"
                        : "Level Not Passed"}
                    </h3>

                    <p>
                      Your Score:{" "}
                      <strong>
                        {quizResult.score}%
                      </strong>{" "}
                      (
                      {
                        quizResult.correctCount
                      }{" "}
                      /{" "}
                      {quizResult.total}{" "}
                      correct).
                    </p>

                    {quizResult.passed ? (
                      <p>
                        Great job! You earned{" "}
                        <strong>
                          {quizResult.xpGained} XP
                        </strong>.
                      </p>
                    ) : (
                      <p>
                        You need at least 80%
                        to complete this level.
                        Review the explanations
                        and try again.
                      </p>
                    )}

                  </div>

                  <div className="result-actions">

                    {quizResult.passed ? (
                      <button
                        className="next-level-btn"
                        onClick={
                          handleNextLevel
                        }
                      >
                        {activeLevel < 4
                          ? "Proceed to Next Level →"
                          : "Return to Learning Path →"}
                      </button>
                    ) : (
                      <button
                        className="retry-btn"
                        onClick={
                          handleRetry
                        }
                      >
                        🔄 Retry Level
                      </button>
                    )}

                  </div>

                </div>
              )}

            {/* =================================================
                QUESTIONS
                ================================================= */}

            <div className="questions-list">

              {questions.map(
                (question, questionIndex) => {
                  const selected =
                    selectedAnswers[
                      questionIndex
                    ];

                  const isSelected =
                    selected !== undefined;

                  const isCorrect =
                    selected ===
                    question.answer;

                  return (
                    <div
                      key={
                        question.id ||
                        questionIndex
                      }
                      className={`question-item-card ${
                        quizSubmitted
                          ? isCorrect
                            ? "correct-card"
                            : "incorrect-card"
                          : ""
                      }`}
                    >

                      <div className="question-text-row">

                        <span className="q-number">
                          Q{questionIndex + 1}
                        </span>

                        <h4>
                          {question.q}
                        </h4>

                      </div>

                      <div className="options-grid">

                        {question.options.map(
                          (
                            optionText,
                            optionIndex
                          ) => {
                            const checked =
                              selected ===
                              optionIndex;

                            let optionClass =
                              "";

                            if (
                              quizSubmitted
                            ) {
                              if (
                                optionIndex ===
                                question.answer
                              ) {
                                optionClass =
                                  "correct-option";
                              } else if (
                                checked &&
                                optionIndex !==
                                  question.answer
                              ) {
                                optionClass =
                                  "wrong-option";
                              }
                            } else if (
                              checked
                            ) {
                              optionClass =
                                "selected-option";
                            }

                            return (
                              <button
                                key={
                                  optionIndex
                                }
                                type="button"
                                className={`option-btn ${optionClass}`}
                                onClick={() =>
                                  handleAnswerSelect(
                                    questionIndex,
                                    optionIndex
                                  )
                                }
                                disabled={
                                  quizSubmitted
                                }
                              >

                                <span className="opt-letter">
                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                                </span>

                                <span className="opt-text">
                                  {optionText}
                                </span>

                              </button>
                            );
                          }
                        )}

                      </div>

                      {quizSubmitted && (
                        <div className="explanation-box">
                          <strong>
                            Explanation:
                          </strong>{" "}
                          {question.explanation}
                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

            {/* =================================================
                QUIZ FOOTER
                ================================================= */}

            {!quizSubmitted && (
              <div className="quiz-footer">

                <span className="answered-count">
                  {Object.keys(
                    selectedAnswers
                  ).length}{" "}
                  of {questions.length} answered
                </span>

                <button
                  className="submit-quiz-btn"
                  onClick={
                    handleSubmitQuiz
                  }
                  disabled={
                    submitting ||
                    Object.keys(
                      selectedAnswers
                    ).length <
                      questions.length
                  }
                >
                  {submitting
                    ? "Evaluating..."
                    : "Submit Level Quiz"}
                </button>

              </div>
            )}

          </section>
        )}

      </main>
    </div>
  );
}

export default LearningTopic;
