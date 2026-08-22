import React from "react";
import heroImage from "../../assets/logo/citizen.jpg";
import "../../styles/citizenHero.css";

const CitizenHero = ({ userName = "Citizen", noticeCount = 3, eventCount = 2 }) => {
  return (
    <section className="citizen-hero">
      <img
        src={heroImage}
        alt="Citizen using WadaTech at the ward office"
        className="citizen-hero-bg-image"
      />

      <div className="citizen-hero-text">
        <h1 className="citizen-hero-heading">Welcome back, {userName}</h1>
        <p className="citizen-hero-np">वडा कार्यालयमा तपाईंलाई स्वागत छ</p>

        <div className="citizen-hero-highlights">
          <a href="#notices" className="citizen-highlight-pill">
            🔔 {noticeCount} New Notices
          </a>
          <a href="#events" className="citizen-highlight-pill">
            📅 {eventCount} Upcoming Events
          </a>
        </div>
      </div>
    </section>
  );
};

export default CitizenHero;