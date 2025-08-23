"use client";

import { useEffect, useState } from "react";

const THEME_COOKIE = "site-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load on mount from cookie or prefers-color-scheme
  useEffect(() => {
    const cookie = typeof document !== "undefined"
      ? document.cookie.match(/(?:^| )site-theme=([^;]+)/)?.[1]
      : null;

    // Default to light if there is no cookie set
    const initial = (cookie as "light" | "dark" | undefined) ?? "light";

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    
    // Ensure CSS variables are set immediately
    const root = document.documentElement;
    if (initial === "dark") {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
      root.classList.add("dark");
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.classList.remove("dark");
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    
    // Ensure CSS variables are set immediately
    const root = document.documentElement;
    if (next === "dark") {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
      root.classList.add("dark");
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.classList.remove("dark");
    }
    
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${THEME_COOKIE}=${next}; Expires=${expires}; Path=/; SameSite=Lax`;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDark ? "bg-slate-800" : "bg-amber-200"
      }`}
    >
      <span
        className={`absolute left-1 inline-flex h-8 w-8 transform items-center justify-center rounded-full transition-transform duration-300 shadow-sm ${
          isDark ? "translate-x-10 bg-blue-500" : "translate-x-0 bg-amber-400"
        }`}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-white"
            aria-hidden="true"
          >
            <path d="M21.752 15.002A9.718 9.718 0 0 1 12.001 22C6.477 22 2 17.523 2 11.999A9.718 9.718 0 0 1 8.998 2.248a.75.75 0 0 1 .99.96 7.719 7.719 0 0 0-.412 2.511c0 4.28 3.468 7.748 7.748 7.748.858 0 1.692-.142 2.511-.412a.75.75 0 0 1 .917.947z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-yellow-900"
            aria-hidden="true"
          >
            <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            <path d="M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 12 2.25zM12 19.5a.75.75 0 0 1 .75.75V21.75a.75.75 0 0 1-1.5 0V20.25a.75.75 0 0 1 .75-.75zM4.22 4.22a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L4.22 5.28a.75.75 0 0 1 0-1.06zM17.66 17.66a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06zM2.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 12zM19.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75zM4.22 19.78a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1 1.06 1.06L6.34 20.84a.75.75 0 0 1-1.06 0zM17.66 6.34a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1 1.06 1.06L18.72 7.4a.75.75 0 0 1-1.06 0z" />
          </svg>
        )}
      </span>
    </button>
  );
}