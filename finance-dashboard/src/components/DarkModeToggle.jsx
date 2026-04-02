import { useEffect, useState } from "react";

const STORAGE_KEY = "finance-dashboard-theme";

const getInitialDarkMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((previous) => !previous)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed right-2 top-2 z-[110] flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.6)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-18px_rgba(15,23,42,0.7)] dark:border-slate-700/80 dark:bg-slate-900/90 sm:right-4 sm:top-4 sm:gap-3 sm:px-3 sm:py-3 lg:right-5 lg:top-5 xl:right-6 xl:top-6"
    >
      <span className="relative flex h-7 w-[64px] items-center rounded-full bg-slate-200/90 p-1 dark:bg-slate-800 sm:h-8 sm:w-[72px]">
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 dark:bg-slate-950 sm:h-6 sm:w-6 ${
            isDark ? "left-[38px] sm:left-[42px]" : "left-1"
          }`}
        />

        <span className="relative z-10 flex w-full items-center justify-between px-1">
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center transition sm:h-4 sm:w-4 ${
              isDark ? "text-slate-500" : "text-amber-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="3.25"
                fill="currentColor"
                stroke="none"
              />
              <path d="M12 3.5v2.1" />
              <path d="M12 18.4v2.1" />
              <path d="M3.5 12h2.1" />
              <path d="M18.4 12h2.1" />
              <path d="m6 6 1.5 1.5" />
              <path d="m16.5 16.5 1.5 1.5" />
              <path d="m6 18 1.5-1.5" />
              <path d="m16.5 7.5 1.5-1.5" />
            </svg>
          </span>

          <span
            className={`flex h-3.5 w-3.5 items-center justify-center transition sm:h-4 sm:w-4 ${
              isDark ? "text-sky-200" : "text-slate-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4"
            >
              <path d="M20.742 13.045A8.088 8.088 0 0 1 10.955 3.258a.75.75 0 0 0-.883-.97A9.503 9.503 0 1 0 21.712 13.93a.75.75 0 0 0-.97-.884Z" />
            </svg>
          </span>
        </span>
      </span>

      <span className="hidden text-sm font-semibold text-slate-700 dark:text-slate-200 2xl:block">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
