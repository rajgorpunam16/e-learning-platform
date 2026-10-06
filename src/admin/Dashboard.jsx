import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaFolderOpen,
  FaLayerGroup,
  FaRupeeSign,
  FaUserGraduate,
} from "react-icons/fa";
import "../admin/Dashboard.css";
import API_BASE_URL from "../config";

const API_BASE = `${API_BASE_URL}/api/admin`;
function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
    lessons: 0,
    users: 0,
    revenue: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const readArray = (data, keys = []) => {
    if (Array.isArray(data)) return data;

    for (const key of keys) {
      if (Array.isArray(data?.[key])) return data[key];
    }

    return [];
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [coursesRes, categoriesRes, chaptersRes, usersRes] =
        await Promise.allSettled([
          fetch(`${API_BASE}/courses`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/chapters`),
          fetch(`${API_BASE}/users`),
        ]);

      const readResponse = async (result) => {
        if (result.status !== "fulfilled" || !result.value.ok) return [];
        return result.value.json();
      };

      const [coursesData, categoriesData, chaptersData, usersData] =
        await Promise.all([
          readResponse(coursesRes),
          readResponse(categoriesRes),
          readResponse(chaptersRes),
          readResponse(usersRes),
        ]);

      const courses = readArray(coursesData, ["courses", "books"]);
      const categories = readArray(categoriesData, ["categories"]);
      const chapters = readArray(chaptersData, ["chapters", "modules"]);
      const users = readArray(usersData, ["users"]);

      setStats({
        courses: courses.length,
        categories: categories.length,
        lessons: chapters.reduce(
          (sum, chapter) => sum + Number(chapter.lessons?.length || 1),
          0
        ),
        users: users.length,
        revenue: courses.reduce(
          (sum, course) => sum + Number(course.price || 0) * Number(course.sales || 0),
          0
        ),
      });

      setRecentCourses(courses.slice(0, 5));
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  const cards = [
    { label: "Total Courses", value: stats.courses, icon: <FaBookOpen /> },
    { label: "Categories", value: stats.categories, icon: <FaFolderOpen /> },
    { label: "Lessons", value: stats.lessons, icon: <FaLayerGroup /> },
    { label: "Students", value: stats.users, icon: <FaUserGraduate /> },
    { label: "Estimated Revenue", value: formatCurrency(stats.revenue), icon: <FaRupeeSign /> },
  ];

  return (
    <div className="dashboard-page">
      <div className="admin-page-heading">
        <div>
          <span>Overview</span>
          <h2>Dashboard</h2>
          <p>Monitor courses, learners and platform activity.</p>
        </div>

        <button type="button" className="dashboard-refresh" onClick={loadDashboard}>
          Refresh Data
        </button>
      </div>

      <div className="dashboard-stat-grid">
        {cards.map((card) => (
          <article key={card.label} className="dashboard-stat-card">
            <div className="dashboard-stat-icon">{card.icon}</div>
            <div>
              <strong>{loading ? "..." : card.value}</strong>
              <span>{card.label}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-panel-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span>Latest Content</span>
              <h3>Recent Courses</h3>
            </div>
          </div>

          {recentCourses.length === 0 ? (
            <div className="dashboard-empty">No courses available yet.</div>
          ) : (
            <div className="dashboard-course-list">
              {recentCourses.map((course) => (
                <article key={course._id || course.id}>
                  <img
                    src={course.image || course.coverImage || "/dvoc.png"}
                    alt={course.title}
                  />
                  <div>
                    <strong>{course.title || "Untitled Course"}</strong>
                    <span>{course.category || "General"}</span>
                  </div>
                  <b>₹{Number(course.price || 0).toLocaleString("en-IN")}</b>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="dashboard-panel dashboard-activity">
          <div className="dashboard-panel-heading">
            <div>
              <span>Platform</span>
              <h3>Quick Summary</h3>
            </div>
          </div>

          <div className="dashboard-progress-item">
            <div>
              <span>Course catalogue setup</span>
              <strong>{stats.courses > 0 ? "Active" : "Pending"}</strong>
            </div>
            <div className="dashboard-progress-track">
              <span style={{ width: stats.courses > 0 ? "100%" : "20%" }}></span>
            </div>
          </div>

          <div className="dashboard-progress-item">
            <div>
              <span>Category organisation</span>
              <strong>{stats.categories > 0 ? "Active" : "Pending"}</strong>
            </div>
            <div className="dashboard-progress-track">
              <span style={{ width: stats.categories > 0 ? "100%" : "15%" }}></span>
            </div>
          </div>

          <div className="dashboard-progress-item">
            <div>
              <span>Learning content</span>
              <strong>{stats.lessons} lessons</strong>
            </div>
            <div className="dashboard-progress-track">
              <span style={{ width: `${Math.min(stats.lessons * 5, 100)}%` }}></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
