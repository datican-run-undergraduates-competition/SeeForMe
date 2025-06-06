// Configuration settings for the application
// In a production environment, these would be loaded from environment variables

// Gemini API configuration
export const GEMINI_CONFIG = {
    // Replace with your actual API key or use environment variables in production
    // For Vite-based React apps, environment variables should be prefixed with VITE_
    // e.g., import.meta.env.VITE_GEMINI_API_KEY
    API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY",
  
    // API endpoint
    ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent",
  
    // Generation parameters
    GENERATION_CONFIG: {
      temperature: 0.4,
      top_p: 1,
      top_k: 32,
      max_output_tokens: 300,
    },
  }
  