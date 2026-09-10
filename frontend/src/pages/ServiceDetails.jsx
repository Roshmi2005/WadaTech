import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CitizenNavbar from "../components/citizen/Navbar";
import {
  getApplicationsByService,
  addApplication,
  markApplicationPaid,
} from "../utils/applicationsStore";
import services from "../data/Services"
import "../styles/serviceDetail.css";
import { slugify } from "../utils/slugify";

const tabs = [
  { id: "instructions", label: "Instructions" },
  { id: "apply", label: "Application Form" },
  { id: "payment", label: "Payment" },
  { id: "track", label: "Track Applications" },
];

// Same fields for every service - keeps one form instead of a custom one per service.
const COMMON_FORM_FIELDS = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "citizenshipNo", label: "Citizenship No.", type: "text" },
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "email", label: "Email (optional)", type: "email" },
  { name: "wardNo", label: "Ward No.", type: "text" },
];

// Same procedure text for every service, since we only have title + description for each.
const GENERIC_PROCEDURE = [
  "Fill out the application form below with accurate details.",
  "Submit the form and note your application for tracking.",
  "Visit the ward office with required documents if requested.",
  "Track your application status anytime from the 'Track Applications' tab.",
];

const GENERIC_DOCUMENTS = [
  "Citizenship certificate",
  "Recent passport-size photo",
  "Any supporting documents relevant to your request",
];

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = services.find((s) => slugify(s.title) === serviceId);

  const [activeTab, setActiveTab] = useState("instructions");
  const [formData, setFormData] = useState({ details: "" });
  const [applications, setApplications] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (serviceId) {
      setApplications(getApplicationsByService(serviceId));
    }
  }, [serviceId]);

  if (!service) {
    return (
      <div>
        <CitizenNavbar />
        <div className="service-not-found">
          <h2>Service not found</h2>
          <p>The service you're looking for doesn't exist.</p>
          <Link to="/citizen/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addApplication(serviceId, formData);
    setFormData({ details: "" });
    setApplications(getApplicationsByService(serviceId));
    setSuccessMessage("Application submitted! You can pay and track it in the tabs above.");
    setActiveTab("track");
  };

  const handlePay = (id) => {
    markApplicationPaid(id);
    setApplications(getApplicationsByService(serviceId));
  };

  const unpaidApplications = applications.filter((app) => app.paymentStatus === "Unpaid");

  return (
    <div>
      <CitizenNavbar />

      <section className="service-header">
        <Link to="/citizen/dashboard" className="service-back-link">
          &larr; Back to Services
        </Link>
        <h1>{service.title}</h1>
        <p className="service-description">{service.description}</p>
      </section>

      <div className="service-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="service-tab-content">
        {/* ---------------- Instructions ---------------- */}
        {activeTab === "instructions" && (
          <div className="service-card">
            <h2>Procedure</h2>
            <ol>
              {GENERIC_PROCEDURE.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <h2>Documents You May Need</h2>
            <ul>
              {GENERIC_DOCUMENTS.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------------- Application Form (same for every service) ---------------- */}
        {activeTab === "apply" && (
          <div className="service-card">
            <h2>Application Form</h2>
            {successMessage && <p className="service-success">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="service-form">
              {COMMON_FORM_FIELDS.map((field) => (
                <div className="service-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleFieldChange}
                    required={field.name !== "email"}
                  />
                </div>
              ))}

              <div className="service-field">
                <label htmlFor="details">Additional Details</label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  placeholder={`Anything specific about your ${service.title.toLowerCase()} request`}
                  value={formData.details || ""}
                  onChange={handleFieldChange}
                />
              </div>

              <button type="submit" className="service-submit-btn">
                Submit Application
              </button>
            </form>
          </div>
        )}

        {/* ---------------- Payment ---------------- */}
        {activeTab === "payment" && (
          <div className="service-card">
            <h2>Payment</h2>
            <p className="service-fee-note">
              The exact fee for this service will be confirmed by your ward office.
            </p>

            {unpaidApplications.length === 0 ? (
              <p>No unpaid applications for this service.</p>
            ) : (
              <div className="payment-list">
                {unpaidApplications.map((app) => (
                  <div className="payment-row" key={app.id}>
                    <span>Application submitted on {app.submittedAt}</span>
                    <button onClick={() => handlePay(app.id)}>Mark as Paid</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- Track Applications ---------------- */}
        {activeTab === "track" && (
          <div className="service-card">
            <h2>Your Applications</h2>
            {applications.length === 0 ? (
              <p>You haven't applied for this service yet.</p>
            ) : (
              <table className="service-track-table">
                <thead>
                  <tr>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.submittedAt}</td>
                      <td>
                        <span className={`track-status track-${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span className={`track-payment track-${app.paymentStatus.toLowerCase()}`}>
                          {app.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;