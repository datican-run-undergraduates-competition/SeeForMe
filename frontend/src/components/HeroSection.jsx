import React, { useState } from "react";
import { Link } from "react-router-dom";
import heroimage from "../images/heroimage.png";
import { useSpeech } from "../context/speech-context";

function HeroSection() {
  return (
    <div
      className="max-w-7xl hero-wrapper flex flex-col p-2 gap-8 text-center m-auto items-center 
        justify-center mt-4 md:text-start md:items-start md:gap-2 md:flex md:flex-row md:justify-between md:px-16"
    >
      <div className="hero-text md:mt-20">
        <h1 className="text-3xl lg:text-5xl leading-tight mb-4 font-bold ">
          Bringing <span className="text-[#FFC107]">Clarity</span>
          <br />
          to Every Kind of <span className="text-[#00897B]">Vision</span>
        </h1>
        <p className="text-lg mb-8">
          Empowering color-blind and visually impaired <br />
          users with tools for a more inclusive <br />
          digital experience.
        </p>

        <div>
          <Link
            to="/navigation-assistant"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Access Camera Navigation
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img
          src={heroimage}
          alt="logo"
          className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
        />
      </div>
    </div>
  );
}

export default HeroSection;
