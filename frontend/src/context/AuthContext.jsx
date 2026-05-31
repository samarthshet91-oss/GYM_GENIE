import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("gymgenie_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("gymgenie_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("gymgenie_theme") || "dark");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("gymgenie_theme", theme);
  }, [theme]);

  useEffect(() => {
    async function refreshProfile() {
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const data = await apiRequest("/api/user/profile");
        setUser(data.user);
        localStorage.setItem("gymgenie_user", JSON.stringify(data.user));
      } catch (error){
        console.error("Error refreshing profile:", error);
      } finally {
        setAuthChecked(true);
      }
    }

    refreshProfile();
  }, [token]);

   function saveSession(data) {
  console.log("LOGIN RESPONSE:", data);

  const tokenValue = data.token;
  const userValue = data.user;

  setToken(tokenValue);
  setUser(userValue);

  localStorage.setItem("gymgenie_token", tokenValue);
  localStorage.setItem("gymgenie_user", JSON.stringify(userValue));
}

  async function login(email, password) {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    saveSession(data);
    return data;
  }

  async function register(payload) {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    saveSession(data);
    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("gymgenie_token");
    localStorage.removeItem("gymgenie_user");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        theme,
        setTheme,
        authChecked,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
