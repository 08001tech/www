"use client";

import { useState, useRef, useEffect } from "react";
import "./hero-text.css";

const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const GLITCH_CHARS = "01#@%&*$";
const ORIGINAL_TEXT = "08001";

const corruptText = (text: string, intensity: number): string =>
  text
    .split("")
    .map((char) =>
      Math.random() < intensity
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : char,
    )
    .join("");

export const HeroText = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [corruptedText, setCorruptedText] = useState(ORIGINAL_TEXT);
  const contentRef = useRef<HTMLDivElement>(null);
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() < 0.85) {
        const duration = randomRange(100, 250);
        const intensity = randomRange(0.15, 0.45);

        setGlitchActive(true);

        const corruptInterval = setInterval(() => {
          setCorruptedText(corruptText(ORIGINAL_TEXT, intensity * 0.6));
        }, 30);

        glitchTimeoutRef.current = setTimeout(() => {
          setGlitchActive(false);
          setCorruptedText(ORIGINAL_TEXT);
          clearInterval(corruptInterval);
        }, duration);
      }
    };

    const interval = setInterval(triggerGlitch, randomRange(2500, 4500));

    return () => {
      clearInterval(interval);
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
    };
  }, []);

  return (
    <div className="hero-text">
      <div
        ref={contentRef}
        className={`hero-content ${glitchActive ? "glitch-active" : ""}`}
      >
        <span className="hero-main">{corruptedText}</span>
      </div>
    </div>
  );
};
