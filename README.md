# SeeForMe: AI-Powered Visual Assistance for the Visually Impaired

## Problem Statement

Over 2.2 billion people worldwide live with some form of visual impairment or blindness (WHO). Everyday tasks—like navigating environments, identifying objects, or even perceiving colors—can be daunting. Many existing solutions are expensive, inaccessible, or lack real-time, context-aware guidance. SeeForMe aims to bridge this gap by harnessing AI to empower those who cannot see, providing hope and independence through technology.

## Solution Overview

**SeeForMe** is an open-source, AI-driven platform designed to be the eyes for people who are blind or visually impaired. Our mission is to make the world more accessible by offering:

- **Real-time environmental guidance** using a custom-trained YOLO v11 model and LLMs
- **Instant image description** for any photo or scene
- **Color blindness simulation and tools**
- **Voice and keyboard navigation** for hands-free, accessible interaction

This project was built for a healthcare hackathon, focusing on inclusivity, accessibility, and real-world impact.

---

## Features

- **Snap & Describe:** Instantly snap a photo or upload an image to receive an AI-generated description, spoken aloud for accessibility.
- **Color Blindness Tools:** Upload images or documents to simulate how they appear to users with various types of color blindness (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- **Visual Assistance (Camera Navigation):** Real-time guidance for blind users using a YOLO v11 model trained on common environmental objects. The system provides direct, actionable voice instructions (e.g., "Turn slightly right to avoid obstacle").
- **Voice Assistant:** Navigate the app and trigger features using voice commands (except on iOS, where only speech output is available).
- **Keyboard Navigation:** Essential shortcuts and tips for navigating the web without a mouse.
- **Resource Library:** Curated articles and external tools for further accessibility support.

---

## How It Works

### Technical Stack
- **Frontend:** React (Vite), TailwindCSS, Socket.IO, Web Speech API
- **Backend:** Python, Flask, Flask-SocketIO, YOLO v11 (Ultralytics), OpenCV, LLMs (GROQ API)
- **AI Models:**
  - YOLO v11 custom-trained for environmental object detection
  - LLM (GROQ) for real-time, context-aware navigation instructions
  - Gemini API (frontend) for image description

### System Flow
1. **User opens the app** (web/mobile) and selects a feature (snap, upload, navigation, color simulation).
2. **For real-time navigation:**
   - The frontend streams camera frames to the backend via Socket.IO.
   - The backend runs YOLO detection, then sends detected objects to an LLM (GROQ) for concise, actionable guidance.
   - The frontend receives the instruction and reads it aloud.
3. **For image description:**
   - The frontend sends the image to Gemini API and reads the description aloud.
4. **For color blindness simulation:**
   - The frontend processes and displays simulated images for different color vision deficiencies.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.9+
- [GROQ API Key](https://console.groq.com/)
- [Google Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/see-for-me.git
cd see-for-me
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

- Create a `.env` file in `backend/`:
  ```
  GROQ_API_KEY=your_groq_api_key_here
  ```
- To run locally:
  ```bash
  python app.py
  # or for production
  gunicorn -k eventlet -w 1 -b 0.0.0.0:8000 app:app
  ```
- The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file in `frontend/`:
  ```
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```
- To run locally:
  ```bash
  npm run dev
  ```
- The frontend will be available at `http://localhost:5173`

---

## Usage
- **Snap & Describe:** Use the camera or upload an image to get instant, spoken descriptions.
- **Color Blindness Tools:** Upload images or documents to simulate color vision deficiencies.
- **Visual Assistance:** Activate camera navigation for real-time, voice-guided help (best on mobile/tablet).
- **Voice Assistant:** Use voice commands to navigate (limited on iOS).
- **Keyboard Navigation:** Refer to the Blindness Assistance section for shortcuts.

