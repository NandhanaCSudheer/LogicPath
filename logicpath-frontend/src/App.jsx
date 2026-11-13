import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import StudentProblems from "./pages/StudentProblems";
import MyAttempts from "./pages/MyAttempts";
import Build from "./pages/Build";
import LearningPath from "./pages/LearningPath";
import LearningTopic from "./pages/LearningTopic";
import Simulation from "./pages/Simulation";
import Learn from "./pages/Learn";
import Challenges from "./pages/Challenges";
import NotFound from "./pages/NotFound";

import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherQuestionEditor from "./pages/TeacherQuestionEditor";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProblemSolver from "./pages/StudentProblemSolver";

function DashboardDispatcher() {
  const { isTeacher, isStudent } = useAuth();
  if (isTeacher) return <TeacherDashboard />;
  if (isStudent) return <StudentDashboard />;
  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Role-Adaptive Primary Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/create-question"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherQuestionEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/edit-question/:id"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherQuestionEditor />
              </ProtectedRoute>
            }
          />

          {/* Gamified Learning Path */}
          <Route
            path="/student/learning"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <LearningPath />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/learning/:topicId"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <LearningTopic />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/problems"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <StudentProblems />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attempts"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <MyAttempts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/solve/:id"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}>
                <StudentProblemSolver />
              </ProtectedRoute>
            }
          />

          {/* Core LogicPath Workspaces & Lab */}
          <Route
            path="/build"
            element={
              <ProtectedRoute>
                <Build />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulate"
            element={
              <ProtectedRoute>
                <Simulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classic-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Aliases for smooth navigation */}
          <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
          <Route path="/missions" element={<Navigate to="/challenges" replace />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;