import heroImage from "../../assets/logo/Hero.png";
import "../../styles/hero.css";

function Hero() {
  return (
    <section className="hero">

      <img
        src={heroImage}
        alt="Digital Ward Management System"
        className="hero-image"
      />

      <div className="hero-buttons">
        <button className="explore-btn">
          Explore Services
        </button>

        <button className="citizen-btn">
          Citizen Login
        </button>
      </div>

    </section>
  );
}

export default Hero;