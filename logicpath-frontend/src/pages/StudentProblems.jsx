import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProblems.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function StudentProblems() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
 const [category, setCategory] = useState("all");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("logicpath_token");

      const response = await fetch(
        `${API_BASE_URL}/api/student/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load problems"
        );
      }

      const problemList = Array.isArray(data)
        ? data
        : data.questions || data.data || [];

      setQuestions(problemList);
    } catch (err) {
      setError(
        err.message || "Unable to load problems"
      );
    } finally {
      setLoading(false);
    }
  };

  const getId = (problem) => {
    return problem._id || problem.id;
  };

  const getProblemTitle = (problem) => {
    return (
      problem.title ||
      problem.question ||
      problem.name ||
      "Untitled Logic Problem"
    );
  };

  const getProblemDescription = (problem) => {
    return (
      problem.description ||
      problem.question_text ||
      problem.statement ||
      "Solve this digital logic problem and submit your solution."
    );
  };

  const getCategory = (problem) => {
    const value =
      problem.category ||
      problem.type ||
      problem.question_type ||
      problem.problem_type ||
      "Logic";

    return String(value);
  };

  const getTopic = (problem) => {
  return (
    problem.topic ||
    problem.law ||
    problem.learning_topic ||
    problem.boolean_law ||
    "General Logic"
  );
};

const getTopicKey = (problem) => {
  return getTopic(problem)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

  const getCategoryKey = (problem) => {
    const value = getCategory(problem).toLowerCase();

    if (
      value.includes("boolean") ||
      value.includes("simplif") ||
      value.includes("algebra")
    ) {
      return "boolean";
    }

    if (
      value.includes("circuit") ||
      value.includes("gate") ||
      value.includes("design")
    ) {
      return "circuit";
    }

    if (
      value.includes("optim") ||
      value.includes("minim")
    ) {
      return "optimization";
    }

    return "other";
  };

  const getDifficulty = (problem) => {
    return String(
      problem.difficulty ||
        problem.difficulty_level ||
        "Medium"
    );
  };

  const getDifficultyKey = (problem) => {
    return getDifficulty(problem).toLowerCase();
  };

  const getLevel = (problem) => {
    const level =
      problem.level ||
      problem.difficulty_level ||
      problem.stage;

    if (!level) {
      return "Level 1";
    }

    if (String(level).toLowerCase().includes("level")) {
      return String(level);
    }

    return `Level ${level}`;
  };

  const getXP = (problem) => {
    return (
      problem.xp ||
      problem.xp_reward ||
      problem.points ||
      50
    );
  };

  const isSolved = (problem) => {
    return (
      problem.user_solved === true ||
      problem.solved === true ||
      problem.completed === true ||
      problem.is_solved === true
    );
  };

  const getDifficultyClass = (problem) => {
    const value = getDifficultyKey(problem);

    if (value === "easy") {
      return "difficulty-easy";
    }

    if (value === "hard") {
      return "difficulty-hard";
    }

    return "difficulty-medium";
  };

  const getCategoryIcon = (problem) => {
    const categoryKey = getCategoryKey(problem);

    if (categoryKey === "boolean") {
      return "∑";
    }

    if (categoryKey === "circuit") {
      return "⚡";
    }

    if (categoryKey === "optimization") {
      return "◆";
    }

    return "◇";
  };

  const getCategoryLabel = (problem) => {
    const categoryKey = getCategoryKey(problem);

    if (categoryKey === "boolean") {
      return "Boolean";
    }

    if (categoryKey === "circuit") {
      return "Circuit";
    }

    if (categoryKey === "optimization") {
      return "Optimization";
    }

    return "Logic";
  };

  const filteredProblems = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return questions.filter((problem) => {
      const title = getProblemTitle(problem).toLowerCase();

      const description =
        getProblemDescription(problem).toLowerCase();

      const problemCategory =
        getCategoryKey(problem);

      const problemDifficulty =
        getDifficultyKey(problem);

      const solved = isSolved(problem);

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        getCategory(problem)
          .toLowerCase()
          .includes(searchValue) ||
        getTopic(problem)
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        category === "all" ||
        problemCategory === category;

      const matchesTopic =
        topic === "all" ||
        getTopicKey(problem) === topic;

      const matchesDifficulty =
        difficulty === "all" ||
        problemDifficulty === difficulty;

      const matchesStatus =
        status === "all" ||
        (status === "solved" && solved) ||
        (status === "unsolved" && !solved);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTopic &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
  questions,
  search,
  category,
  topic,
  difficulty,
  status,
]);

  const solvedCount = questions.filter(isSolved).length;

  const totalXP = questions.reduce(
    (total, problem) => {
      return total + Number(getXP(problem) || 0);
    },
    0
  );

  const openProblem = (problem) => {
    const id = getId(problem);

    if (!id) {
      return;
    }

    navigate(`/student/solve/${id}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setTopic("all");
    setDifficulty("all");
    setStatus("all");
  };

  return (
    <div className="student-problems-page">
      <div className="problems-container">

        {/* HERO */}
        <section className="problems-hero">

          <div className="hero-content">

            <div className="hero-badge">
              <span>⚡</span>
              PROBLEM ARENA
            </div>

            <h1>
              Challenge Your
              <span> Logic Skills</span>
            </h1>

            <p>
              Solve teacher-created digital logic
              problems, build your skills, and earn XP
              as you progress through LogicPath.
            </p>

            <div className="hero-actions">
              <button
                className="hero-primary-button"
                onClick={() => {
                  const firstUnsolved =
                    questions.find(
                      (problem) => !isSolved(problem)
                    );

                  if (firstUnsolved) {
                    openProblem(firstUnsolved);
                  }
                }}
                disabled={
                  questions.length === 0 ||
                  questions.every(isSolved)
                }
              >
                Start a Challenge
                <span>→</span>
              </button>

              <div className="hero-stat">
                <strong>{questions.length}</strong>
                <span>Problems</span>
              </div>

              <div className="hero-stat">
                <strong>{solvedCount}</strong>
                <span>Solved</span>
              </div>

              <div className="hero-stat">
                <strong>{totalXP}</strong>
                <span>Available XP</span>
              </div>
            </div>

          </div>

          <div className="hero-visual">
            <div className="logic-orbit orbit-one"></div>
            <div className="logic-orbit orbit-two"></div>

            <div className="logic-core">
              <span>01</span>
              <strong>LOGIC</strong>
              <small>BUILD • SOLVE • MASTER</small>
            </div>
          </div>

        </section>

        {/* FILTER SECTION */}
        <section className="problem-filter-panel">

          <div className="filter-heading">
            <div>
              <span className="section-label">
                PRACTICE
              </span>

              <h2>
                Choose Your Challenge
              </h2>
            </div>

            <button
              className="refresh-button"
              onClick={fetchProblems}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="search-row">

            <div className="problem-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by problem, topic or category..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}
            </div>

          </div>

          <div className="filter-row">

            <div className="filter-group">

              <span className="filter-title">
                Category
              </span>

              <div className="filter-buttons">

                <div className="filter-group topic-filter-group">

  <span className="filter-title">
    Boolean Law
  </span>

  <div className="filter-buttons">

              <button
                className={
                  topic === "all"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setTopic("all")}
              >
                All Laws
              </button>

              <button
                className={
                  topic === "distributive-law"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("distributive-law")
                }
              >
                Distributive
              </button>

              <button
                className={
                  topic === "commutative-law"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("commutative-law")
                }
              >
                Commutative
              </button>

              <button
                className={
                  topic === "associative-law"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("associative-law")
                }
              >
                Associative
              </button>

              <button
                className={
                  topic === "identity-law"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("identity-law")
                }
              >
                Identity
              </button>

              <button
                className={
                  topic === "absorption-law"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("absorption-law")
                }
              >
                Absorption
              </button>

              <button
                className={
                  topic === "de-morgan-s-laws"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setTopic("de-morgan-s-laws")
                }
              >
                De Morgan
              </button>

            </div>
          </div>

                <button
                  className={
                    category === "all"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setCategory("all")}
                >
                  All
                </button>

                <button
                  className={
                    category === "boolean"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setCategory("boolean")
                  }
                >
                  ∑ Boolean
                </button>

                <button
                  className={
                    category === "circuit"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setCategory("circuit")
                  }
                >
                  ⚡ Circuit
                </button>

                <button
                  className={
                    category === "optimization"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setCategory("optimization")
                  }
                >
                  ◆ Optimization
                </button>

              </div>

            </div>

            <div className="select-filters">

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
              >
                <option value="all">
                  All Difficulties
                </option>

                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>
              </select>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="unsolved">
                  Unsolved
                </option>

                <option value="solved">
                  Solved
                </option>
              </select>

            </div>

          </div>

        </section>

        {/* SUMMARY */}
        <div className="problem-summary">

          <div className="summary-left">

            <strong>
              {filteredProblems.length}
            </strong>

            <span>
              {filteredProblems.length === 1
                ? " challenge"
                : " challenges"}{" "}
              found
            </span>

          </div>

          {(search ||
            category !== "all" ||
            topic !== "all" ||
            difficulty !== "all" ||
            status !== "all") && (
            <button
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

        </div>

        {/* LOADING */}
        {loading && (
          <div className="problems-state">

            <div className="loading-circle"></div>

            <h3>
              Loading your challenges...
            </h3>

            <p>
              Fetching the latest problems from
              your teacher.
            </p>

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="problems-state error-state">

            <div className="state-icon">
              !
            </div>

            <h3>
              Unable to load problems
            </h3>

            <p>{error}</p>

            <button
              onClick={fetchProblems}
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredProblems.length === 0 && (
            <div className="problems-state">

              <div className="empty-icon">
                ◇
              </div>

              <h3>
                No challenges found
              </h3>

              <p>
                {questions.length === 0
                  ? "Your teacher has not published any problems yet."
                  : "Try changing your search or filters."}
              </p>

              {questions.length > 0 && (
                <button
                  onClick={clearFilters}
                >
                  Reset Filters
                </button>
              )}

            </div>
          )}

        {/* PROBLEM CARDS */}
        {!loading &&
          !error &&
          filteredProblems.length > 0 && (
            <section className="problem-grid">

              {filteredProblems.map(
                (problem, index) => {

                  const solved =
                    isSolved(problem);

                  const id = getId(problem);

                  return (
                    <article
                      className={`problem-card ${
                        solved
                          ? "problem-card-solved"
                          : ""
                      }`}
                      key={id || index}
                      onClick={() =>
                        openProblem(problem)
                      }
                    >

                      <div className="card-top">

                        <div
                          className={`category-icon category-${getCategoryKey(
                            problem
                          )}`}
                        >
                          {getCategoryIcon(problem)}
                        </div>

                        <div className="card-badges">

                          <span
                            className={`difficulty-badge ${getDifficultyClass(
                              problem
                            )}`}
                          >
                            {getDifficulty(problem)}
                          </span>

                          {solved && (
                            <span className="solved-badge">
                              ✓ Solved
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="card-content">

                        <div className="problem-category">
                          {getCategoryLabel(problem)}
                        </div>

                        <div className="problem-topic">
                          📘 {getTopic(problem)}
                        </div>

                        <h2>
                          {getProblemTitle(problem)}
                        </h2>

                        <p>
                          {getProblemDescription(
                            problem
                          )}
                        </p>

                      </div>

                      <div className="card-meta">

                        <div className="meta-item">
                          <span className="meta-icon">
                            ◈
                          </span>

                          <div>
                            <small>Difficulty</small>
                            <strong>
                              {getLevel(problem)}
                            </strong>
                          </div>
                        </div>

                        <div className="meta-divider"></div>

                        <div className="meta-item">
                          <span className="meta-icon xp-icon">
                            ⚡
                          </span>

                          <div>
                            <small>Reward</small>
                            <strong>
                              {getXP(problem)} XP
                            </strong>
                          </div>
                        </div>

                      </div>

                      <div className="card-footer">

                        <span className="teacher-label">
                          <span>✓</span>
                          Teacher Created
                        </span>

                        <button
                          className="solve-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProblem(problem);
                          }}
                        >
                          {solved
                            ? "Practice Again"
                            : "Solve Challenge"}

                          <span>→</span>
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </section>
          )}

      </div>
    </div>
  );
}

export default StudentProblems;