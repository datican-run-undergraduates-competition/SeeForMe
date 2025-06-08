"use client"

import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

const NavigationAssistant = () => {
  const [isActive, setIsActive] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [responseTime, setResponseTime] = useState(null)
  const [debugMode, setDebugMode] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("Not connected")

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const socketRef = useRef(null)
  const isCapturingRef = useRef(false)
  const utteranceRef = useRef(null)
  const requestTimestampRef = useRef(null)
  const audioContextRef = useRef(null)
  const manualTestRef = useRef(false)

  // Helper function to detect iOS devices
  const isIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  }

  // Debug log function
  const debugLog = (message, ...args) => {
    if (debugMode) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  }

  // Socket.IO connection - connect to your Flask server
  useEffect(() => {
    if (!isActive) return

    debugLog("Initializing Socket.IO connection")
    setConnectionStatus("Connecting...")

    // Create socket with explicit transports for better iOS compatibility
    const socket = io("https://see-for-me-backend.kindcoast-321ea27c.spaincentral.azurecontainerapps.io/", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true, // Force a new connection each time
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
      setError(null)
      setConnectionStatus("Connected")
      debugLog("Socket connected to Flask server")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      setConnectionStatus("Disconnected")
      debugLog("Socket disconnected from Flask server")
    })

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err)
      setError(`Connection error: ${err.message}`)
      setIsConnected(false)
      setConnectionStatus(`Connection error: ${err.message}`)
    })

    socket.on("server_response", (data) => {
      debugLog("Received server response:", data)
      const message = data.message || "No guidance available"
      setLastMessage(message)

      // Calculate response time in seconds
      if (requestTimestampRef.current) {
        const elapsedTime = (Date.now() - requestTimestampRef.current) / 1000 // Convert to seconds
        setResponseTime(elapsedTime.toFixed(2)) // Format to 2 decimal places
        debugLog(`Response time: ${elapsedTime.toFixed(2)} seconds`)
      }

      // Play completion sound
      playCompletionSound()

      // Trigger haptic feedback for completion if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 200])
      }

      // For iOS, we need to handle speech differently
      if (isIOS()) {
        // Use a timeout to break the call stack
        setTimeout(() => {
          speakMessage(message)
        }, 50)
      } else {
        speakMessage(message)
      }
    })

    // Add a ping mechanism to keep the connection alive
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        debugLog("Sending ping to keep connection alive")
        socket.emit("ping")
      }
    }, 15000) // Every 15 seconds

    return () => {
      clearInterval(pingInterval)
      socket.disconnect()
      socketRef.current = null
      setConnectionStatus("Not connected")
    }
  }, [isActive, debugMode])

  // Initialize Audio Context for feedback sounds
  useEffect(() => {
    // Initialize AudioContext on first user interaction to comply with browser policies
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
    }

    // Add event listeners for user interaction
    const handleUserInteraction = () => {
      initAudioContext()
      // Remove event listeners after initialization
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play start sound function
  const playStartSound = () => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime) // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.2) // Ramp up to A5

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.start()
    oscillator.stop(audioContextRef.current.currentTime + 0.3)
  }

  // Play completion sound function
  const playCompletionSound = () => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime) // A5 note
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 0.3) // Ramp down to A4

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.4)

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.start()
    oscillator.stop(audioContextRef.current.currentTime + 0.4)
  }

  // Capture high-quality frame function
  async function captureHighQualityFrame(videoElement) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Set to higher resolution for better quality
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight

        // Draw the video frame to the canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        // For iOS, we'll use JPEG instead of WebP for better compatibility
        const imageFormat = isIOS() ? "image/jpeg" : "image/webp"
        const imageQuality = isIOS() ? 0.8 : 0.95

        // Convert to image format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob from canvas"))
              return
            }

            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = (e) => reject(e)
            reader.readAsArrayBuffer(blob)
          },
          imageFormat,
          imageQuality,
        )
      } catch (err) {
        reject(err)
      }
    })
  }

  // Capture and send two high-quality frames
  async function captureAndSendTwoFrames(videoElement) {
    try {
      if (isSpeaking) {
        debugLog("Not capturing frames because speech is in progress")
        return
      }

      isCapturingRef.current = true
      debugLog("Starting to capture high-quality frames")

      // Play start sound and trigger haptic feedback
      playStartSound()
      if (navigator.vibrate) {
        navigator.vibrate(100) // Simple vibration for start
      }

      // Capture first frame
      debugLog("Capturing first frame")
      const frame1 = await captureHighQualityFrame(videoElement)
      debugLog("First frame captured, size:", frame1.byteLength)

      // Wait a moment before capturing second frame
      await new Promise((res) => setTimeout(res, 500))

      // Capture second frame
      debugLog("Capturing second frame")
      const frame2 = await captureHighQualityFrame(videoElement)
      debugLog("Second frame captured, size:", frame2.byteLength)

      const frames = [frame1, frame2]

      debugLog("Sending batch of", frames.length, "frames to Flask server")
      if (socketRef.current && socketRef.current.connected) {
        // Record the timestamp before sending the frames
        requestTimestampRef.current = Date.now()

        // For iOS, we need to ensure the frames are properly formatted
        const frameData = frames.map((frame) => {
          // If frame is already an ArrayBuffer, use it directly
          if (frame instanceof ArrayBuffer) {
            return frame
          }
          // Otherwise, try to convert it
          return frame
        })

        socketRef.current.emit("send_frames_batch", { frames: frameData })
        debugLog("Frames sent to server")
      } else {
        console.error("Socket not connected, can't send frames")
        setError("Not connected to server. Please try again.")
      }
    } catch (err) {
      console.error("Error capturing frames:", err)
      setError(`Error capturing frames: ${err.message}`)
    } finally {
      isCapturingRef.current = false
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Initialize camera
  const initCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser")
      }

      // For iOS, we need to use more conservative video constraints
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: isIOS() ? { ideal: 1280 } : { ideal: 1920 },
          height: isIOS() ? { ideal: 720 } : { ideal: 1080 },
        },
      }

      debugLog("Requesting camera with constraints:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setError(null)

        // For iOS, we need to wait for the video to be ready
        if (isIOS()) {
          videoRef.current.onloadedmetadata = () => {
            debugLog(
              "Video metadata loaded, video dimensions:",
              videoRef.current.videoWidth,
              "x",
              videoRef.current.videoHeight,
            )
          }
        }
      }
    } catch (err) {
      console.error("Camera initialization error:", err)

      let errorMessage = "Camera access error"

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Camera access denied. Please enable camera permissions."
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on this device."
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application."
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        errorMessage = "Camera cannot satisfy the requested constraints."
      } else if (err.name === "NotSupportedError") {
        errorMessage = "Camera access is not supported by this browser."
      } else if (err.name === "TypeError" && err.message.includes("mediaDevices")) {
        errorMessage = "Camera API not available. Try using HTTPS."
      }

      setError(errorMessage)
      setIsActive(false)
    }
  }

  const startCaptureCycle = () => {
    if (!isActive || !isConnected || isSpeaking || isCapturingRef.current) {
      debugLog("Not starting capture cycle:", {
        isActive,
        isConnected,
        isSpeaking,
        isCapturing: isCapturingRef.current,
      })
      return
    }

    const video = videoRef.current

    if (!video) {
      console.error("Video element not found")
      return
    }

    if (video.readyState < 2) {
      debugLog("Video not ready, waiting...")
      setTimeout(startCaptureCycle, 100)
      return
    }

    debugLog("Starting capture cycle")
    captureAndSendTwoFrames(video)
  }

  const speakMessage = (message) => {
    if (!message || isSpeaking) return

    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported")
      setError("Text-to-speech is not supported by this browser")
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    setIsSpeaking(true)
    debugLog("Starting to speak:", message)

    const utterance = new SpeechSynthesisUtterance(message)
    utteranceRef.current = utterance

    // Set properties
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // For iOS, try to use a voice that's likely to be available
    if (isIOS()) {
      try {
        // Get available voices
        const voices = window.speechSynthesis.getVoices()
        debugLog("Available voices:", voices.length)

        // Try to find an English voice
        const englishVoice = voices.find((voice) => voice.lang.includes("en") && voice.localService)

        if (englishVoice) {
          debugLog("Using voice:", englishVoice.name)
          utterance.voice = englishVoice
        }
      } catch (e) {
        console.error("Error setting voice:", e)
      }
    }

    // Set up event handlers
    utterance.onstart = () => {
      debugLog("Speech started")
    }

    utterance.onend = () => {
      debugLog("Speech completed")
      setIsSpeaking(false)

      // Only start next capture cycle if this wasn't a manual test
      if (!manualTestRef.current) {
        // Wait a short delay before starting next capture cycle
        setTimeout(() => {
          debugLog("Starting next capture cycle after speech")
          startCaptureCycle()
        }, 500)
      }

      manualTestRef.current = false
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event)
      setIsSpeaking(false)

      if (!manualTestRef.current) {
        setTimeout(startCaptureCycle, 500)
      }

      manualTestRef.current = false
    }

    // Speak the message
    window.speechSynthesis.speak(utterance)

    // iOS workaround - keep checking and resuming speech
    if (isIOS()) {
      // This interval keeps speech going on iOS
      const iosInterval = setInterval(() => {
        // If speech synthesis is paused, resume it
        if (window.speechSynthesis.paused) {
          debugLog("Resuming paused speech")
          window.speechSynthesis.resume()
        }

        // If we're no longer speaking this utterance, clear the interval
        if (!window.speechSynthesis.speaking || !isSpeaking) {
          clearInterval(iosInterval)
        }
      }, 250)

      // Safety timeout to prevent the interval from running forever
      setTimeout(() => {
        clearInterval(iosInterval)
      }, 15000) // 15 seconds max
    }

    // Safety timeout in case onend doesn't fire
    const timeoutDuration = Math.max(5000, message.length * 100)
    setTimeout(() => {
      if (isSpeaking && utteranceRef.current === utterance) {
        console.warn("Speech timeout reached, forcing next cycle")
        setIsSpeaking(false)

        if (!manualTestRef.current) {
          startCaptureCycle()
        }

        manualTestRef.current = false
      }
    }, timeoutDuration)
  }

  // Toggle active state
  const toggleActive = () => {
    const newState = !isActive
    setIsActive(newState)

    if (newState) {
      // For iOS, we need to initialize audio and speech in direct response to user interaction
      if (isIOS()) {
        debugLog("iOS device detected, initializing audio context and speech")

        // Initialize audio context
        if (!audioContextRef.current) {
          try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
            // Play a silent sound to unlock audio
            const silentSound = audioContextRef.current.createBuffer(1, 1, 22050)
            const source = audioContextRef.current.createBufferSource()
            source.buffer = silentSound
            source.connect(audioContextRef.current.destination)
            source.start(0)
            debugLog("Audio context initialized on iOS")
          } catch (err) {
            console.error("Failed to initialize audio context:", err)
          }
        }

        // Initialize speech synthesis
        if (window.speechSynthesis) {
          // Speak an empty utterance to initialize speech synthesis
          const silentUtterance = new SpeechSynthesisUtterance(" ")
          silentUtterance.volume = 0.01 // Very low but not zero
          silentUtterance.onend = () => debugLog("Silent speech completed, speech system initialized")
          silentUtterance.onerror = (e) => console.error("Speech initialization error:", e)
          window.speechSynthesis.speak(silentUtterance)
          debugLog("Speech synthesis initialized on iOS")
        }
      }

      initCamera()
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }

      setIsSpeaking(false)
    }
  }

  // Start capture cycle when active and connected
  useEffect(() => {
    if (isActive && isConnected && !isSpeaking && !isCapturingRef.current) {
      debugLog("Initial capture cycle starting")
      startCaptureCycle()
    }
  }, [isActive, isConnected, isSpeaking, debugMode])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Test the connection by sending a manual request
  const testConnection = () => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError("Not connected to server. Please activate the assistant first.")
      return
    }

    debugLog("Sending test request to server")
    requestTimestampRef.current = Date.now()
    socketRef.current.emit("test_connection", { test: true })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl md:mx-auto mx-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isActive} onChange={toggleActive} />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span className="text-lg font-medium">{isActive ? "Active" : "Inactive"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isConnected ? "text-emerald-500" : "text-red-500"}
            >
              {isConnected ? (
                <>
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </>
              ) : (
                <>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </>
              )}
            </svg>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        <div className="relative aspect-[8/16] sm:aspect-video max-h-[50vh] w-full bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isActive ? "opacity-100" : "opacity-50"}`}
          />

          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white opacity-50"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          )}

          {isSpeaking && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12.01" y2="19"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <span className="text-xs">Speaking...</span>
            </div>
          )}

          {isCapturingRef.current && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="text-xs">Capturing...</span>
            </div>
          )}
        </div>

        <button
          className={`w-full py-4 text-lg font-medium rounded-md text-white transition-colors ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
          onClick={toggleActive}
        >
          {isActive ? "Stop Navigation Assistant" : "Start Navigation Assistant"}
        </button>


        <div className="p-4 rounded-lg">
          <h3 className="font-medium mb-1">Status:</h3>
          <p className="mb-2">
            {isSpeaking
              ? "Speaking guidance..."
              : isCapturingRef.current
                ? "Capturing frames..."
                : isConnected
                  ? "Ready to capture"
                  : "Waiting for connection"}
          </p>

          <h3 className="font-medium mb-1">Connection:</h3>
          <p className="mb-2">{connectionStatus}</p>

          {lastMessage && (
            <>
              <h3 className="font-medium mb-1">Last Guidance:</h3>
              <p>{lastMessage}</p>
            </>
          )}
          {responseTime !== null && (
            <>
              <h3 className="font-medium mb-1">Response Time:</h3>
              <p>{responseTime} seconds</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavigationAssistant
