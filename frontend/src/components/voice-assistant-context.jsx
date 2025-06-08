"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Create context for global voice assistant state
const VoiceAssistantContext = createContext({
  isGloballyEnabled: true,
  setGloballyEnabled: () => {},
})

// Provider component to wrap around the application
export function VoiceAssistantProvider({ children }) {
  // Initialize state from localStorage if available
  const [isGloballyEnabled, setGloballyEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("voiceAssistantGloballyEnabled")
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })

  // Save to localStorage whenever the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("voiceAssistantGloballyEnabled", JSON.stringify(isGloballyEnabled))
    }
  }, [isGloballyEnabled])

  return (
    <VoiceAssistantContext.Provider value={{ isGloballyEnabled, setGloballyEnabled }}>
      {children}
    </VoiceAssistantContext.Provider>
  )
}

// Custom hook to access the voice assistant context
export function useVoiceAssistant() {
  return useContext(VoiceAssistantContext)
}
