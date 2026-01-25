"use client";

import { CornerDetails } from "./corner-details";
import { GlyphBackground } from "./glyph-background";
import { Grain } from "./grain";
import { HeroText } from "./hero-text";
import "./landing-page.css";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <GlyphBackground />
      <Grain />
      <CornerDetails />

      <main className="landing-content">
        <HeroText />
      </main>
    </div>
  );
};
