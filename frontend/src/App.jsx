import { useState } from "react";
import "./App.css";
import React from "react";
import "tailwindcss/tailwind.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import ColorBlindnessTool from "./components/ColorBlindnessTools";
import BlindnessAssistance from "./components/BlindnessAssistance";
import ResourcesSection from "./components/ResourcesSection";
import { ThemeProvider } from "./context/theme-context";
import ImageUpload from "./components/ImageUpload";
import ImageResult from "./components/ImageResult";
import CameraCapture from "./components/CameraCapture";
import ColorBlindnessResults from "./components/ColorBlindnessResults";
import { SpeechProvider } from "./context/speech-context";
import VoiceAssistant from "./components/VoiceAssistant";
import NavigationAssistant from "./components/NavigationAssistant";
// import SimpleCameraCapture from './components/SimpleCameraCapture';

function App() {
  // const CameraComponent = SimpleCameraCapture
  return (
    <SpeechProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
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
            <Route
              path="/navigation-assistant"
              element={<NavigationAssistant />}
            />
            <Route
              path="/blindness-assistance"
              element={
                <>
                <VoiceAssistant />
                  <BlindnessAssistance />
                </>
              }
            />
            <Route path="/upload" element={<><VoiceAssistant /><ImageUpload /></>} />
            <Route path="/result" element={<ImageResult />} />
            <Route path="/camera" element={<><VoiceAssistant /><CameraCapture /></>} />
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
          <Footer />
        </Router>
      </ThemeProvider>
    </SpeechProvider>
  );
}

export default App;
