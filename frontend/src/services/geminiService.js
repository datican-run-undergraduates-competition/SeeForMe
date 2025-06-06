// This file handles all interactions with the Gemini API
import { GEMINI_CONFIG } from "../config"

/**
 * Sends an image to the Gemini API and gets a description
 * @param {string} imageBase64 - The base64-encoded image data (with or without the data:image/... prefix)
 * @returns {Promise<string>} - A promise that resolves to the image description
 */
export async function getImageDescription(imageBase64) {
  try {
    // Remove the data:image/jpeg;base64, part if it exists
    const base64Data = imageBase64.includes("base64,") ? imageBase64.split("base64,")[1] : imageBase64

    // Prepare the request to the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_CONFIG.API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Describe this image in detail. Focus on the main elements, colors, and overall scene. Be descriptive but concise.",
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generation_config: GEMINI_CONFIG.GENERATION_CONFIG,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Extract the description from the response
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error("Unexpected API response format")
    }
  } catch (error) {
    console.error("Error getting image description:", error)
    return "Failed to generate description. Please try again."
  }
}
