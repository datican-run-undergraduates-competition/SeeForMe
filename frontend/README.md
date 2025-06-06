# SeeForMe

**SeeForMe** is an accessibility-driven web app that empowers color-blind and visually impaired users with tools for a more inclusive digital experience.  
It provides features like color blindness simulation, image description (with AI), camera navigation, and a voice assistant for hands-free interaction.

---

## Features

- **Voice Assistant:** Navigate and use the app with voice commands (except on iOS, where only speech output is available).
- **Color Blindness Tools:** Upload images and see how they appear to users with different types of color blindness.
- **Image Description:** Get AI-generated descriptions of images using Google Gemini API.
- **Camera Navigation:** Use your device’s camera for real-time navigation assistance (mobile/tablet recommended).
- **Blindness Assistance:** Tools and guides for blind and low-vision users.
- **Resources:** Curated articles and external tools for accessibility.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/see-for-me.git
cd see-for-me
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your API key

- Copy `.env.example` to `.env`:

  ```bash
  cp .env.example .env
  ```

- Get your [Google Gemini API key](https://ai.google.dev/gemini-api/docs/api-key).
- Paste your API key in the `.env` file:

  ```
  VITE_GEMINI_API_KEY=your_api_key_here
  ```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

- **Voice Assistant:** Click "Enable Voice Assistant" and use commands like “navigation”, “color blindness”, “snap”, “upload”, “home”, or “go back”.
- **Color Blindness Tools:** Upload an image to simulate various types of color blindness.
- **Image Description:** Use your camera or upload an image to get an AI-generated description.
- **Camera Navigation:** Go to the navigation assistant page and start the assistant for real-time guidance.
- **Blindness Assistance:** Access tools and keyboard shortcuts for blind users.
- **Resources:** Explore external tools and articles for accessibility.

---

## Notes

- The app uses [Google Gemini API](https://ai.google.dev/gemini-api/docs/api-key) for image description. You must provide your own API key.
- Voice Assistant is limited on iOS due to browser restrictions (speech output only, no voice input).
- Camera navigation works best on mobile devices.

