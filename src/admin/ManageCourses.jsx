import { useEffect, useMemo, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaSearch,
  FaBookOpen,
} from "react-icons/fa";

import "./ManageCourses.css";

const API_URL = "http://localhost:5000/api/admin/courses";

const emptyForm = {
  title: "",
  shortTitle: "",
  instructor: "DVOC Faculty",
  category: "",
  description: "",
  longDescription: "",
  level: "Beginner",
  duration: "",
  lessons: "",
  price: "",
  originalPrice: "",
  rating: "",
  reviews: "",
  students: "",
  badge: "",
  image: "",
  skills: "",
  learningOutcomes: "",
  certificate: true,
  featured: false,
  bestseller: false,
  active: true,
};

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load courses.");
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return courses;
    }

    return courses.filter((course) => {
      const text = `
        ${course.title || ""}
        ${course.category || ""}
        ${course.level || ""}
        ${course.instructor || ""}
      `.toLowerCase();

      return text.includes(value);
    });
  }, [courses, search]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const preparePayload = () => {
    return {
      ...form,

      lessons: Number(form.lessons || 0),
      price: Number(form.price || 0),
      originalPrice: Number(form.originalPrice || 0),
      rating: Number(form.rating || 0),
      reviews: Number(form.reviews || 0),
      students: Number(form.students || 0),

      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      learningOutcomes: form.learningOutcomes
        .split("\n")
        .map((outcome) => outcome.trim())
        .filter(Boolean),
    };
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setSelectedCourse(null);
    setModal("add");
    setError("");
    setMessage("");
  };

  const openViewModal = (course) => {
    setSelectedCourse(course);
    setModal("view");
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);

    setForm({
      title: course.title || "",
      shortTitle: course.shortTitle || "",
      instructor: course.instructor || "DVOC Faculty",
      category: course.category || "",
      description: course.description || "",
      longDescription: course.longDescription || "",
      level: course.level || "Beginner",
      duration: course.duration || "",
      lessons: course.lessons || "",
      price: course.price || "",
      originalPrice: course.originalPrice || "",
      rating: course.rating || "",
      reviews: course.reviews || "",
      students: course.students || "",
      badge: course.badge || "",
      image: course.image || "",
      skills: Array.isArray(course.skills)
        ? course.skills.join(", ")
        : "",
      learningOutcomes: Array.isArray(course.learningOutcomes)
        ? course.learningOutcomes.join("\n")
        : "",
      certificate: course.certificate ?? true,
      featured: course.featured ?? false,
      bestseller: course.bestseller ?? false,
      active: course.active ?? true,
    });

    setModal("edit");
    setError("");
    setMessage("");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedCourse(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const isEdit = modal === "edit";

      const url = isEdit
        ? `${API_URL}/${selectedCourse._id}`
        : API_URL;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(preparePayload()),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Course operation failed."
        );
      }

      setMessage(
        isEdit
          ? "Course updated successfully."
          : "Course added successfully."
      );

      await fetchCourses();

      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Delete "${course.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/${course._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete course."
        );
      }

      setMessage("Course deleted successfully.");

      await fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="manage-courses">
      <div className="manage-page-header">
        <div>
          <span className="manage-eyebrow">
            COURSE MANAGEMENT
          </span>

          <h1>Manage Courses</h1>

          <p>
            Add, view, edit and remove courses from the DVOC
            e-learning platform.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-button"
          onClick={openAddModal}
        >
          <FaPlus />
          Add Course
        </button>
      </div>

      {message && (
        <div className="admin-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      <div className="course-admin-toolbar">
        <div className="admin-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search course, category or level..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <span>
          {filteredCourses.length} course
          {filteredCourses.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="admin-loading">
          Loading courses...
        </div>
      ) : (
        <div className="admin-course-table-wrapper">
          <table className="admin-course-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <div className="admin-course-cell">
                      <div className="admin-course-image">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                          />
                        ) : (
                          <FaBookOpen />
                        )}
                      </div>

                      <div>
                        <strong>{course.title}</strong>
                        <span>
                          {course.instructor || "DVOC Faculty"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>{course.category}</td>

                  <td>
                    <span className="course-level-chip">
                      {course.level}
                    </span>
                  </td>

                  <td>{course.duration}</td>

                  <td>
                    <strong>
                      ₹{Number(course.price || 0).toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    {Number(
                      course.students || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={
                        course.active
                          ? "course-status active"
                          : "course-status inactive"
                      }
                    >
                      {course.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="view-action"
                        onClick={() => openViewModal(course)}
                        title="View course"
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="edit-action"
                        onClick={() => openEditModal(course)}
                        title="Edit course"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-action"
                        onClick={() => handleDelete(course)}
                        title="Delete course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-state">
                      <FaBookOpen />

                      <h3>No courses found</h3>

                      <p>
                        Add your first DVOC online course.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <div className="admin-modal-overlay">
          <div className="admin-course-modal">
            <div className="admin-modal-header">
              <div>
                <span>DVOC COURSE</span>

                <h2>
                  {modal === "edit"
                    ? "Update Course"
                    : "Add New Course"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="admin-course-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label>Course Title *</label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Short Title</label>

                  <input
                    name="shortTitle"
                    value={form.shortTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Instructor</label>

                  <input
                    name="instructor"
                    value={form.instructor}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category *</label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Level</label>

                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Professional</option>
                    <option>All Levels</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Duration</label>

                  <input
                    name="duration"
                    placeholder="288 hours"
                    value={form.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Total Lessons</label>

                  <input
                    type="number"
                    name="lessons"
                    value={form.lessons}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Original Price</label>

                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Rating</label>

                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Reviews</label>

                  <input
                    type="number"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Students</label>

                  <input
                    type="number"
                    name="students"
                    value={form.students}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Badge</label>

                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group full">
                  <label>Image Path</label>

                  <input
                    name="image"
                    placeholder="/course-java.jpg"
                    value={form.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group full">
                  <label>Short Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group full">
                  <label>Full Description</label>

                  <textarea
                    name="longDescription"
                    value={form.longDescription}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group full">
                  <label>
                    Skills — separate with commas
                  </label>

                  <textarea
                    name="skills"
                    placeholder="Java, Spring Boot, React, MySQL"
                    value={form.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-group full">
                  <label>
                    Learning Outcomes — one per line
                  </label>

                  <textarea
                    name="learningOutcomes"
                    value={form.learningOutcomes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    name="certificate"
                    checked={form.certificate}
                    onChange={handleChange}
                  />

                  Certificate
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />

                  Featured
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={form.bestseller}
                    onChange={handleChange}
                  />

                  Bestseller
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />

                  Active
                </label>
              </div>

              {error && (
                <div className="admin-error-message">
                  {error}
                </div>
              )}

              {message && (
                <div className="admin-success-message">
                  {message}
                </div>
              )}

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modal === "edit"
                    ? "Update Course"
                    : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "view" && selectedCourse && (
        <div className="admin-modal-overlay">
          <div className="admin-view-modal">
            <button
              type="button"
              className="admin-view-close"
              onClick={closeModal}
            >
              <FaTimes />
            </button>

            <div className="admin-view-image">
              {selectedCourse.image ? (
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                />
              ) : (
                <FaBookOpen />
              )}
            </div>

            <span className="admin-view-level">
              {selectedCourse.level}
            </span>

            <h2>{selectedCourse.title}</h2>

            <p className="admin-view-description">
              {selectedCourse.longDescription ||
                selectedCourse.description}
            </p>

            <div className="admin-view-stats">
              <div>
                <span>Duration</span>
                <strong>{selectedCourse.duration}</strong>
              </div>

              <div>
                <span>Lessons</span>
                <strong>{selectedCourse.lessons}</strong>
              </div>

              <div>
                <span>Students</span>
                <strong>{selectedCourse.students}</strong>
              </div>

              <div>
                <span>Rating</span>
                <strong>{selectedCourse.rating} / 5</strong>
              </div>
            </div>

            <div className="admin-view-price">
              ₹
              {Number(
                selectedCourse.price || 0
              ).toLocaleString()}
            </div>

            <button
              type="button"
              className="admin-save-button"
              onClick={() =>
                openEditModal(selectedCourse)
              }
            >
              <FaEdit />
              Edit Course
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ManageCourses;