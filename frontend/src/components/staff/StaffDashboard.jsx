import React, { useState } from "react";
import "../../styles/staffDashboard.css";
import StaffNavbar from "./StaffNavbar";

// TODO: replace with real data from your backend
const initialRequests = [
  { id: 1, citizenName: "Sita Sharma", service: "Birth Certificate", date: "2026-08-18", status: "Pending" },
  { id: 2, citizenName: "Ram Thapa", service: "Marriage Certificate", date: "2026-08-19", status: "Pending" },
  { id: 3, citizenName: "Gita Koirala", service: "Death Certificate", date: "2026-08-20", status: "Approved" },
];

const initialPosts = [
  { id: 1, type: "notice", title: "Office closed on Sept 3", date: "2026-09-03", description: "Closed for maintenance." },
  { id: 2, type: "event", title: "Ward Health Camp", date: "2026-09-05", description: "Free health checkup for all citizens." },
];

const StaffDashboard = () => {
  const staffName = "Hari Bahadur"; // TODO: replace with logged-in staff's real name

  const [requests, setRequests] = useState(initialRequests);
  const [posts, setPosts] = useState(initialPosts);
  const [postFilter, setPostFilter] = useState("all"); // all | notice | event

  const [form, setForm] = useState({ type: "notice", title: "", date: "", description: "" });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const updateStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;

    const newPost = { id: Date.now(), ...form };
    setPosts((prev) => [newPost, ...prev]);
    setForm({ type: "notice", title: "", date: "", description: "" });
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPosts = postFilter === "all" ? posts : posts.filter((p) => p.type === postFilter);

  return (
    <div>
      <StaffNavbar staffName={staffName} />

      <section id="dashboard" className="staff-hero">
        <h1>Welcome, {staffName}</h1>
        <p>You have {pendingCount} pending request{pendingCount !== 1 ? "s" : ""} to review.</p>
      </section>

      {/* ---------------- Citizen Requests ---------------- */}
      <section id="requests" className="staff-section">
        <h2>Citizen Requests</h2>

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.citizenName}</td>
                  <td>{req.service}</td>
                  <td>{req.date}</td>
                  <td>
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="staff-action-cell">
                    <button
                      className="approve-btn"
                      disabled={req.status === "Approved"}
                      onClick={() => updateStatus(req.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      disabled={req.status === "Rejected"}
                      onClick={() => updateStatus(req.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Notices & Events ---------------- */}
      <section id="posts" className="staff-section">
        <h2>Notices &amp; Events</h2>

        <form className="post-form" onSubmit={handleAddPost}>
          <select name="type" value={form.type} onChange={handleFormChange}>
            <option value="notice">Notice</option>
            <option value="event">Event</option>
          </select>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleFormChange}
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Short description (optional)"
            value={form.description}
            onChange={handleFormChange}
          />
          <button type="submit">Post</button>
        </form>

        <div className="post-filter">
          <button
            className={postFilter === "all" ? "active" : ""}
            onClick={() => setPostFilter("all")}
          >
            All
          </button>
          <button
            className={postFilter === "notice" ? "active" : ""}
            onClick={() => setPostFilter("notice")}
          >
            Notices
          </button>
          <button
            className={postFilter === "event" ? "active" : ""}
            onClick={() => setPostFilter("event")}
          >
            Events
          </button>
        </div>

        <div className="post-list">
          {filteredPosts.map((post) => (
            <div className="post-card" key={post.id}>
              <span className={`post-tag post-tag-${post.type}`}>{post.type}</span>
              <h3>{post.title}</h3>
              <p className="post-date">{post.date}</p>
              {post.description && <p>{post.description}</p>}
              <button className="delete-post-btn" onClick={() => handleDeletePost(post.id)}>
                Delete
              </button>
            </div>
          ))}
          {filteredPosts.length === 0 && <p>No posts yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default StaffDashboard;