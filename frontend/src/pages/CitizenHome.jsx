import React from "react";
import CitizenNavbar from "../components/citizen/Navbar";
import CitizenHero from "../components/citizen/Hero";
import Services from "../components/home/Services"; // reused as-is
import Events from "../components/citizen/Events";
import Notices from "../components/citizen/Notices";
import FAQ from "../components/home/FAQ"; // reused as-is
import Contact from "../components/home/Contact"; // reused as-is
import Footer from "../components/home/Footer"; // reused as-is

const CitizenHome = () => {
  // TODO: replace with the logged-in user's real name from auth/session
  const userName = "Person";

  return (
    <div className="citizen-home">
      <CitizenNavbar userName={userName} />

      <div id="home">
        <CitizenHero userName={userName} noticeCount={2} eventCount={4} />
      </div>

      <div id="services">
        <Services />
      </div>

      <Events />

      <Notices />

      <div id="faq">
        <FAQ />
      </div>

      <div id="contact">
        <Contact />
      </div>

      
    </div>
  );
};

export default CitizenHome;