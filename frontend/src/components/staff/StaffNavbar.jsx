import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.webp";
import "../../styles/staffNavbar.css";

const navLinks = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Requests", href: "#requests" },
  { label: "Notices & Events", href: "#posts" },
];

const StaffNavbar = ({ staffName = "Staff" }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const initials = staffName
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
    <nav className="staff-navbar">
      <a href="#dashboard" className="staff-navbar-logo">
        <img src={logo} alt="WadaTech logo" className="staff-logo-img" />
        <span>WadaTech</span>
      </a>

      <ul className="staff-navbar-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className="staff-navbar-profile">
        <button
          className="staff-avatar-btn"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {initials}
        </button>

        {showMenu && (
          <div className="staff-profile-dropdown">
            <p className="staff-profile-name">{staffName}</p>
            <button onClick={() => navigate("/staff/profile")}>My Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StaffNavbar;