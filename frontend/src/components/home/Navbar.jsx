import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../../styles/navbar.css";
import logo from "../../assets/logo/logo.webp";



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">

      <div className="navbar-logo">

        <img src={logo} alt="Logo" />

        <h2>WadaTech</h2>

      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li><a href="#">Home</a></li>
        <li><a href="#services">Service</a></li>
    
        <li><a href="#contact">Contact</a></li>
        <li><a href="#faq">FAQ</a></li>

        <div className="mobile-buttons">
          <button className="login-btn">Login In</button>
          <button className="register-btn">Register</button>
        </div>
      </ul>

      <div className="desktop-buttons">
        <button className="login-btn">Login In</button>
        <button className="register-btn">Register</button>
      </div>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

    </header>
  );
}

export default Navbar;