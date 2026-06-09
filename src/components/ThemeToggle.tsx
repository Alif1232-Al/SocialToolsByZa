"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle}
      className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
      title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
      aria-label="Toggle dark mode">
      {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />}
    </button>
  );
}
