import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

/* ================= SAFE JWT HELPERS ================= */

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  // exp is in seconds
  const now = Date.now() / 1000;
  return payload.exp < now;
}

/* ================= CONTEXT ================= */

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* 🔐 Validate token on load + whenever it changes */
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
  }, [token]);

  /* ================= ACTIONS ================= */

  const login = (jwt) => {
    if (!jwt || isTokenExpired(jwt)) {
      logout();
      return;
    }

    localStorage.setItem("token", jwt);
    setToken(jwt);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  /* ================= VALUE ================= */

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
