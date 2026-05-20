import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http.js";

const AUTH_STORAGE_KEY = "aninerd_auth_token";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) || "");
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setAuthHeader = (nextToken) => {
    if (nextToken) {
      http.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
      return;
    }

    delete http.defaults.headers.common.Authorization;
  };

  // Restore persisted session when the app loads.
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        if (!token) {
          setAuthHeader("");
          setUser(null);
          return;
        }

        setAuthHeader(token);
        const { data } = await http.get("/auth/me");
        setUser(data.user);
      } catch (_error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthHeader("");
        setToken("");
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    localStorage.setItem(AUTH_STORAGE_KEY, data.token);
    setAuthHeader(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await http.post("/auth/register", { name, email, password });
    localStorage.setItem(AUTH_STORAGE_KEY, data.token);
    setAuthHeader(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthHeader("");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login,
      register,
      logout
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
