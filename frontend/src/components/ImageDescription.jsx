"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Upload, Camera, Volume2, Download, Share2 } from "lucide-react"

export default function ImageDescription() {
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const fileInputRef = useRef(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const fromCamera = searchParams.get("fromCamera") === "true"

  useEffect(() => {
    // Check if we have a captured image from the camera
    if (fromCamera) {
      const capturedImage = localStorage.getItem("capturedImage")
      if (capturedImage) {
        setImage(capturedImage)
        generateDescription(capturedImage)
        // Clean up after using
        localStorage.removeItem("capturedImage")
      }
    }
  }, [fromCamera])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
        generateDescription(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
        generateDescription(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateDescription = (imageData) => {
    setLoading(true)

    // In a real app, you would send the image to your backend for processing with Gemini API
    // For demo purposes, we'll simulate a response after a delay
    setTimeout(() => {
      const sampleDescriptions = [
        "The image shows a park with trees and a walking path. There are several people walking along the path. In the background, there's a small lake with ducks swimming. The weather appears to be sunny.",
        "This is a photograph of a city street with tall buildings on both sides. There are several cars and pedestrians visible. The street has traffic lights at an intersection. Some shops can be seen at the ground level of the buildings. The sky is clear blue.",
        "The image depicts a classroom setting with desks arranged in rows. There's a whiteboard at the front with some writing on it. Several students are seated at the desks, and a teacher is standing near the whiteboard explaining something.",
      ]

      const randomDescription = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)]
      setDescription(randomDescription)
      setLoading(false)

      // Read the description aloud if audio is enabled
      if (audioEnabled) {
        const utterance = new SpeechSynthesisUtterance(randomDescription)
        speechSynthesis.speak(utterance)
      }
    }, 2000)
  }

  const speakDescription = () => {
    if (description) {
      speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(description)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Image Description</h1>

      {!image ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-medium mb-2">Upload an image to describe</h2>
            <p className="text-gray-500 mb-6">
              Drag and drop an image here, or click the button below to select a file
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </button>

            <Link
              to="/blindness-assistance/camera"
              className="border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-50"
            >
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <img src={image || "/placeholder.svg"} alt="Uploaded image" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-medium mb-2">Image Description</h2>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-t-yellow-500 border-yellow-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Generating description...</p>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-1 min-h-[200px] mb-4 p-3 border border-gray-300 rounded-md"
                    placeholder="Description will appear here..."
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={speakDescription}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center"
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Read Aloud
                    </button>

                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Save
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setImage(null)
                setDescription("")
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Try Another Image
            </button>

            <Link to="/blindness-assistance" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Back to Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
