import { createContext, useContext, useState } from "react";

const SpeechContext = createContext();

export function SpeechProvider({ children }) {
  const [audioEnabled, setAudioEnabled] = useState(true);

  const speak = (message) => {
    if (audioEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <SpeechContext.Provider value={{ audioEnabled, setAudioEnabled, speak }}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  return useContext(SpeechContext);
}