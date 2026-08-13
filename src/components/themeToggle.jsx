import { useEffect, useState } from "react";
import "./themeToggle.css";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "obsidian" ? "light" : "obsidian")}
      title={theme === "obsidian" ? "Cambiar a modo claro" : "Cambiar a tema obsidian"}
      aria-label="Cambiar tema"
    >
      {theme === "obsidian" ? "Claro" : "Obsidian"}
    </button>
  );
}
