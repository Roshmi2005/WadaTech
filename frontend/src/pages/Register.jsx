import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("citizen"); // "citizen" or "staff"
  const [fullName, setFullName] = useState("");
  const [wardNo, setWardNo] = useState(""); // citizen only
  const [idNumber, setIdNumber] = useState(""); // citizenship no. OR staff id
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !idNumber || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (role === "citizen" && !wardNo) {
      setError("Please enter your ward number.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your real API call
      // await fetch(`/api/auth/${role}/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fullName, wardNo, idNumber, email, password }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">खाता दर्ता गर्नुहोस्</p>

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={role === "citizen" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("citizen")}
          >
            Citizen
          </button>
          <button
            type="button"
            className={role === "staff" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("staff")}
          >
            Staff
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Person "
          />

          {role === "citizen" && (
            <>
              <label htmlFor="wardNo">Ward No.</label>
              <input
                id="wardNo"
                type="number"
                min="1"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
                placeholder="e.g. 5"
              />
            </>
          )}

          <label htmlFor="idNumber">
            {role === "citizen" ? "Citizenship No." : "Staff ID"}
          </label>
          <input
            id="idNumber"
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder={role === "citizen" ? "e.g. 12-34-56-78901" : "e.g. WT-STAFF-0042"}
          />

          <label htmlFor="email">Email {role === "citizen" }</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="person@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;