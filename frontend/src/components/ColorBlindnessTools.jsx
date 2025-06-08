"use client"

import { useState } from "react"
import Yelloweye from "../images/yellow-eye.png"
import Blueeye from "../images/blue-eye.png"
import Grayeye from "../images/gray-eye.png"
import Normaldoc from "../images/normal-doc.png"
import Bluedoc from "../images/blue-doc.png"
import Graydoc from "../images/gray-doc.png"
import Objects from "../images/OBJECTS.png"
import ColorBlindnessUploader from "./ColorBlindnessUploader"
import { useNavigate } from "react-router-dom"

export default function ColorBlindnessHome() {
  const [activeTab, setActiveTab] = useState("image")

  const navigate = useNavigate()

  // Function to handle example image click
  const handleExampleClick = (imageUrl, type) => {
    // Store the example image in sessionStorage
    sessionStorage.setItem("originalImage", imageUrl)
    sessionStorage.setItem("fileType", "image")

    navigate("/color-blindness-results")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">See the world through a more inclusive lens</h2>
        <p className="">
          Upload an image to see how it looks for users with{" "}
          <span className="text-blue-600 font-medium">Protanopia</span>,{" "}
          <span className="text-yellow-500 font-medium">Deuteranopia</span>,{" "}
          <span className="text-teal-500 font-medium">Tritanopia</span> or{" "}
          <span className="font-medium">Achromatopsia</span>.
        </p>
      </div>

      <ColorBlindnessUploader />

      <div className="mb-12">
        <h3 className="text-3xl font-bold text-center mb-4">Simulation Snippets</h3>

        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              className={`px-4 py-1 rounded-full text-sm ${
                activeTab === "image" ? "bg-teal-500 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("image")}
            >
              Image
            </button>
            
          </div>
        </div>

          <div className="max-w-sm g sm:max-w-5xl m-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            <img
              src={Yelloweye || "/placeholder.svg"}
              alt="Yellow eye simulation"
              className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleExampleClick(Yelloweye, "image")}
            />

            <img
              src={Blueeye || "/placeholder.svg"}
              alt="Blue eye simulation"
              className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleExampleClick(Blueeye, "image")}
            />

            <img
              src={Grayeye || "/placeholder.svg"}
              alt="Gray eye simulation"
              className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleExampleClick(Grayeye, "image")}
            />
          </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 mx-8">
        <div className="mb-6">
          <h3 className="text-2xl md:text-4xl lg:text-5xlfont-bold mb-2 flex items-center">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-md mr-2 gap-2 flex items-center">
              See <EyeIcon color="black" size={24} className="ml-1" />
            </span>
            The World Your Way
          </h3>
          <p className="text-md">
            No more guesswork or eye strain. SeeForMe lets you explore websites and images with clarity—tailored to your
            vision, so you can enjoy work, learning, and life in full color.
          </p>
        </div>
        <div className="people-image">
          <img src={Objects || "/placeholder.svg"} alt="Objects" className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}

function EyeIcon({ color = "black", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 16.5C9.24 16.5 7 14.26 7 11.5C7 8.74 9.24 6.5 12 6.5C14.76 6.5 17 8.74 17 11.5C17 14.26 14.76 16.5 12 16.5ZM12 8.5C10.34 8.5 9 9.84 9 11.5C9 13.16 10.34 14.5 12 14.5C13.66 14.5 15 13.16 15 11.5C15 9.84 13.66 8.5 12 8.5Z"
        fill={color}
      />
    </svg>
  )
}
