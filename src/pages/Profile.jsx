import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaCamera,
  FaCertificate,
  FaCheckCircle,
  FaEnvelope,
  FaGraduationCap,
  FaLock,
  FaPhoneAlt,
  FaSave,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import "../css/Profile.css";

function Profile({
  isLoggedIn = false,
  setIsLoggedIn,
  purchasedCourses = [],
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [storedUser, setStoredUser] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* =====================================
     LOAD USER
  ====================================== */

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setStoredUser(savedUser);

      setForm({
        name:
          savedUser.name ||
          savedUser.fullName ||
          "",
        email: savedUser.email || "",
        phone:
          savedUser.phone ||
          savedUser.mobile ||
          "",
      });

      setProfileImage(
        savedUser.profileImage || ""
      );
    } catch (storageError) {
      console.error(
        "Unable to read profile data:",
        storageError
      );

      setError(
        "Unable to load your saved profile information."
      );
    }
  }, [isLoggedIn, navigate]);

  /* =====================================
     COURSE STATISTICS
  ====================================== */

  const completedCourses = useMemo(() => {
    return purchasedCourses.filter(
      (course) =>
        Number(course?.progress || 0) === 100 ||
        course?.certificateEarned === true
    ).length;
  }, [purchasedCourses]);

  const certificateCount = useMemo(() => {
    return purchasedCourses.filter(
      (course) =>
        course?.certificateEarned === true ||
        Number(course?.progress || 0) === 100
    ).length;
  }, [purchasedCourses]);

  const totalCompletedLessons = useMemo(() => {
    return purchasedCourses.reduce(
      (total, course) => {
        const completedLessons = Array.isArray(
          course?.completedLessons
        )
          ? course.completedLessons.length
          : 0;

        return total + completedLessons;
      },
      0
    );
  }, [purchasedCourses]);

  /* =====================================
     FORM
  ====================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: updatedValue,
    }));

    setMessage("");
    setError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter your full name.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone)
    ) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }

    return "";
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const updatedUser = {
        ...storedUser,

        name: form.name.trim(),
        fullName: form.name.trim(),

        email: form.email
          .trim()
          .toLowerCase(),

        phone: form.phone,
        mobile: form.phone,

        profileImage,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setStoredUser(updatedUser);

      setMessage(
        "Profile updated successfully."
      );
    } catch (saveError) {
      console.error(
        "Profile update error:",
        saveError
      );

      setError(
        "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================
     PROFILE IMAGE
  ====================================== */

  const handleImageSelect = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.type.startsWith("image/")
    ) {
      setError(
        "Please choose a valid image file."
      );
      return;
    }

    const maxFileSize = 2 * 1024 * 1024;

    if (selectedFile.size > maxFileSize) {
      setError(
        "Profile image must be smaller than 2 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(String(reader.result));
      setMessage("");
      setError("");
    };

    reader.onerror = () => {
      setError(
        "Unable to read the selected image."
      );
    };

    reader.readAsDataURL(selectedFile);
  };

  /* =====================================
     LOGOUT
  ====================================== */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (
      typeof setIsLoggedIn === "function"
    ) {
      setIsLoggedIn(false);
    }

    navigate("/login", {
      replace: true,
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="profile-page">
      {/* =====================================
          HERO
      ====================================== */}

      <section className="profile-hero">
        <div>
          <span>DVOC Student Account</span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information,
            learning account and student
            preferences.
          </p>
        </div>

        <Link to="/dashboard">
          Student Dashboard
          <FaArrowRight />
        </Link>
      </section>

      <section className="profile-container">
        {/* =====================================
            SIDEBAR
        ====================================== */}

        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt={form.name || "Student"}
              />
            ) : (
              <FaUser />
            )}

            <button
              type="button"
              aria-label="Change profile photo"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <FaCamera />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />
          </div>

          <span className="profile-student-label">
            DVOC Student
          </span>

          <h2>
            {form.name || "DVOC Student"}
          </h2>

          <p>
            {form.email || "Student email"}
          </p>

          <div className="profile-account-role">
            <FaGraduationCap />

            <span>
              {storedUser.role === "admin"
                ? "Administrator Account"
                : "Student Learning Account"}
            </span>
          </div>

          <div className="profile-sidebar-links">
            <button
              type="button"
              className="active"
            >
              <FaUser />
              Personal Information
            </button>

            <Link to="/forgot-password">
              <FaLock />
              Change Password
            </Link>

            <Link to="/my-courses">
              <FaBookOpen />
              My Courses
            </Link>

            <Link to="/certificates">
              <FaCertificate />
              Certificates
            </Link>
          </div>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </aside>

        {/* =====================================
            MAIN CONTENT
        ====================================== */}

        <div className="profile-main-content">
          <section className="profile-stat-grid">
            <article>
              <FaBookOpen />

              <div>
                <strong>
                  {purchasedCourses.length}
                </strong>

                <span>Enrolled Courses</span>
              </div>
            </article>

            <article>
              <FaCheckCircle />

              <div>
                <strong>
                  {completedCourses}
                </strong>

                <span>Completed Courses</span>
              </div>
            </article>

            <article>
              <FaCertificate />

              <div>
                <strong>
                  {certificateCount}
                </strong>

                <span>Certificates Earned</span>
              </div>
            </article>

            <article>
              <FaGraduationCap />

              <div>
                <strong>
                  {totalCompletedLessons}
                </strong>

                <span>Lessons Completed</span>
              </div>
            </article>
          </section>

          <section className="profile-form-card">
            <div className="profile-form-heading">
              <span>Account Details</span>

              <h2>
                Personal Information
              </h2>

              <p>
                Update the information connected
                to your DVOC learning account.
              </p>
            </div>

            {message && (
              <div className="profile-success">
                <FaCheckCircle />
                {message}
              </div>
            )}

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="profile-form-group">
                <label htmlFor="profile-name">
                  Full Name
                </label>

                <div>
                  <FaUser />

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-email">
                  Email Address
                </label>

                <div>
                  <FaEnvelope />

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label htmlFor="profile-phone">
                  Mobile Number
                </label>

                <div>
                  <FaPhoneAlt />

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    maxLength="10"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <small>
                  Enter an Indian mobile number
                  beginning with 6, 7, 8 or 9.
                </small>
              </div>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="profile-loader"></span>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="profile-security-card">
            <div>
              <FaLock />
            </div>

            <div>
              <span>Account Security</span>

              <h3>
                Keep Your Account Secure
              </h3>

              <p>
                Use a strong password and never
                share your student login details
                with anyone.
              </p>
            </div>

            <Link to="/forgot-password">
              Change Password
              <FaArrowRight />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Profile;