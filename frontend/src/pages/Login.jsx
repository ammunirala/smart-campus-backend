import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data;

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      const role =
        payload.role ||
        payload.authority ||
        payload.roles?.[0];

      localStorage.setItem("role", role || "");

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (role === "ROLE_TEACHER") {
        navigate("/teacher");
      } else if (role === "ROLE_STUDENT") {
        navigate("/student");
      } else {
        setError("Unable to determine user role");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <h1>Smart Campus</h1>
          <p>Management System</p>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Sign in to continue to your dashboard
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="footer-text">
          Secure campus management portal
        </p>
      </div>
    </div>
  );
}

export default Login;