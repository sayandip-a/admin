// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({ dark: false, toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("accelia-theme") === "dark";
    } catch {
      return false;
    }
  });

  const toggle = () =>
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem("accelia-theme", next ? "dark" : "light");
      } catch {}
      return next;
    });

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
