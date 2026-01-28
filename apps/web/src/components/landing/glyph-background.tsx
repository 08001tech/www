"use client";

import { useEffect, useRef, useState } from "react";
import "./glyph-background.css";

const GLYPH_SEQUENCE = ["0", "8", "0", "0", "1"];
const CHAR_WIDTH = 18;
const CHAR_HEIGHT = 28;
const LETTER_SPACING = 0.01;
const ANIMATION_PROBABILITY = 0.005;

interface GlyphData {
  char: string;
  x: number;
  y: number;
  opacity: number;
  baseOpacity: number;
  isAnimating: boolean;
  animationProgress: number;
}

const generateGlyphData = (width: number, height: number): GlyphData[] => {
  if (width === 0 || height === 0) {
    return [];
  }

  const cols = Math.ceil(width / (CHAR_WIDTH + LETTER_SPACING)) + 2;
  const rows = Math.ceil(height / CHAR_HEIGHT) + 2;
  const glyphs: GlyphData[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pseudoRandom =
        Math.abs(Math.sin(row * 12.9898 + col * 78.233)) * 43_758.5453;
      const offset = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * 5);

      const char = GLYPH_SEQUENCE[offset];
      const x = col * (CHAR_WIDTH + LETTER_SPACING);
      const y = row * CHAR_HEIGHT + CHAR_HEIGHT * 0.8;

      glyphs.push({
        char,
        x,
        y,
        opacity: 0.25,
        baseOpacity: 0.25,
        isAnimating: false,
        animationProgress: 0,
      });
    }
  }

  return glyphs;
};

export const GlyphBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const glyphDataRef = useRef<GlyphData[]>([]);

  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    glyphDataRef.current = generateGlyphData(width, height);

    const updateGlyphAnimation = (glyph: GlyphData) => {
      if (!glyph.isAnimating && Math.random() < ANIMATION_PROBABILITY) {
        glyph.isAnimating = true;
        glyph.animationProgress = 0;
      }

      if (glyph.isAnimating) {
        glyph.animationProgress += 0.016;

        if (glyph.animationProgress < 1) {
          const pulseValue = Math.sin(glyph.animationProgress * Math.PI);
          const maxOpacity = 0.5;
          glyph.opacity =
            glyph.baseOpacity + (maxOpacity - glyph.baseOpacity) * pulseValue;
        } else {
          glyph.isAnimating = false;
          glyph.opacity = glyph.baseOpacity;
        }
      }
    };

    const render = () => {
      if (!canvas || glyphDataRef.current.length === 0) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "600 18px var(--font-mono, monospace)";
      ctx.textBaseline = "alphabetic";
      ctx.imageSmoothingEnabled = false;

      const computedStyle = getComputedStyle(document.documentElement);
      const color =
        computedStyle.getPropertyValue("--color-fg").trim() || "#ffffff";

      for (const glyph of glyphDataRef.current) {
        if (!prefersReducedMotion && isVisible) {
          updateGlyphAnimation(glyph);
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = glyph.opacity;
        ctx.fillText(glyph.char, glyph.x, glyph.y);
      }
    };

    const animate = () => {
      render();
      if (isVisible && !prefersReducedMotion) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    render();
    if (!prefersReducedMotion && isVisible) {
      animationIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions, isVisible, prefersReducedMotion]);

  return <canvas className="glyph-background" ref={canvasRef} />;
};
