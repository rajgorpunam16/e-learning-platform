import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaBookOpen,
  FaCertificate,
  FaChevronDown,
  FaEnvelope,
  FaFacebookF,
  FaFileInvoice,
  FaGraduationCap,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import "../css/Navbar.css";

function Navbar({
  cart = [],
  wishlist = [],
  isLoggedIn = false,
  setIsLoggedIn,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const path = location.pathname;

  /* =====================================================
     API
  ===================================================== */

  const API_URL = "http://localhost:5000/api/courses";

  /* =====================================================
     FETCH COURSES
  ===================================================== */

  useEffect(() => {
    fetchNavbarCourses();
  }, []);

  const fetchNavbarCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch courses: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Navbar courses:", data);

      let courseList = [];

      if (Array.isArray(data)) {
        courseList = data;
      } else if (Array.isArray(data.courses)) {
        courseList = data.courses;
      } else if (Array.isArray(data.data)) {
        courseList = data.data;
      } else if (Array.isArray(data.books)) {
        courseList = data.books;
      }

      setCourses(courseList);
    } catch (error) {
      console.error(
        "Navbar course fetch error:",
        error
      );

      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  /* =====================================================
     HIDDEN NAVBAR PAGES
  ===================================================== */

  const hiddenPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const shouldHideNavbar = hiddenPages.some((page) =>
    path.toLowerCase().startsWith(page)
  );

  if (shouldHideNavbar) {
    return null;
  }

  /* =====================================================
     ACTIVE ROUTE
  ===================================================== */

  const isActive = (route) => {
    if (route === "/") {
      return path === "/";
    }

    return path.startsWith(route);
  };

  /* =====================================================
     COURSE HELPERS
  ===================================================== */

  const getCourseId = (course) => {
    return (
      course?._id ||
      course?.id ||
      course?.bookId ||
      course?.courseId
    );
  };

  const getCourseTitle = (course) => {
    return (
      course?.title ||
      course?.name ||
      course?.courseName ||
      course?.bookTitle ||
      "Course"
    );
  };

  const getCourseCategory = (course) => {
    return (
      course?.category ||
      course?.genre ||
      course?.courseCategory ||
      "Professional Course"
    );
  };

  /* =====================================================
     POPULAR PROGRAMS
  ===================================================== */

  /*
    Show the first 6 courses coming from:

    http://localhost:5000/api/courses
  */

  const displayedCourses = courses
    .filter((course) => getCourseId(course))
    .slice(0, 6);

  /* =====================================================
     CART / WISHLIST COUNT
  ===================================================== */

  const cartCount = cart.reduce(
    (total, course) =>
      total + Number(course?.quantity || 1),
    0
  );

  const wishlistCount = wishlist.length;

  /* =====================================================
     CLOSE MENUS
  ===================================================== */

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCoursesOpen(false);
    setProfileOpen(false);
  };

  /* =====================================================
     OPEN COURSE DETAILS
  ===================================================== */

  const openCourseDetails = (course) => {
    const courseId = getCourseId(course);

    if (!courseId) {
      console.error(
        "Course does not have a valid ID:",
        course
      );
      return;
    }

    closeMenus();

    navigate(`/courses/${courseId}`, {
      state: {
        course,
      },
    });
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }

    closeMenus();

    navigate("/login");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <header className="dvoc-navbar-wrapper">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="dvoc-topbar">
        <div className="dvoc-topbar-inner">

          <div className="dvoc-topbar-contact">

            <a href="tel:+917021733916">
              <FaPhoneAlt />
              <span>+91 70217 33916</span>
            </a>

            <a href="mailto:info@dvoc.in">
              <FaEnvelope />
              <span>info@dvoc.in</span>
            </a>

          </div>

          <div className="dvoc-social-links">

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="DVOC Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="DVOC Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="DVOC LinkedIn"
            >
              <FaLinkedinIn />
            </a>

          </div>

        </div>
      </div>

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <nav className="dvoc-navbar">

        <div className="dvoc-navbar-inner">

          {/* LOGO */}

          <Link
            to="/"
            className="dvoc-navbar-logo"
            onClick={closeMenus}
          >
            <img
              src="/dvoc.png"
              alt="DVOC Institute"
            />
          </Link>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            className="dvoc-mobile-toggle"
            onClick={() =>
              setMobileMenuOpen(
                (previousValue) => !previousValue
              )
            }
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

          <div
            className={
              mobileMenuOpen
                ? "dvoc-navbar-content open"
                : "dvoc-navbar-content"
            }
          >

            {/* =================================================
                NAVIGATION LINKS
            ================================================= */}

            <div className="dvoc-navbar-links">

              {/* HOME */}

              <Link
                to="/"
                className={
                  isActive("/")
                    ? "active"
                    : ""
                }
                onClick={closeMenus}
              >
                Home
              </Link>

              {/* =================================================
                  COURSES DROPDOWN
              ================================================= */}

              <div
                className={
                  coursesOpen
                    ? "dvoc-nav-dropdown open"
                    : "dvoc-nav-dropdown"
                }
                onMouseEnter={() =>
                  setCoursesOpen(true)
                }
                onMouseLeave={() =>
                  setCoursesOpen(false)
                }
              >

                <button
                  type="button"
                  className={
                    isActive("/courses")
                      ? "dvoc-dropdown-trigger active"
                      : "dvoc-dropdown-trigger"
                  }
                  onClick={() =>
                    setCoursesOpen(
                      (previousValue) =>
                        !previousValue
                    )
                  }
                >
                  Courses
                  <FaChevronDown />
                </button>

                <div className="dvoc-dropdown-menu dvoc-courses-dropdown">
{/* =================================================
    EXPLORE COURSES
================================================= */}

<div className="dvoc-dropdown-column">

  <span className="dvoc-dropdown-heading">
    Explore Courses
  </span>

  {/* ALL COURSES */}

  <Link
    to="/courses"
    onClick={closeMenus}
  >
    All Categories
  </Link>

  {/* DATA & AI */}

  <Link
    to="/courses?category=Data%20%26%20AI"
    onClick={closeMenus}
  >
    Data & AI
  </Link>

  {/* DIGITAL SKILLS */}

  <Link
    to="/courses?category=Digital%20Skills"
    onClick={closeMenus}
  >
    Digital Skills
  </Link>

  {/* BUSINESS */}

  <Link
    to="/courses?category=Business"
    onClick={closeMenus}
  >
    Business
  </Link>

  {/* DEVELOPMENT */}

  <Link
    to="/courses?category=Development"
    onClick={closeMenus}
  >
    Development
  </Link>

</div>
                  {/* =================================================
                      POPULAR PROGRAMS
                  ================================================= */}

                  <div className="dvoc-dropdown-column">

                    <span className="dvoc-dropdown-heading">
                      Popular Programs
                    </span>

                    {coursesLoading ? (

                      <span className="dvoc-course-loading">
                        Loading courses...
                      </span>

                    ) : displayedCourses.length > 0 ? (

                      displayedCourses.map((course) => {

                        const courseId =
                          getCourseId(course);

                        return (
                          <button
                            key={String(courseId)}
                            type="button"
                            className="dvoc-course-dropdown-link"
                            onClick={() =>
                              openCourseDetails(course)
                            }
                          >
                            <span>
                              {getCourseTitle(course)}
                            </span>

                            <small>
                              {getCourseCategory(course)}
                            </small>
                          </button>
                        );
                      })

                    ) : (

                      <span className="dvoc-course-loading">
                        No courses available
                      </span>

                    )}

                  </div>

                </div>
              </div>

              {/* ABOUT */}

              <Link
                to="/about"
                className={
                  isActive("/about")
                    ? "active"
                    : ""
                }
                onClick={closeMenus}
              >
                About Us
              </Link>

              {/* CONTACT */}

              <Link
                to="/contact"
                className={
                  isActive("/contact")
                    ? "active"
                    : ""
                }
                onClick={closeMenus}
              >
                Contact Us
              </Link>

            </div>

            {/* =================================================
                NAVBAR ACTIONS
            ================================================= */}

            <div className="dvoc-navbar-actions">

              {/* CALL */}

              <a
                href="tel:+917021733916"
                className="dvoc-call-button"
              >
                <FaPhoneAlt />
                <span>Call Us</span>
              </a>

              {/* ENQUIRE */}

              <Link
                to="/contact"
                className="dvoc-enquire-button"
                onClick={closeMenus}
              >
                Enquire Now
              </Link>

              {/* WISHLIST */}

              <Link
                to="/wishlist"
                className={
                  isActive("/wishlist")
                    ? "dvoc-action-icon active"
                    : "dvoc-action-icon"
                }
                onClick={closeMenus}
                aria-label="Course wishlist"
                title="Wishlist"
              >
                <FaHeart />

                {wishlistCount > 0 && (
                  <span className="dvoc-action-count">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link
                to="/cart"
                className={
                  isActive("/cart")
                    ? "dvoc-action-icon active"
                    : "dvoc-action-icon"
                }
                onClick={closeMenus}
                aria-label="Course cart"
                title="Course Cart"
              >
                <FaShoppingCart />

                {cartCount > 0 && (
                  <span className="dvoc-action-count">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {/* =================================================
                  PROFILE
              ================================================= */}

              <div
                className={
                  profileOpen
                    ? "dvoc-profile-menu open"
                    : "dvoc-profile-menu"
                }
                onMouseEnter={() =>
                  setProfileOpen(true)
                }
                onMouseLeave={() =>
                  setProfileOpen(false)
                }
              >

                <button
                  type="button"
                  className={
                    isActive("/profile") ||
                    isActive("/dashboard") ||
                    isActive("/my-courses")
                      ? "dvoc-profile-trigger active"
                      : "dvoc-profile-trigger"
                  }
                  onClick={() =>
                    setProfileOpen(
                      (previousValue) =>
                        !previousValue
                    )
                  }
                  aria-label="Student profile menu"
                >
                  <FaUserCircle />
                </button>

                <div className="dvoc-profile-dropdown">

                  {/* LOGGED OUT */}

                  {!isLoggedIn ? (

                    <>
                      <div className="dvoc-profile-header">

                        <FaGraduationCap />

                        <div>
                          <strong>
                            Student Account
                          </strong>

                          <span>
                            Login to access your courses
                          </span>
                        </div>

                      </div>

                      <Link
                        to="/login"
                        className="dvoc-profile-login"
                        onClick={closeMenus}
                      >
                        <FaSignInAlt />
                        Student Login
                      </Link>

                      <Link
                        to="/register"
                        className="dvoc-profile-register"
                        onClick={closeMenus}
                      >
                        Create Account
                      </Link>
                    </>

                  ) : (

                    /* LOGGED IN */

                    <>
                      <div className="dvoc-profile-header">

                        <FaUserCircle />

                        <div>
                          <strong>
                            My Learning Account
                          </strong>

                          <span>
                            Manage your DVOC learning
                          </span>
                        </div>

                      </div>

                      <div className="dvoc-profile-links">

                        <Link
                          to="/dashboard"
                          onClick={closeMenus}
                        >
                          <FaTachometerAlt />
                          Dashboard
                        </Link>

                        <Link
                          to="/my-courses"
                          onClick={closeMenus}
                        >
                          <FaBookOpen />
                          My Courses
                        </Link>

                        <Link
                          to="/certificates"
                          onClick={closeMenus}
                        >
                          <FaCertificate />
                          Certificates
                        </Link>

                        <Link
                          to="/purchase-history"
                          onClick={closeMenus}
                        >
                          <FaFileInvoice />
                          Purchase History
                        </Link>

                        <Link
                          to="/profile"
                          onClick={closeMenus}
                        >
                          <FaUserCircle />
                          My Profile
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={closeMenus}
                        >
                          <FaHeart />
                          Wishlist
                        </Link>

                        <Link
                          to="/cart"
                          onClick={closeMenus}
                        >
                          <FaShoppingCart />
                          Course Cart
                        </Link>

                      </div>

                      <button
                        type="button"
                        className="dvoc-profile-logout"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </>

                  )}

                </div>
              </div>

            </div>

          </div>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;