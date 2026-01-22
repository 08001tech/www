import { useState, useEffect } from "react";
import "./hero-text.css";

export const HeroText = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const triggerRandomGlitch = () => {
      if (Math.random() < 0.95) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    };

    const interval = setInterval(triggerRandomGlitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-text">
      <div className={`hero-content ${glitch ? "glitch" : ""}`}>
        <span className="hero-main">08001</span>
        <span className="hero-glitch" aria-hidden="true">
          08001
        </span>
        <span className="hero-glitch" aria-hidden="true">
          08001
        </span>
      </div>
    </div>
  );
};
