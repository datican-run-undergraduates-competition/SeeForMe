import { Link } from "react-router-dom"
import { Camera, Upload, FileText, Info } from "lucide-react"
import blindnessImage from "../images/blind-walking.png"
import keyboardImage from "../images/keyboard.png"

export default function BlindnessAssistanceHome() {
  return (
    <div className="max-w-7xl flex flex-col items-center justify-center p-4 gap-8 m-auto">
      <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-start md:items-start md:justify-between gap-8">
        <div className="md:mt-20 gap-4">
          <h1 className="text-3xl lg:text-5xl tracking-extra-wide mb-4 font-bold">
            Empowering Vision <br />
            Through <span className="text-yellow-400">Technology</span>
          </h1>
          <p className="text-lg mb-8">
            From reading pages to recognizing surroundings, explore tools that support blind and low-vision users in
            their digital journey
          </p>
          <Link
            to="/navigation-assistant"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Access Camera Navigation
          </Link>
        </div>
        <div className="">
          <img
            src={blindnessImage || "/placeholder.svg"}
            alt="Person guiding another person"
            className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
          />
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Let Technology Be Your Eyes</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          <span className="text-green-600 font-medium">Available only on mobile and tablet</span> - our camera
          navigation tool helps to detect surroundings or{" "}
          <span className="text-blue-600 font-medium">Upload an image or PDF</span> to get spoken or text descriptions
        </p>

        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
          <Link
            to="/upload"
            className="border border-gray-200 rounded-md p-6 flex flex-col items-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 flex items-center justify-center text-blue-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-blue-600 font-medium">Upload Image</span>
          </Link>

          
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="">
          <h1 className="text-3xl lg:text-5xl tracking-extra-wide mb-4 font-bold">Navigate with Your Keyboard</h1>
          <p className="mb-6 max-w-md">
            Discover essential keyboard shortcuts that help you navigate websites smoothly and efficiently—no mouse
            needed
          </p>
        </div>

        <div className="">
          <img
            src={keyboardImage || "/placeholder.svg"}
            alt="Keyboard illustration"
            className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
          />
        </div>
      </div>

      {/* Keyboard shortcuts section - keeping as is from your original component */}
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-32">
        <div className="space-y-6 md:w-1/2">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <div>
              <p className="font-medium text-blue-500">Tab Key</p>
              <p className="text-sm">Move forward through interactive elements (links, buttons, input fields)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-yellow-500 font-bold">•</span>
            <div>
              <p className="font-medium text-yellow-500">Shift + Tab Key</p>
              <p className="text-sm">Move backward through interactive elements</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <div>
              <p className="font-medium text-blue-500">Enter Key</p>
              <p className="text-sm">Activate selected link or button</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-green-500 font-bold">•</span>
            <div>
              <p className="font-medium text-green-500">Arrow Keys</p>
              <p className="text-sm">Navigate within menus, sliders, and reading sections</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-yellow-500 font-bold">•</span>
            <div>
              <p className="font-medium text-yellow-500">Ctrl + O / Cmd + O</p>
              <p className="text-sm">Reset zoom to default</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:w-1/2">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 font-bold">•</span>
            <div>
              <p className="font-medium text-yellow-500">Ctrl + F (Windows) or Cmd + F (Mac)</p>
              <p className="text-sm">Find a word on the page</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 font-bold">•</span>
            <div>
              <p className="font-medium text-green-500">Alt + ← / →</p>
              <p className="text-sm">Go back / forward in browser history</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <div>
              <p className="font-medium text-blue-500">Ctrl + + / - (Windows) or Cmd + + / - (Mac)</p>
              <p className="text-sm">Zoom in / out</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 font-bold">•</span>
            <div>
              <p className="font-medium text-green-500">Ctrl + L / Alt + D (Windows) or Cmd + L (Mac)</p>
              <p className="text-sm">Focus address bar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 font-bold">•</span>
            <div>
              <p className="font-medium text-yellow-500">Insert + F7 (JAWS) or Caps Lock + Space, then L (NVDA)</p>
              <p className="text-sm">List links on page</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
