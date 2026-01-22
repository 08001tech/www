import { HeroText } from "./hero-text";
import { CornerDetails } from "./corner-details";
import { Grain } from "./grain";
import { GlyphBackground } from "./glyph-background";
import "./landing-page.css";
import { useTheme } from "../hooks";

export const LandingPage = () => {
  useTheme();

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
