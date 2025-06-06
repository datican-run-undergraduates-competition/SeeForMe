import { Link } from "react-router-dom";
import React from "react";
import whiteEye from "../images/white-eye.png";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center space-x-2">
            <img
              src={whiteEye}
              alt="WhiteEye"
              className="w-[50px] h-auto m-auto mr-2"
            />
            <h2 className="text-2xl md:text-3xl font-bold">SeeForMe</h2>
          </div>

          <p className="text-center max-w-2xl text-sm md:text-base">
            Creating powerful tools that make digital spaces accessible for
            everyone, serving as a digital guide for the blind and a visual aid
            for those with color blindness.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-4">
            <div className="flex items-center text-yellow-400 font-medium">
              Jump To <span className="ml-2">→</span>
            </div>
            <Link to="/" className="hover:underline transition-all">
              Home
            </Link>
            <Link
              to="/color-blindness-tools"
              className="hover:underline transition-all"
            >
              Color Blindness Tools
            </Link>
            <Link
              to="/blindness-assistance"
              className="hover:underline transition-all"
            >
              Blindness Assistance
            </Link>
            <Link to="/resources" className="hover:underline transition-all">
              Resources
            </Link>
          </div>
        </div>

        <div className="mt-8 text-right text-sm text-gray-400">
          <p>© Copyright by SeeForMe. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
