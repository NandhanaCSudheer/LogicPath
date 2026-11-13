import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("logicpath_token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("logicpath_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate current token with backend on mount
    if (token) {
      api.getMe()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem("logicpath_user", JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("logicpath_token", newToken);
    localStorage.setItem("logicpath_user", JSON.stringify(newUser));
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("logicpath_token");
    localStorage.removeItem("logicpath_user");
    api.logout().catch(() => {});
  };

  const isAuthenticated = Boolean(token);
  const userRole = (user?.role || "student").toLowerCase();
  const isTeacher = userRole === "teacher";
  const isStudent = userRole === "student";
  const isGuest = false;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: userRole,
        isTeacher,
        isStudent,
        isGuest,
        loading,
        isAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
