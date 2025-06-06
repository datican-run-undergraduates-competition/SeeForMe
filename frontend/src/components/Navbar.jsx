import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { ThemeSwitcher } from "./ThemeSwitcher"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center dark:text-blue-400 light:text-[#0057B7] sepia:text-amber-700">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="ml-2 text-xl font-bold">SeeForMe</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/color-blindness-tools" className="nav-link">
              Color Blindness Tools
            </Link>
            <Link to="/blindness-assistance" className="nav-link">
              Blindness Assistance
            </Link>
            <Link to="/resources" className="nav-link">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button 
              onClick={toggleMenu}
              className="lg:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon
                icon={isOpen ? faTimes : faBars}
                className="text-2xl dark:text-blue-400 light:text-[#2667FF] sepia:text-amber-700"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 h-full w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <Link 
              to="/" 
              className="flex items-center dark:text-blue-400 light:text-[#0057B7] sepia:text-amber-700"
              onClick={toggleMenu}
            >
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="ml-2 text-xl font-bold">SeeForMe</span>
            </Link>
            <button 
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Close menu"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-2xl dark:text-blue-400 light:text-[#2667FF] sepia:text-amber-700"
              />
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-6">
            <Link 
              to="/" 
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/color-blindness-tools" 
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Color Blindness Tools
            </Link>
            <Link 
              to="/blindness-assistance" 
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Blindness Assistance
            </Link>
            <Link 
              to="/resources" 
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Resources
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

