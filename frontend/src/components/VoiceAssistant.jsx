"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Mic, MicOff } from "lucide-react"

// iOS detection utility
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

const VoiceAssistant = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  // iOS: Only allow speech output after tap
  if (isIOS()) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasSpoken, setHasSpoken] = useState(false);
    const buttonRef = useRef(null);

    const speak = (text) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    const handleDisableVoice = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsEnabled(false);
    };

    const handleEnableVoice = () => {
      setIsEnabled(true);
      hasSpokenWelcome.current = false;
    };

    if (!isEnabled) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col items-center">
          <Button
            onClick={handleEnableVoice}
            variant="default"
            size="lg"
            className="w-full"
          >
            Enable Voice Assistant
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col items-center">
        <p className="text-yellow-800 mb-4">
          Voice assistant features are limited on iOS devices. Tap the button below to hear a welcome message.
        </p>
        <Button
          ref={buttonRef}
          onClick={() => {
            speak("Welcome to the accessibility assistant. Voice input is not supported on iOS, but you can hear this message.");
            setHasSpoken(true);
          }}
          disabled={isSpeaking}
        >
          {isSpeaking ? "Speaking..." : hasSpoken ? "Replay Welcome" : "Talk to Assistant"}
        </Button>
        <Button
          onClick={handleDisableVoice}
          variant="outline"
          size="sm"
          className="w-full mt-2"
          disabled={!isSpeaking}
        >
          Disable Voice
        </Button>
      </div>
    );
  }

  // --- Android/Desktop: Full experience ---
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [transcript, setTranscript] = useState("")
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const navigate = useNavigate()
  const location = useLocation()
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)
  const reminderTimeoutRef = useRef(null)
  const buttonRef = useRef(null)
  const hasSpokenWelcome = useRef(false)
  const lastAnnouncedPage = useRef("")
  const recognitionState = useRef("stopped")
  const isProcessingSpeech = useRef(false)

  // Get current page context
  const getCurrentPageInfo = useCallback(() => {
    const path = location.pathname
    switch (path) {
      case "/":
        return {
          name: "home page",
          description:
            "You are on the home page. Available options are navigation tools, color blindness tools, snap features, and upload functionality.",
          commands: "Say navigation, color blindness, snap, upload, or go back",
        }
      case "/navigation-assistant":
        return {
          name: "navigation page",
          description:
            "You are on the navigation assistance page. This page helps with location and direction services.",
          commands: "Say color blindness, snap, upload, go back, or home",
        }
      case "/color-blindness-tools":
        return {
          name: "color blindness tools page",
          description:
            "You are on the color blindness tools page. This page provides tools to help with color identification and accessibility.",
          commands: "Say navigation, snap, upload, go back, or home",
        }
      case "/snap":
        return {
          name: "snap page",
          description: "You are on the snap page. This page provides camera and image capture functionality.",
          commands: "Say navigation, color blindness, upload, go back, or home",
        }
      case "/upload":
        return {
          name: "upload page",
          description: "You are on the upload page. This page allows you to upload and manage your files.",
          commands: "Say navigation, color blindness, snap, go back, or home",
        }
      default:
        return {
          name: "current page",
          description: "You are on a page within the accessibility assistant application.",
          commands: "Say navigation, color blindness, snap, upload, go back, or home",
        }
    }
  }, [location.pathname])

  // Stop listening function - ensures complete stop
  const stopListening = useCallback(() => {
    if (recognitionRef.current && recognitionState.current !== "stopped") {
      try {
        recognitionRef.current.abort()
      } catch (error) {
        console.log("Recognition already stopped")
      }
    }

    recognitionState.current = "stopped"
    setIsListening(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Start listening function - only starts when not speaking
  const startListening = useCallback(() => {
    // Never start listening while speaking or processing speech
    if (!recognitionRef.current || !isSupported || isSpeaking || isProcessingSpeech.current) {
      return
    }

    // Ensure we're completely stopped first
    stopListening()

    // Wait longer to ensure recognition is fully stopped
    setTimeout(() => {
      if (recognitionState.current === "stopped" && !isSpeaking && !isProcessingSpeech.current) {
        try {
          recognitionState.current = "starting"
          setTranscript("")
          recognitionRef.current.start()
          setLastInteraction(Date.now())

          // Set timeout for 15 seconds of silence
          timeoutRef.current = setTimeout(() => {
            if (recognitionState.current === "running" && !isSpeaking) {
              speak(
                "I'm still here to help. Say a command like navigation, color blindness, snap, upload, or say 'help' for more options.",
              )
            }
          }, 15000)
        } catch (error) {
          console.error("Error starting recognition:", error)
          recognitionState.current = "stopped"
          setIsListening(false)
        }
      }
    }, 500)
  }, [isSupported, isSpeaking, stopListening])

  // Simplified speech synthesis function
  const speak = useCallback(
    (text, callback) => {
      if (!("speechSynthesis" in window) || isProcessingSpeech.current) return

      isProcessingSpeech.current = true
      setIsSpeaking(true)

      // Ensure recognition is completely stopped before speaking
      stopListening()

      // Wait to ensure recognition is fully stopped
      setTimeout(() => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setLastInteraction(Date.now())
          setIsSpeaking(false)
          isProcessingSpeech.current = false

          // Execute callback if provided (for navigation)
          if (callback) {
            setTimeout(() => {
              callback()
            }, 500)
          } else {
            // Only restart listening if no callback (no navigation)
            setTimeout(() => {
              if (!isSpeaking && !isProcessingSpeech.current) {
                startListening()
              }
            }, 1500)
          }
        }

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error)
          setIsSpeaking(false)
          isProcessingSpeech.current = false

          // Restart listening after error
          setTimeout(() => {
            if (!isSpeaking && !isProcessingSpeech.current) {
              startListening()
            }
          }, 1000)
        }

        window.speechSynthesis.speak(utterance)
      }, 300)
    },
    [stopListening, startListening, isSpeaking],
  )

  // Process voice commands
  const processCommand = useCallback(
    (command) => {
      const lowerCommand = command.toLowerCase().trim()

      if (lowerCommand.includes("navigation")) {
        speak("Navigating to navigation page. This page provides location and direction assistance.", () => {
            navigate("/navigation-assistant");
        })
      } else if (lowerCommand.includes("color") || lowerCommand.includes("color blindness")) {
        speak(
          "Navigating to color blindness tools page.",
          () => {
            navigate("/color-blindness-tools")
          },
        )
      } else if (lowerCommand.includes("snap") || lowerCommand.includes("camera")) {
        speak("Navigating to snap page. This page provides camera and image capture functionality.", () => {
          navigate("/camera")
        })
      } else if (lowerCommand.includes("upload")) {
        speak("Navigating to upload page.", () => {
          navigate("/upload")
        })
      } else if (lowerCommand.includes("home")) {
        speak("Navigating to home page. This is the main page with access to all features.", () => {
          navigate("/")
        })
      } else if (lowerCommand.includes("go back")) {
        speak("Going back to the previous page.", () => {
          navigate(-1)
        })
      } else if (lowerCommand.includes("help") || lowerCommand.includes("what can you do")) {
        const pageInfo = getCurrentPageInfo()
        speak(`${pageInfo.description} Available commands: ${pageInfo.commands}`)
      } else if (lowerCommand.includes("where am i") || lowerCommand.includes("current page")) {
        const pageInfo = getCurrentPageInfo()
        speak(`You are currently on the ${pageInfo.name}. ${pageInfo.description}`)
      } else {
        speak(
          "I didn't understand that command. Say 'help' to hear available options, or try commands like navigation, color blindness, snap, upload, home, or go back.",
        )
      }
    },
    [navigate, speak, getCurrentPageInfo],
  )

  // Periodic reminder and reactivation
  useEffect(() => {
    const checkForReactivation = () => {
      const timeSinceLastInteraction = Date.now() - lastInteraction

      // If no interaction for 60 seconds and not currently listening or speaking
      if (
        timeSinceLastInteraction > 60000 &&
        !isListening &&
        !isSpeaking &&
        !isProcessingSpeech.current &&
        recognitionState.current === "stopped"
      ) {
        const pageInfo = getCurrentPageInfo()
        speak(`Voice assistant is ready to help. You're on the ${pageInfo.name}. Say a command or 'help' for options.`)
      }
    }

    // Check every 30 seconds
    reminderTimeoutRef.current = setInterval(checkForReactivation, 30000)

    return () => {
      if (reminderTimeoutRef.current) {
        clearInterval(reminderTimeoutRef.current)
      }
    }
  }, [lastInteraction, isListening, isSpeaking, speak, getCurrentPageInfo])

  // Announce page changes
  useEffect(() => {
    const currentPath = location.pathname

    if (lastAnnouncedPage.current !== currentPath && hasSpokenWelcome.current) {
      lastAnnouncedPage.current = currentPath
      const pageInfo = getCurrentPageInfo()

      // Delay to allow page to load
      setTimeout(() => {
        speak(`Page loaded. ${pageInfo.description} Available commands: ${pageInfo.commands}`)
      }, 1000)
    }
  }, [location.pathname, speak, getCurrentPageInfo])

  // Initialize speech recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition || !("speechSynthesis" in window)) {
      setIsSupported(false)
      console.warn("Speech recognition or synthesis not supported in this browser")
      return
    }

    // Create recognition instance
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      recognitionState.current = "running"
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)

      // Only process commands if we're not speaking
      if (!isSpeaking && !isProcessingSpeech.current) {
        processCommand(result)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      recognitionState.current = "stopped"
      setIsListening(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Only speak error message for actual errors, not aborts
      if (event.error !== "aborted" && event.error !== "no-speech" && !isSpeaking) {
        speak("Sorry, there was an error with voice recognition. Please try the Talk to Assistant button.")
      }
    }

    recognition.onend = () => {
      recognitionState.current = "stopped"
      setIsListening(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognition) {
        recognition.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (reminderTimeoutRef.current) {
        clearInterval(reminderTimeoutRef.current)
      }
      recognitionState.current = "stopped"
      isProcessingSpeech.current = false
    }
  }, [processCommand, isSpeaking])

  // Speak welcome message and start listening on component mount
  useEffect(() => {
  if (isSupported && !hasSpokenWelcome.current && isEnabled) {
    hasSpokenWelcome.current = true;
    lastAnnouncedPage.current = location.pathname;

    // No delay for instant speech
    const pageInfo = getCurrentPageInfo();
    speak(
      `Welcome to the accessibility assistant. ${pageInfo.description} Available commands: ${pageInfo.commands}`,
    );
  }
}, [isSupported, speak, location.pathname, getCurrentPageInfo, isEnabled]);


  // Auto-focus the button on page load
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [])

  // Handle manual button click
  const handleButtonClick = () => {
    if (isListening || recognitionState.current === "running") {
      stopListening()
    } else if (!isSpeaking && !isProcessingSpeech.current) {
      const pageInfo = getCurrentPageInfo()
      speak(`Voice assistant activated. ${pageInfo.commands}`)
    }
  }

  // Disable Voice button for Android/Desktop (stops speech and listening)
  const handleDisableVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    stopListening();
    setIsSpeaking(false);
    setTranscript("");
    setIsEnabled(false);
  };

  const handleEnableVoice = () => {
    setIsEnabled(true);
    // Optionally, speak a welcome message or start listening again
    const pageInfo = getCurrentPageInfo();
    speak(
      `Voice assistant enabled. ${pageInfo.commands}`
    );
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Voice assistant is not supported in this browser. Please use a modern browser with speech recognition support.
        </p>
      </div>
    )
  }

  if (!isEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="shadow-lg rounded-lg p-4 border flex flex-col items-center">
          <Button
            onClick={handleEnableVoice}
            variant="default"
            size="lg"
            className="w-full"
          >
            Enable Voice Assistant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 shadow-lg rounded-lg p-4 border">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-center">
            <h3 className="font-semibold">Voice Assistant</h3>
            <p className="text-sm text-gray-600">
              {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready to help"}
            </p>
          </div>

          {transcript && <div className="text-xs text-gray-500 max-w-48 text-center">Last heard: "{transcript}"</div>}

          <Button
            ref={buttonRef}
            onClick={handleButtonClick}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="w-full"
            disabled={isSpeaking}
            aria-label={isListening ? "Stop listening to voice commands" : "Start listening to voice commands"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Talk to Assistant
              </>
            )}
          </Button>

          {/* Disable Voice button */}
          <Button
            onClick={handleDisableVoice}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!isSpeaking && !isListening}
          >
            Disable Voice
          </Button>

          <div className="text-xs text-gray-500 text-center max-w-48">
            Say: "help", "navigation", "color blindness", "snap", "upload", "home", or "go back"
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceAssistant