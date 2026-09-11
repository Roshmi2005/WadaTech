import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("citizen"); // "citizen" or "staff"
  const [identifier, setIdentifier] = useState(""); // citizenship no./phone OR staff id
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your real API call
      // const res = await fetch(`/api/auth/${role}/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ identifier, password }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay
      navigate(role === "citizen" ? "/citizen/dashboard" : "/staff/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">फेरि स्वागत छ</p>

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
          <label htmlFor="identifier">
            {role === "citizen" ? "Citizenship No. / Phone" : "Staff ID / Email"}
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "citizen" ? "e.g. 98XXXXXXXX" : "e.g. WT-STAFF-0042"}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;