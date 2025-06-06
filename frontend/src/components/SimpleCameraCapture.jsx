"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Camera, X, Volume2, VolumeX } from "lucide-react"
import { getImageDescription } from "../services/geminiService"

function SimpleCameraCapture() {
  const [hasCamera, setHasCamera] = useState(false)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  const speak = (message) => {
    if (audioEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  // Initialize camera stream
  useEffect(() => {
    async function initializeCamera() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        setHasCamera(videoDevices.length > 0)

        if (videoDevices.length > 0) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          })
          setStream(mediaStream)
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
          }
          speak("Camera ready. You can now see the preview. Tap the Capture button when ready.")
        } else {
          speak("No camera detected on your device.")
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        speak("Unable to access camera. Please make sure you've granted camera permissions.")
      }
    }

    initializeCamera()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const captureImage = () => {
    speak("Capturing image")

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get the image data
    const imageData = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageData)

    speak("Image captured. Review or tap Describe This Image.")
  }

  const confirmImage = async () => {
    setLoadingMessage("Generating AI description...")
    speak("Analyzing image. This may take a moment.")

    try {
      localStorage.setItem("uploadedImage", capturedImage)
      const description = await getImageDescription(capturedImage)
      localStorage.setItem("imageDescription", description)
      navigate("/result", { state: { autoSpeak: true } })
    } catch (error) {
      console.error("Error getting description:", error)
      speak("Failed to generate description. Please try again.")
      setLoadingMessage("")
      setCapturedImage(null)
    }
  }

  const cancelCapture = () => {
    setCapturedImage(null)
    speak("Capture canceled. Ready to try again.")
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    speak(audioEnabled ? "Audio guidance turned off" : "Audio guidance turned on")
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        {/* Video preview */}
        <video 
          ref={videoRef}
          className={`w-full h-full object-contain ${capturedImage ? 'hidden' : ''}`}
          autoPlay 
          playsInline 
          muted 
        />

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured image preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}

        {/* Loading overlay */}
        {loadingMessage && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-yellow-500 border-yellow-200/20 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium text-white">{loadingMessage}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black p-4 flex justify-between items-center">
        {capturedImage ? (
          <>
            <button
              onClick={cancelCapture}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
              aria-label="Cancel and retake"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={confirmImage}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-bold"
              aria-label="Confirm and get description"
            >
              Describe This Image
            </button>

            <button
              onClick={toggleAudio}
              className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full"
              aria-label={audioEnabled ? "Disable audio guidance" : "Enable audio guidance"}
            >
              {audioEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              aria-label="Back to home"
            >
              Back
            </button>

            <button
              onClick={captureImage}
              className="bg-yellow-500 hover:bg-yellow-600 text-black p-4 rounded-full"
              aria-label="Capture image"
            >
              <Camera className="h-8 w-8" />
            </button>

            <button
              onClick={toggleAudio}
              className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full"
              aria-label={audioEnabled ? "Disable audio guidance" : "Enable audio guidance"}
            >
              {audioEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default SimpleCameraCapture
