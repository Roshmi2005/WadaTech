import React from "react";
import CitizenNavbar from "../components/citizen/Navbar";

import "../styles/citizenProfile.css";

const CitizenProfile = () => {
  // TODO: replace with real logged-in user data from your backend/auth
  const user = {
    fullName: "Person",
    citizenshipNo: "12-34-56-78901",
    phone: "9800000000",
    email: "person@example.com",
    dob: "2058-04-12 (B.S.)",
    gender: "Female",
    wardNo: "5",
    municipality: "Kathmandu Metropolitan City",
    province: "Bagmati Province",
    address: "Tole 4, Near Ward Office",
  };

  const initials = user.fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <CitizenNavbar userName={user.fullName} />

      <section className="profile-page">
        <div className="profile-header-card">
          <div className="profile-avatar-large">{initials}</div>
          <div>
            <h1 className="profile-name">{user.fullName}</h1>
            <p className="profile-subtext">Citizen · Ward No. {user.wardNo}</p>
          </div>
          <button className="profile-edit-btn">Edit Profile</button>
        </div>

        <div className="profile-details-grid">
          <div className="profile-detail-card">
            <h2>Personal Information</h2>
            <div className="profile-detail-row">
              <span>Full Name</span>
              <span>{user.fullName}</span>
            </div>
            <div className="profile-detail-row">
              <span>Citizenship No.</span>
              <span>{user.citizenshipNo}</span>
            </div>
            <div className="profile-detail-row">
              <span>Phone Number</span>
              <span>{user.phone}</span>
            </div>
            <div className="profile-detail-row">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <div className="profile-detail-row">
              <span>Date of Birth</span>
              <span>{user.dob}</span>
            </div>
            <div className="profile-detail-row">
              <span>Gender</span>
              <span>{user.gender}</span>
            </div>
          </div>

          <div className="profile-detail-card">
            <h2>Ward Information</h2>
            <div className="profile-detail-row">
              <span>Ward No.</span>
              <span>{user.wardNo}</span>
            </div>
            <div className="profile-detail-row">
              <span>Municipality</span>
              <span>{user.municipality}</span>
            </div>
            <div className="profile-detail-row">
              <span>Province</span>
              <span>{user.province}</span>
            </div>
            <div className="profile-detail-row">
              <span>Address / Tole</span>
              <span>{user.address}</span>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default CitizenProfile;