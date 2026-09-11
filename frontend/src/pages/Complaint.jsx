import React, { useState, useEffect } from "react";
import CitizenNavbar from "../components/citizen/Navbar";
import { getAllComplaints, addComplaint } from "../utils/complaintsStore";
import "../styles/complaint.css";

const complaintTypes = ["Inquiry", "Complaint"];

const complaintCategories = [
  "Infrastructure",
  "Sanitation",
  "Water Supply",
  "Electricity",
  "Public Safety",
  "Administrative",
  "Other",
];

const initialForm = {
  type: "Inquiry",
  category: "Administrative",
  fullName: "",
  phone: "",
  email: "",
  wardNo: "",
  subject: "",
  description: "",
};

const statusClassMap = {
  Pending: "complaint-status-pending",
  "In-Progress": "complaint-status-in-progress",
  Resolved: "complaint-status-resolved",
};

const Complaint = () => {
  const [form, setForm] = useState(initialForm);
  const [complaints, setComplaints] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setComplaints(getAllComplaints());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.subject || !form.description) {
      return;
    }

    addComplaint(form);
    setComplaints(getAllComplaints());
    setForm(initialForm);
    setSuccessMessage("Your submission has been received. You can track its status below.");
  };

  return (
    <div className="complaint-page">
      <CitizenNavbar />

      <section className="complaint-header">
        <h1>Complaints &amp; Inquiries</h1>
        <p className="complaint-description">
          Use this form to ask a question or raise a concern with your ward office.
          You can track the status of your submission below.
        </p>
      </section>

      <div className="complaint-content">
        <div className="complaint-panel">
          <h2>Submit a Complaint or Inquiry</h2>
          {successMessage && <p className="complaint-success">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="complaint-field">
              <label htmlFor="type">Request Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="complaint-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {complaintCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="complaint-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="complaint-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="complaint-field">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="complaint-field">
              <label htmlFor="wardNo">Ward No.</label>
              <input
                id="wardNo"
                name="wardNo"
                type="text"
                value={form.wardNo}
                onChange={handleChange}
              />
            </div>

            <div className="complaint-field complaint-field-full">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Short summary of your inquiry or complaint"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="complaint-field complaint-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe your inquiry or complaint in detail"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="complaint-field complaint-field-full">
              <button type="submit" className="complaint-submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="complaint-panel complaint-list-panel">
          <h2>Your Submissions</h2>

          {complaints.length === 0 ? (
            <p className="complaint-empty-state">
              You haven't submitted anything yet.
            </p>
          ) : (
            <div className="complaint-table-wrap">
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>{complaint.submittedAt}</td>
                      <td>{complaint.type}</td>
                      <td>{complaint.category}</td>
                      <td>{complaint.subject}</td>
                      <td>
                        <span
                          className={`complaint-status ${
                            statusClassMap[complaint.status] || "complaint-status-pending"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaint;