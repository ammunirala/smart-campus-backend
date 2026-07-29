import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");
      setStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "ST",
      description: "Registered students",
      path: "/admin/students",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: "TC",
      description: "Active faculty members",
      path: "/admin/teachers",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: "CR",
      description: "Academic courses",
      path: "/admin/courses",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "US",
      description: "System accounts",
      path: "/admin/students",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">CAMPUS OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back. Here's what's happening across your campus.
          </p>
        </div>

        <button className="refresh-btn" onClick={loadDashboard}>
          Refresh Data
        </button>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="stats-grid">
        {cards.map((card) => (
          <div
            className="stat-card"
            key={card.title}
            onClick={() => navigate(card.path)}
          >
            <div className="stat-card-top">
              <div className="stat-icon">{card.icon}</div>
              <span className="live-indicator">Live</span>
            </div>

            <div className="stat-content">
              <p>{card.title}</p>
              <h2>{loading ? "..." : card.value}</h2>
              <span>{card.description}</span>
            </div>

            <div className="stat-footer">View details →</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage important campus operations</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => navigate("/admin/students")}>
              <span className="action-icon">ST</span>
              <span>
                <strong>Manage Students</strong>
                <small>View and manage student records</small>
              </span>
              <b>→</b>
            </button>

            <button onClick={() => navigate("/admin/teachers")}>
              <span className="action-icon">TC</span>
              <span>
                <strong>Manage Teachers</strong>
                <small>Manage faculty information</small>
              </span>
              <b>→</b>
            </button>

            <button onClick={() => navigate("/admin/courses")}>
              <span className="action-icon">CR</span>
              <span>
                <strong>Manage Courses</strong>
                <small>Create and organize courses</small>
              </span>
              <b>→</b>
            </button>

            <button onClick={() => navigate("/admin/attendance")}>
              <span className="action-icon">AT</span>
              <span>
                <strong>Attendance</strong>
                <small>Review campus attendance</small>
              </span>
              <b>→</b>
            </button>
          </div>
        </div>

        <div className="dashboard-panel system-panel">
          <div className="panel-heading">
            <div>
              <h2>System Overview</h2>
              <p>Current campus system status</p>
            </div>
          </div>

          <div className="system-status">
            <div className="status-row">
              <span>
                <i className="status-dot"></i>
                Backend API
              </span>
              <strong>Operational</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="status-dot"></i>
                Database
              </span>
              <strong>Connected</strong>
            </div>

            <div className="status-row">
              <span>
                <i className="status-dot"></i>
                Authentication
              </span>
              <strong>Secured</strong>
            </div>
          </div>

          <div className="system-summary">
            <span>Total Campus Accounts</span>
            <strong>{loading ? "..." : stats.totalUsers}</strong>
            <p>Students, teachers and administrators</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;