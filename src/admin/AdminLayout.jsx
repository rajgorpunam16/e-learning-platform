import { NavLink, Outlet, Link } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBookOpen,
  FaLayerGroup,
  FaListAlt,
  FaUsers,
  FaHome,
  FaGraduationCap,
} from "react-icons/fa";

import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/dvoc.png" alt="DVOC" />

          <div>
            <strong>DVOC</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <NavLink to="/admin" end>
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink to="/admin/courses">
            <FaBookOpen />
            Manage Courses
          </NavLink>

          <NavLink to="/admin/categories">
            <FaLayerGroup />
            Categories
          </NavLink>

          <NavLink to="/admin/chapters">
            <FaListAlt />
            Chapters
          </NavLink>

          <NavLink to="/admin/users">
            <FaUsers />
            Students
          </NavLink>
        </nav>

        <Link to="/" className="admin-home-link">
          <FaHome />
          Back to Website
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-header-label">
              <FaGraduationCap />
              DVOC E-Learning
            </span>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>DVOC Admin</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;