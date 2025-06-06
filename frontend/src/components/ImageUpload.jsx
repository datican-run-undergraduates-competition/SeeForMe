"use client"

import { useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Upload, Camera, Volume2, VolumeX } from "lucide-react"
import { getImageDescription } from "../services/geminiService"

function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Processing your image...")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  // Speak a message for blind users
  const speak = (message) => {
    if (audioEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel() // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 1.1 // Slightly faster than normal
      window.speechSynthesis.speak(utterance)
    }
  }

  // Speak welcome message when component mounts
  useState(() => {
    speak("Welcome to image description. You can use your camera or upload an image to get a detailed description.")
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      speak("Please upload an image file")
      alert("Please upload an image file")
      return
    }

    setIsLoading(true)
    setLoadingMessage("Processing your image...")
    speak("Processing your image. This may take a moment.")

    // Create a FileReader to read the image
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const imageData = e.target.result

        // Store the image data in localStorage
        localStorage.setItem("uploadedImage", imageData)

        setLoadingMessage("Generating AI description...")
        speak("Analyzing image to generate a description.")

        const description = await getImageDescription(imageData)

        // Store the description
        localStorage.setItem("imageDescription", description)

        navigate("/result", { state: { autoSpeak: true } })
      } catch (error) {
        console.error("Error processing image:", error)
        setIsLoading(false)
        speak("Failed to process the image. Please try again.")
        alert("Failed to process the image. Please try again.")
      }
    }

    reader.readAsDataURL(file)
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    speak(audioEnabled ? "Audio guidance turned off" : "Audio guidance turned on")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Image Description</h1>
        <button
          onClick={toggleAudio}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
          aria-label={audioEnabled ? "Disable audio guidance" : "Enable audio guidance"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Camera option */}
        <div className="rounded-lg p-8 flex flex-col items-center text-center border-2 border-yellow-500">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
            <Camera className="h-10 w-10 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Use Camera</h2>
          <p className="text-gray-300 mb-6">Use your device's camera to capture and describe what's around you</p>
          <Link
            to="/camera"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full py-4 rounded-md text-lg flex items-center justify-center"
            aria-label="Open camera"
          >
            <Camera className="mr-2 h-6 w-6" />
            Open Camera
          </Link>
        </div>

        {/* Upload option */}
        <div
          className={`rounded-lg p-8 flex flex-col items-center text-center ${
            isDragging ? "border-2 border-blue-500" : "border border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Image</h2>
          <p className="text-gray-300 mb-6">Select an image from your device or drag and drop it here</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-md text-lg flex items-center justify-center"
            aria-label="Select image to upload"
          >
            <Upload className="mr-2 h-6 w-6" />
            Select Image
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="p-8 rounded-lg max-w-md text-center">
            <div className="w-16 h-16 border-4 border-t-yellow-500 border-yellow-200/20 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium text-white mb-2">{loadingMessage}</p>
            <p className="text-gray-400">This may take a few moments</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/blindness-assistance"
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md inline-block"
          aria-label="Back to home"
        >
          Back
        </Link>
      </div>
    </div>
  )
}

export default ImageUpload
