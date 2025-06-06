import React from "react";
import colorSimulator from "../images/color-simulator.png";
import imageDescriber from "../images/image-describer.png";
import lightDarkMode from "../images/light-dark-mode.png";
import texttoSpeech from "../images/text-to-speech.png";
import speechAssistant from "../images/speech-assistant.png";
import documentScanner from "../images/document-scanner.png";
import cameraNavigation from "../images/camera-navigation.png";
import resourceLibrary from "../images/resource-library.png";
import illustration from "../images/Illustration.png";
import story from "../images/story.png";

export default function FeatureSection() {
  const features = [
    {
      title: "Color Simulator",
      imageUrl: colorSimulator,
    },
    {
      title: "Image Describer",
      imageUrl: imageDescriber,
    },
    {
      title: "Light/Dark/Grayscale Mode",
      imageUrl: lightDarkMode,
    },
    {
      title: "Text To Speech",
      imageUrl: texttoSpeech,
    },
    {
      title: "Speech Assistant",
      imageUrl: speechAssistant,
    },
    {
      title: "Document Scanner",
      imageUrl: documentScanner,
    },
    {
      title: "Camera Navigation",
      imageUrl: cameraNavigation,
    },
    {
      title: "Resource Library",
      imageUrl: resourceLibrary,
    },
  ];

  return (
    <section className="max-w-7xl items-center justify-center m-auto w-full py-12 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center justify-center p-4"
            >
              <div
                className={`relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-2`}
              >
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-sm md:text-base font-medium text-center">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
            Who We Are
          </h2>
          <p className="text-center">
            SeeForMe is an accessibility-driven platform committed to supporting
            individuals with color blindness and visual impairments. We believe
            that technology should be inclusive, intuitive, and empowering for
            every user
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center md:text-left">
              Our Mission
            </h2>
            <p className="text-center md:text-left">
              To make the digital world accessible to all—by offering tools that
              simulate color blindness, provide voice-assisted navigation, and
              simplify content consumption for blind users
            </p>
          </div>
          <div className="md:w-1/4">
            <img
              src={illustration}
              alt="illustration"
              className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-16">
          <div className="md:w-1/4 order-2 md:order-1">
            <img
              src={story}
              alt="illustration"
              className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
            />
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center md:text-right">
              Our Story
            </h2>
            <p className="text-center md:text-right">
              With over 2.2 billion people globally affected by some form of
              visual impairment or blindness (WHO), SeeForMe was created to
              address the gaps in accessibility. Whether you're navigating the
              web, identifying colors, or seeking a clearer digital
              experience—our tools are built for you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
