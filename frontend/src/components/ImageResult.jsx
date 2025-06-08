"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Volume2, VolumeX, Download, Share2, RefreshCw, Camera } from "lucide-react"
import { getImageDescription } from "../services/geminiService"

function ImageResult() {
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const audioEnabledRef = useRef(audioEnabled)

  // Keep ref in sync with state
  useEffect(() => {
    audioEnabledRef.current = audioEnabled
  }, [audioEnabled])

  // Speak a message for blind users
  const speak = useCallback((message, callback) => {
    if (!audioEnabledRef.current || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel() // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 1.1 // Slightly faster than normal

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      if (callback) callback()
    }
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  useEffect(() => {
    // Retrieve the image and description from localStorage
    const storedImage = localStorage.getItem("uploadedImage")
    const storedDescription = localStorage.getItem("imageDescription")

    if (!storedImage) {
      // If there's no image, redirect back to upload
      navigate("/upload")
      return
    }

    setImage(storedImage)
    setDescription(storedDescription || "")

    // Auto-speak the description if coming from upload or camera
    const shouldAutoSpeak = location.state?.autoSpeak
    if (shouldAutoSpeak && storedDescription) {
      speak("Here's what I see in your image: " + storedDescription)
    } else {
      speak("Image description ready. Tap Read Aloud to hear the description.")
    }
    // eslint-disable-next-line
  }, [navigate, location.state, speak])

  const handleReadAloud = () => {
    if (description) {
      speak(description)
    } else {
      speak("No description available")
    }
  }

  const handleSave = () => {
    // Create a text file with the description
    const element = document.createElement("a")
    const file = new Blob([description], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "image-description.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    speak("Description saved as a text file")
  }

  const handleShare = () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          title: "Image Description",
          text: description,
        })
        .then(() => speak("Description shared successfully"))
        .catch((error) => {
          console.log("Error sharing:", error)
          speak("Could not share the description")
        })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(description)
        .then(() => {
          speak("Description copied to clipboard")
          alert("Description copied to clipboard!")
        })
        .catch(() => {
          speak("Failed to copy description")
          alert("Failed to copy description")
        })
    }
  }

  const handleRegenerateDescription = async () => {
    if (!image) return

    setIsRegenerating(true)
    speak("Regenerating description. This may take a moment.")

    try {
      const newDescription = await getImageDescription(image)
      setDescription(newDescription)
      localStorage.setItem("imageDescription", newDescription)
      speak("New description generated: " + newDescription)
    } catch (error) {
      console.error("Error regenerating description:", error)
      speak("Failed to regenerate description. Please try again.")
      alert("Failed to regenerate description. Please try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleTryAnother = () => {
    localStorage.removeItem("uploadedImage")
    localStorage.removeItem("imageDescription")

    // Navigate back to the camera page
    navigate("/camera")
    speak("Ready to capture a new image")
  }

  const handleBackToTools = () => {
    // Navigate back to the landing page
    navigate("/upload")
    speak("Back to home page")
  }

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const next = !prev
      if (next) {
        // Only speak if enabling audio
        setTimeout(() => speak("Audio guidance turned on"), 100)
      } else {
        window.speechSynthesis.cancel()
      }
      return next
    })
  }

  if (!image) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200/20 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Image Description</h1>
        <button
          onClick={toggleAudio}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
          aria-label={audioEnabled ? "Disable audio guidance" : "Enable audio guidance"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-700">
            <img src={image || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Description</h2>
            <button
              onClick={handleRegenerateDescription}
              disabled={isRegenerating}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
              aria-label="Regenerate description"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 flex-grow mb-4 overflow-y-auto max-h-[300px]">
            {isRegenerating ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-t-yellow-500 border-yellow-200/20 rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-gray-200">{description}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleReadAloud}
              disabled={isSpeaking || !audioEnabled}
              className={`flex items-center justify-center ${
                isSpeaking ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-3 rounded-md`}
              aria-label="Read description aloud"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              {isSpeaking ? "Speaking..." : "Read Aloud"}
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-md"
              aria-label="Save description as text file"
            >
              <Download className="mr-2 h-5 w-5" />
              Save
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-md"
              aria-label="Share description"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleTryAnother}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-md flex items-center"
          aria-label="Capture another image"
        >
          <Camera className="mr-2 h-5 w-5" />
          Capture Another
        </button>

        <button
          onClick={handleBackToTools}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
          aria-label="Back to upload"
        >
          Back to Upload
        </button>
      </div>
    </div>
  )
}

export default ImageResult