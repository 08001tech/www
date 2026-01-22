import { useState, useRef, useEffect } from "react";

export const PerformanceTest = () => {
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const animationIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    lastTimeRef.current = performance.now();

    const measureFps = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Update FPS every second
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round(frameCountRef.current));
        setFrameCount((prev) => prev + frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationIdRef.current = requestAnimationFrame(measureFps);
    };

    animationIdRef.current = requestAnimationFrame(measureFps);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return "#4ade80"; // green
    if (fps >= 45) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        left: "1rem",
        zIndex: 1001,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        fontFamily: "monospace",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <div style={{ color: getPerformanceColor(fps) }}>FPS: {fps}</div>
      <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
        Total frames: {frameCount}
      </div>
    </div>
  );
};
