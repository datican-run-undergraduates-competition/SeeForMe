import "./App.css"
import "tailwindcss/tailwind.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import FeatureSection from "./components/FeatureSection"
import Footer from "./components/Footer"
import ColorBlindnessTool from "./components/ColorBlindnessTools"
import BlindnessAssistance from "./components/BlindnessAssistance"
import ResourcesSection from "./components/ResourcesSection"
import { ThemeProvider } from "./context/theme-context"
import ImageUpload from "./components/ImageUpload"
import ImageResult from "./components/ImageResult"
import CameraCapture from "./components/CameraCapture"
import ColorBlindnessResults from "./components/ColorBlindnessResults"
import { SpeechProvider } from "./context/speech-context"
import VoiceAssistant from "./components/VoiceAssistant"
import NavigationAssistant from "./components/NavigationAssistant"
import { VoiceAssistantProvider } from "./components/voice-assistant-context"
import VoiceAssistantToggle from "./components/voice-assistant-toggle"

function App() {
  return (
    <SpeechProvider>
      <ThemeProvider>
        <VoiceAssistantProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <header>
                <Navbar />
              </header>

              <main className="flex-grow">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <VoiceAssistant />
                        <HeroSection />
                        <FeatureSection />
                      </>
                    }
                  />
                  <Route
                    path="/color-blindness-tools"
                    element={
                      <>
                        <VoiceAssistant />
                        <ColorBlindnessTool />
                      </>
                    }
                  />
                  <Route
                    path="/color-blindness-results"
                    element={
                      <>
                        <VoiceAssistant />
                        <ColorBlindnessResults />
                      </>
                    }
                  />
                  <Route path="/navigation-assistant" element={<NavigationAssistant />} />
                  <Route
                    path="/blindness-assistance"
                    element={
                      <>
                        <VoiceAssistant />
                        <BlindnessAssistance />
                      </>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <>
                        <VoiceAssistant />
                        <ImageUpload />
                      </>
                    }
                  />
                  <Route path="/result" element={<ImageResult />} />
                  <Route path="/camera" element={<CameraCapture />} />
                  <Route
                    path="/resources"
                    element={
                      <>
                        <VoiceAssistant />
                        <ResourcesSection />
                      </>
                    }
                  />
                </Routes>
              </main>

              <Footer />
              {/* Voice assistant toggle with adaptive background and shadow */}
              <div className="fixed bottom-16 right-2 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <VoiceAssistantToggle />
              </div>
            </div>
          </Router>
        </VoiceAssistantProvider>
      </ThemeProvider>
    </SpeechProvider>
  )
}

export default App
