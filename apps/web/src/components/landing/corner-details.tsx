import "./corner-details.css";

export const CornerDetails = () => {
  return (
    <>
      <div className="corner-detail top-left">
        <span className="corner-text">MANIFESTO</span>
      </div>

      <div className="corner-detail top-right">
        <span className="corner-text">ALT / ART / TECH</span>
      </div>

      <div className="corner-detail bottom-left">
        <span className="corner-text">EST. 2026</span>
      </div>

      <div className="corner-detail bottom-right">
        <span className="corner-text">COMING SOON</span>
      </div>

      <div className="corner-detail bottom-center">
        <span className="corner-text">BCN / RAVAL</span>
      </div>
    </>
  );
};
