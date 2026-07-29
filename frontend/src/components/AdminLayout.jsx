import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div>
          <div className="app-logo">
            <div className="logo-mark">SC</div>
            <div>
              <h2>Smart Campus</h2>
              <span>Management System</span>
            </div>
          </div>

          <p className="menu-label">MANAGEMENT</p>

          <nav className="app-menu">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span>▦</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/students"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span>◎</span>
              Students
            </NavLink>

            <NavLink
              to="/admin/teachers"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span>◈</span>
              Teachers
            </NavLink>

            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span>▤</span>
              Courses
            </NavLink>

            <NavLink
              to="/admin/attendance"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span>✓</span>
              Attendance
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="admin-mini-profile">
            <div className="profile-circle">A</div>

            <div>
              <strong>Administrator</strong>
              <span>admin@test.com</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className="topbar">
          <div>
            <span className="topbar-status"></span>
            System Online
          </div>

          <div className="topbar-right">
            <span>Admin Portal</span>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AdminLayout;