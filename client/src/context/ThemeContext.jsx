import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const ACCENT_OPTIONS = ["cyan", "rose", "emerald", "amber"];

export const ThemeProvider = ({ children }) => {
  // Persist selected theme so user preference survives refresh.
  const [mode, setMode] = useState(() => localStorage.getItem("theme_mode") || "light");
  const [accent, setAccent] = useState(() => localStorage.getItem("theme_accent") || "cyan");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("theme_mode", mode);
  }, [mode]);

  useEffect(() => {
    const root = window.document.documentElement;
    ACCENT_OPTIONS.forEach((item) => root.classList.remove(`accent-${item}`));
    const safeAccent = ACCENT_OPTIONS.includes(accent) ? accent : "cyan";
    root.classList.add(`accent-${safeAccent}`);
    localStorage.setItem("theme_accent", safeAccent);
  }, [accent]);

  const value = useMemo(
    () => ({
      mode,
      accent,
      setAccent,
      toggleMode: () => setMode((prev) => (prev === "light" ? "dark" : "light"))
    }),
    [mode, accent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
