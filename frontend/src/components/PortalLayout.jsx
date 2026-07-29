import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function PortalLayout({ role }) {
  const navigate = useNavigate();
  const isTeacher = role === "teacher";
  const base = isTeacher ? "/teacher" : "/student";
  const title = isTeacher ? "Teacher" : "Student";
  const links = isTeacher
    ? [["", "▦", "Dashboard"], ["students", "◎", "Students"], ["attendance", "✓", "Attendance"], ["profile", "◈", "Profile"]]
    : [["", "▦", "Dashboard"], ["attendance", "✓", "My Attendance"], ["profile", "◈", "Profile"]];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return <div className="app-shell">
    <aside className="app-sidebar">
      <div>
        <div className="app-logo"><div className="logo-mark">SC</div><div><h2>Smart Campus</h2><span>Management System</span></div></div>
        <p className="menu-label">{title.toUpperCase()} PORTAL</p>
        <nav className="app-menu">
          {links.map(([path, icon, label]) => <NavLink key={label} to={`${base}${path ? `/${path}` : ""}`} end={!path} className={({isActive}) => isActive ? "menu-link active" : "menu-link"}><span>{icon}</span>{label}</NavLink>)}
        </nav>
      </div>
      <div className="sidebar-bottom"><div className="admin-mini-profile"><div className="profile-circle">{title[0]}</div><div><strong>{title} Account</strong><span>Secure portal</span></div></div><button className="sidebar-logout" onClick={logout}>Sign out</button></div>
    </aside>
    <section className="app-main"><header className="topbar"><div><span className="topbar-status"></span>System Online</div><div className="topbar-right"><span>{title} Portal</span><div className="top-avatar">{title[0]}</div></div></header><main className="page-container"><Outlet /></main></section>
  </div>;
}