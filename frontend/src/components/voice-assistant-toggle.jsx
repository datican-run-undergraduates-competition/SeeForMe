"use client"

import { Button } from "../components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useVoiceAssistant } from "./voice-assistant-context"

// A reusable toggle component that can be placed anywhere in the app
export default function VoiceAssistantToggle({ variant = "default", size = "sm", className = "" }) {
  const { isGloballyEnabled, setGloballyEnabled } = useVoiceAssistant()

  const toggleVoiceAssistant = () => {
    // Cancel any ongoing speech when disabling
    if (isGloballyEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setGloballyEnabled(!isGloballyEnabled)
  }

  return (
    <Button
      onClick={toggleVoiceAssistant}
      variant={variant}
      size={size}
      className={className}
      aria-pressed={isGloballyEnabled}
      aria-label={isGloballyEnabled ? "Disable voice assistant" : "Enable voice assistant"}
    >
      {isGloballyEnabled ? (
        <>
          <Volume2 className="w-4 h-4 mr-2" />
          <span className="sr-only md:not-sr-only">Voice Assistant On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 mr-2" />
          <span className="sr-only md:not-sr-only">Voice Assistant Off</span>
        </>
      )}
    </Button>
  )
}
