import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./glyph-background.css";

const GLYPH_SEQUENCE = ["0", "8", "0", "0", "1"];
const CHAR_WIDTH = 18;
const CHAR_HEIGHT = 28;
const LETTER_SPACING = 1.5;
const ANIMATION_PROBABILITY = 0.005;

type GlyphData = {
  char: string;
  x: number;
  y: number;
  opacity: number;
  baseOpacity: number;
  isAnimating: boolean;
  animationProgress: number;
  animationDelay: number;
};

export const GlyphBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Memoized glyph data generation
  const glyphData = useMemo(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return [];

    const cols = Math.ceil(width / (CHAR_WIDTH + LETTER_SPACING)) + 2;
    const rows = Math.ceil(height / CHAR_HEIGHT) + 2;
    const glyphs: GlyphData[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset1 = (row * 3 + col * 2) % 5;
        const offset2 = (row + col) % 5;
        const offset3 = Math.floor((row * col) / 7) % 5;
        const pseudoRandom =
          Math.abs(Math.sin(row * 12.9898 + col * 78.233)) * 43758.5453;
        const randomOffset = Math.floor(
          (pseudoRandom - Math.floor(pseudoRandom)) * 2,
        );
        const finalOffset = (offset1 + offset2 + offset3 + randomOffset) % 5;

        const char = GLYPH_SEQUENCE[finalOffset];
        const x = col * (CHAR_WIDTH + LETTER_SPACING);
        const y = row * CHAR_HEIGHT + CHAR_HEIGHT * 0.8; // Baseline adjustment

        // Stagger animation delays based on position
        const animationDelay = (row * col * 37) % 2000;

        glyphs.push({
          char,
          x,
          y,
          opacity: 0.25,
          baseOpacity: 0.25,
          isAnimating: false,
          animationProgress: 0,
          animationDelay,
        });
      }
    }

    return glyphs;
  }, [dimensions]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle tab visibility to pause animations when not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Static render function for reduced motion
  const renderStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || glyphData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font properties for crisp rendering
    const fontSize = 18;
    ctx.font = `600 ${fontSize}px var(--font-mono, monospace)`;
    ctx.textBaseline = "alphabetic";
    ctx.imageSmoothingEnabled = false;

    // Get CSS color value
    const computedStyle = getComputedStyle(document.documentElement);
    const color =
      computedStyle.getPropertyValue("--color-fg").trim() || "#ffffff";

    glyphData.forEach((glyph) => {
      // Static render with base opacity only
      ctx.fillStyle = color;
      ctx.globalAlpha = glyph.baseOpacity;
      ctx.fillText(glyph.char, glyph.x, glyph.y);
    });
  }, [glyphData]);

  // Canvas rendering function
  const render = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas || glyphData.length === 0 || !isVisible) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set font properties for crisp rendering
      const fontSize = 18;
      ctx.font = `600 ${fontSize}px var(--font-mono, monospace)`;
      ctx.textBaseline = "alphabetic";
      ctx.imageSmoothingEnabled = false;

      // Get CSS color value
      const computedStyle = getComputedStyle(document.documentElement);
      const color =
        computedStyle.getPropertyValue("--color-fg").trim() || "#ffffff";

      glyphData.forEach((glyph) => {
        // Only animate if motion is allowed
        if (!prefersReducedMotion) {
          // Update animation state
          if (!glyph.isAnimating && Math.random() < ANIMATION_PROBABILITY) {
            if (timestamp > glyph.animationDelay) {
              glyph.isAnimating = true;
              glyph.animationProgress = 0;
            }
          }

          if (glyph.isAnimating) {
            glyph.animationProgress += 0.016; // ~60fps increment

            // Pulse animation (0 to 1 and back)
            const progress = glyph.animationProgress;
            if (progress < 1) {
              const pulseValue = Math.sin(progress * Math.PI);
              const maxOpacity = 0.5;
              glyph.opacity =
                glyph.baseOpacity +
                (maxOpacity - glyph.baseOpacity) * pulseValue;
            } else {
              glyph.isAnimating = false;
              glyph.opacity = glyph.baseOpacity;
              glyph.animationDelay = timestamp + Math.random() * 3000 + 1000; // Next animation delay
            }
          }
        }

        // Render glyph
        ctx.fillStyle = color;
        ctx.globalAlpha = glyph.opacity;
        ctx.fillText(glyph.char, glyph.x, glyph.y);
      });
    },
    [glyphData, isVisible, prefersReducedMotion],
  );

  // Animation loop function
  const startAnimation = useCallback(() => {
    const animate = (timestamp: number) => {
      render(timestamp);

      // Continue animation loop only if visible and motion allowed
      if (isVisible && !prefersReducedMotion) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };

    if (isVisible && !prefersReducedMotion) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [render, isVisible, prefersReducedMotion]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get device pixel ratio for crisp rendering
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale the context to ensure correct drawing operations
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    // Render static or start animation based on preference
    if (prefersReducedMotion) {
      renderStatic();
    } else {
      startAnimation();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions, renderStatic, startAnimation, prefersReducedMotion]);

  // Handle mouse interactions
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find nearby glyphs and enhance their opacity temporarily
      glyphData.forEach((glyph) => {
        const distance = Math.sqrt((glyph.x - x) ** 2 + (glyph.y - y) ** 2);
        if (distance < 50 && !glyph.isAnimating) {
          glyph.opacity = Math.min(glyph.baseOpacity * 2, 0.6);

          // Fade back to normal
          setTimeout(() => {
            if (!glyph.isAnimating) {
              glyph.opacity = glyph.baseOpacity;
            }
          }, 200);
        }
      });
    },
    [glyphData],
  );

  return (
    <canvas
      ref={canvasRef}
      className="glyph-background"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.1,
      }}
    />
  );
};
