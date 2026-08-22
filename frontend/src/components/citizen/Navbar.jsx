import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.webp";
import "../../styles/citizenNavbar.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Events", href: "#events" },
  { label: "Notices", href: "#notices" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const CitizenNavbar = ({ userName = "Citizen" }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    // TODO: clear auth token / session here
    navigate("/login");
  };

  return (
    <nav className="citizen-navbar">
      <a href="#home" className="citizen-navbar-logo">
        <img src={logo} alt="WadaTech logo" className="citizen-logo-img" />
        <span>WadaTech</span>
      </a>

      <ul className="citizen-navbar-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className="citizen-navbar-profile">
        <button
          className="citizen-avatar-btn"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {initials}
        </button>

        {showMenu && (
          <div className="citizen-profile-dropdown">
            <p className="citizen-profile-name">{userName}</p>
            <button onClick={() => navigate("/citizen/profile")}>My Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CitizenNavbar;