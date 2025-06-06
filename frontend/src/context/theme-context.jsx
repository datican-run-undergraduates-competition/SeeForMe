"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    // Check if there's a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // If no saved preference, check system preference
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", theme)

    // Remove all theme classes first
    document.documentElement.classList.remove("light", "dark", "grayscale")

    // Add the current theme class
    document.documentElement.classList.add(theme)

    // Set data-theme attribute for components that use it
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
