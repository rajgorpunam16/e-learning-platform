import { Link, useLocation } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBookOpen,
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaArrowRight,
  FaTachometerAlt,
  FaCertificate,
  FaFileInvoice,
  FaQuestionCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

import "../css/Footer.css";

function Footer({ isLoggedIn = false }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const hiddenPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin",
  ];

  const shouldHideFooter = hiddenPages.some((page) =>
    path.startsWith(page)
  );

  if (shouldHideFooter) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="dvoc-footer">
      <div className="dvoc-footer-top-line"></div>

      <div className="dvoc-footer-container">
        {/* =========================
            BRAND SECTION
        ========================= */}

        <div className="dvoc-footer-brand">
          <Link to="/" className="dvoc-footer-logo">
            <img
              src="/dvoc.png"
              alt="DVOC Institute"
            />
          </Link>

          <span className="dvoc-footer-brand-label">
            DVOC E-Learning Platform
          </span>

          <p>
            Learn practical, career-focused skills through
            structured online courses, recorded lessons,
            assignments, quizzes, projects and certification.
          </p>

          <div className="dvoc-footer-contact-mini">
            <a href="tel:+917021733916">
              <FaPhoneAlt />
              +91 70217 33916
            </a>

            <a href="mailto:info@dvoc.in">
              <FaEnvelope />
              info@dvoc.in
            </a>
          </div>

          <div className="dvoc-footer-social">
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

        {/* =========================
            COURSES
        ========================= */}

        <div className="dvoc-footer-column">
          <h3>Courses</h3>

          <ul>
            <li>
              <Link to="/courses?program=java-full-stack">
                Java Full Stack
              </Link>
            </li>

            <li>
              <Link to="/courses?program=mern-full-stack">
                MERN Full Stack
              </Link>
            </li>

            <li>
              <Link to="/courses?program=data-science">
                Data Science and AI
              </Link>
            </li>

            <li>
              <Link to="/courses?program=data-analytics">
                Data Analytics
              </Link>
            </li>

            <li>
              <Link to="/courses?program=fintech">
                FinTech and Analytics
              </Link>
            </li>

            <li>
              <Link to="/courses?program=digital-marketing">
                Digital Marketing
              </Link>
            </li>

            <li>
              <Link
                to="/courses"
                className="dvoc-footer-highlight-link"
              >
                View All Courses
                <FaArrowRight />
              </Link>
            </li>
          </ul>
        </div>

        {/* =========================
            STUDENT
        ========================= */}

        <div className="dvoc-footer-column">
          <h3>Student</h3>

          <ul>
            <li>
              <Link to="/courses">
                <FaBookOpen />
                Browse Courses
              </Link>
            </li>

            <li>
              <Link
                to={
                  isLoggedIn
                    ? "/dashboard"
                    : "/login"
                }
              >
                <FaTachometerAlt />
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to={
                  isLoggedIn
                    ? "/my-courses"
                    : "/login"
                }
              >
                <FaGraduationCap />
                My Courses
              </Link>
            </li>

            <li>
              <Link to="/wishlist">
                <FaHeart />
                Wishlist
              </Link>
            </li>

            <li>
              <Link to="/cart">
                <FaShoppingCart />
                Course Cart
              </Link>
            </li>

            <li>
              <Link
                to={
                  isLoggedIn
                    ? "/certificates"
                    : "/login"
                }
              >
                <FaCertificate />
                Certificates
              </Link>
            </li>

            <li>
              <Link
                to={
                  isLoggedIn
                    ? "/purchase-history"
                    : "/login"
                }
              >
                <FaFileInvoice />
                Purchase History
              </Link>
            </li>

            <li>
              <Link
                to={
                  isLoggedIn
                    ? "/profile"
                    : "/login"
                }
              >
                <FaUserCircle />
                My Profile
              </Link>
            </li>

            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/login">
                    <FaSignInAlt />
                    Student Login
                  </Link>
                </li>

                <li>
                  <Link to="/register">
                    <FaUserPlus />
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* =========================
            SUPPORT
        ========================= */}

        <div className="dvoc-footer-column">
          <h3>Support</h3>

          <ul>
            <li>
              <Link to="/about">
                About DVOC
              </Link>
            </li>

            <li>
              <Link to="/contact">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/faq">
                <FaQuestionCircle />
                Frequently Asked Questions
              </Link>
            </li>

            <li>
              <Link to="/refund-policy">
                Refund Policy
              </Link>
            </li>

            <li>
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* =========================
            CONTACT
        ========================= */}

        <div className="dvoc-footer-column dvoc-footer-contact-column">
          <h3>Contact</h3>

          <ul>
            <li>
              <a href="tel:+917021733916">
                <FaPhoneAlt />

                <span>
                  <small>Call Us</small>
                  +91 70217 33916
                </span>
              </a>
            </li>

            <li>
              <a href="mailto:info@dvoc.in">
                <FaEnvelope />

                <span>
                  <small>Email Us</small>
                  info@dvoc.in
                </span>
              </a>
            </li>

            <li>
              <div className="dvoc-footer-address">
                <FaMapMarkerAlt />

                <span>
                  <small>Mumbai Branches</small>
                  Andheri, Vile Parle and Grant Road
                </span>
              </div>
            </li>
          </ul>

          <Link
            to="/contact"
            className="dvoc-footer-enquiry-button"
          >
            Get Course Guidance
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* =========================
          FOOTER BOTTOM
      ========================= */}

      <div className="dvoc-footer-bottom">
        <p>
          © {currentYear} DVOC Institute E-Learning
          Platform. All rights reserved.
        </p>

        <div className="dvoc-footer-bottom-links">
          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms of Use
          </Link>

          <Link to="/refund-policy">
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;