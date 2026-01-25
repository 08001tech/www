"use client";

import { useEffect, useRef } from "react";
import "./grain.css";

export const Grain = () => {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grain = grainRef.current;
    if (!grain) return;

    const keyframesX = ["0%", "-5%", "-15%", "7%", "-5%", "-15%", "15%", "0%", "3%", "-10%"];
    const keyframesY = ["0%", "-10%", "5%", "-25%", "25%", "10%", "0%", "15%", "35%", "10%"];
    let i = 0;
    const interval = setInterval(() => {
      grain.style.transform = `translate3d(${keyframesX[i % keyframesX.length]}, ${keyframesY[i % keyframesY.length]}, 0)`;
      i++;
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grain-container">
      <div ref={grainRef} className="grain-texture" />
    </div>
  );
};
