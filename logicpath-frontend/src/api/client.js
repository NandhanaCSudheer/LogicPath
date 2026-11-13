const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";

/**
 * Reusable API request function.
 *
 * Automatically:
 * - adds JWT token
 * - adds JSON headers
 * - parses JSON
 * - gives useful backend errors
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    localStorage.getItem("logicpath_token");

  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `[LogicPath API] ${options.method || "GET"} ${url}`
  );

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        message: text || "Server returned an empty response.",
      };
    }

    console.log(
      `[LogicPath API] Response ${response.status}:`,
      data
    );

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        data?.detail ||
        `Request failed with status ${response.status}`;

      const error = new Error(message);

      error.status = response.status;
      error.data = data;
      error.endpoint = endpoint;

      throw error;
    }

    return data;
  } catch (error) {
    /*
     * Preserve errors generated above.
     */
    if (error?.status !== undefined) {
      throw error;
    }

    /*
     * Network / Flask server unavailable.
     */
    const networkError = new Error(
      "Unable to connect to LogicPath server. " +
        "Please make sure the Flask backend is running on " +
        API_BASE_URL
    );

    networkError.status = 0;
    networkError.originalError = error;

    throw networkError;
  }
}


// ======================================================
// API
// ======================================================

export const api = {

  // ====================================================
  // AUTHENTICATION
  // ====================================================

  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    request("/api/auth/me"),

  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),


  // ====================================================
  // CIRCUITS
  // ====================================================

  listCircuits: () =>
    request("/api/circuits"),

  getCircuit: (id) =>
    request(`/api/circuits/${id}`),

  createCircuit: (payload) =>
    request("/api/circuits", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCircuit: (id, payload) =>
    request(`/api/circuits/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteCircuit: (id) =>
    request(`/api/circuits/${id}`, {
      method: "DELETE",
    }),


  // ====================================================
  // LOGIC OPERATIONS
  // ====================================================

  validateCircuit: (payload) =>
    request("/api/validate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  simulateCircuit: (payload) =>
    request("/api/simulate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  generateTruthTable: (payload) =>
    request("/api/truth-table", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  generateBooleanExpression: (payload) =>
    request("/api/boolean-expression", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  optimizeCircuit: (payload) =>
    request("/api/optimize", {
      method: "POST",
      body: JSON.stringify(payload),
    }),


  // ====================================================
  // PRESETS / CHALLENGES
  // ====================================================

  getExamples: () =>
    request("/api/examples"),

  getGates: () =>
    request("/api/gates"),

  getChallenges: () =>
    request("/api/challenges"),

  verifyChallenge: (payload) =>
    request("/api/challenges/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),


  // ====================================================
  // SIMULATION HISTORY
  // ====================================================

  getSimulationHistory: () =>
    request("/api/simulations/history"),


  // ====================================================
  // STANDALONE CIRCUIT VERIFICATION
  // ====================================================

  verifyCircuits: (payload) =>
    request("/api/questions/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),


  // ====================================================
  // TEACHER
  // ====================================================

  createTeacherQuestion: (payload) =>
    request("/api/teacher/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listTeacherQuestions: () =>
    request("/api/teacher/questions"),

  getTeacherQuestion: (id) =>
    request(`/api/teacher/questions/${id}`),

  updateTeacherQuestion: (id, payload) =>
    request(`/api/teacher/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteTeacherQuestion: (id) =>
    request(`/api/teacher/questions/${id}`, {
      method: "DELETE",
    }),

  verifyTeacherQuestion: (id, payload = {}) =>
    request(
      `/api/teacher/questions/${id}/verify`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  publishTeacherQuestion: (id) =>
    request(
      `/api/teacher/questions/${id}/publish`,
      {
        method: "POST",
      }
    ),

  unpublishTeacherQuestion: (id) =>
    request(
      `/api/teacher/questions/${id}/unpublish`,
      {
        method: "POST",
      }
    ),

  getQuestionSubmissions: (id) =>
    request(
      `/api/teacher/questions/${id}/submissions`
    ),

  getAllTeacherSubmissions: () =>
    request("/api/teacher/submissions"),

  provideSubmissionFeedback: (
    id,
    payload
  ) =>
    request(
      `/api/teacher/submissions/${id}/feedback`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  getTeacherDiscussions: (id) =>
    request(
      `/api/teacher/questions/${id}/discussions`
    ),

  replyTeacherDiscussion: (
    id,
    payload
  ) =>
    request(
      `/api/teacher/questions/${id}/discussions`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  getTeacherStats: () =>
    request("/api/teacher/stats"),


  // ====================================================
  // STUDENT
  // ====================================================

  listStudentQuestions: (
    difficulty = null
  ) => {
    const endpoint =
      difficulty
        ? `/api/student/questions?difficulty=${encodeURIComponent(
            difficulty
          )}`
        : "/api/student/questions";

    return request(endpoint);
  },

  /*
   * IMPORTANT:
   *
   * This is the API used when the student clicks
   * "Solve Problem".
   *
   * Example:
   *
   * /student/solve/68d123abc...
   *
   * then this calls:
   *
   * /api/student/questions/68d123abc...
   */
  getStudentQuestion: (id) => {
    if (!id) {
      return Promise.reject(
        new Error(
          "No problem ID was provided."
        )
      );
    }

    return request(
      `/api/student/questions/${encodeURIComponent(
        id
      )}`
    );
  },

  submitStudentSolution: (
    id,
    payload
  ) => {
    if (!id) {
      return Promise.reject(
        new Error(
          "No problem ID was provided."
        )
      );
    }

    return request(
      `/api/student/questions/${encodeURIComponent(
        id
      )}/submit`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getStudentQuestionSubmissions: (
    id
  ) => {
    if (!id) {
      return Promise.reject(
        new Error(
          "No problem ID was provided."
        )
      );
    }

    return request(
      `/api/student/questions/${encodeURIComponent(
        id
      )}/submissions`
    );
  },

  getMySubmissions: () =>
    request(
      "/api/student/submissions"
    ),

  getStudentStats: () =>
    request("/api/student/stats"),

  getStudentDiscussions: (id) => {
    if (!id) {
      return Promise.reject(
        new Error(
          "No problem ID was provided."
        )
      );
    }

    return request(
      `/api/student/questions/${encodeURIComponent(
        id
      )}/discussions`
    );
  },

  postStudentDiscussion: (
    id,
    payload
  ) => {
    if (!id) {
      return Promise.reject(
        new Error(
          "No problem ID was provided."
        )
      );
    }

    return request(
      `/api/student/questions/${encodeURIComponent(
        id
      )}/discussions`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getLearningProgress: () =>
    request("/api/student/learning-progress"),

  completeLearningLevel: (payload) =>
    request("/api/student/learning-progress/complete-level", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export default api;