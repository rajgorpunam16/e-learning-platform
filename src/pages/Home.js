
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAward,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaGraduationCap,
  FaHeart,
  FaLaptopCode,
  FaPlayCircle,
  FaQuoteLeft,
  FaShoppingCart,
  FaStar,
  FaTasks,
  FaUserGraduate,
  FaVideo,
} from "react-icons/fa";

import "../css/Home.css";



function Home({
  cart = [],
  setCart,
  wishlist = [],
  toggleWishlist,
  purchasedCourses = [],
  isLoggedIn = false,
}) {
  const navigate = useNavigate();
  const courseSliderRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [formMessage, setFormMessage] = useState("");

  /*
   * ---------------------------------------------------------
   * FETCH COURSES FROM DATABASE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setCourseError("");

      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load courses."
        );
      }

      const courseList = Array.isArray(data)
        ? data
        : data.courses || [];

      setCourses(courseList);
    } catch (error) {
      console.error("Home course fetch error:", error);
      setCourseError(
        error.message || "Unable to load courses."
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * COURSE HELPERS
   * ---------------------------------------------------------
   */

  const getCourseId = (course) =>
    course?._id || course?.id;

  const getCourseImage = (course) =>
    course?.image ||
    course?.coverImage ||
    course?.coverUrl ||
    "";

  const getPrice = (course) =>
    Number(course?.price || 0);

  const getOriginalPrice = (course) =>
    Number(
      course?.originalPrice ||
        course?.original ||
        course?.price ||
        0
    );

  const getRating = (course) =>
    Number(course?.rating || 0);

  const getStudents = (course) =>
    Number(course?.students || 0);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  /*
   * ---------------------------------------------------------
   * CART / WISHLIST / PURCHASE STATUS
   * ---------------------------------------------------------
   */

  const isInCart = (course) => {
    const courseId = getCourseId(course);

    return cart.some(
      (cartCourse) =>
        String(getCourseId(cartCourse)) ===
        String(courseId)
    );
  };

  const isInWishlist = (course) => {
    const courseId = getCourseId(course);

    return wishlist.some(
      (savedCourse) =>
        String(getCourseId(savedCourse)) ===
        String(courseId)
    );
  };

  const isPurchased = (course) => {
    const courseId = getCourseId(course);

    return purchasedCourses.some(
      (purchasedCourse) =>
        String(getCourseId(purchasedCourse)) ===
        String(courseId)
    );
  };

  /*
   * ---------------------------------------------------------
   * VIEW COURSE DETAILS
   * ---------------------------------------------------------
   *
   * Same navigation logic as Courses.jsx
   */

  const handleViewDetails = (course) => {
    const courseId = getCourseId(course);

    if (!courseId) {
      console.error("Course ID is missing:", course);
      return;
    }

    navigate(`/courses/${courseId}`, {
      state: {
        course,
      },
    });
  };

  /*
   * ---------------------------------------------------------
   * ADD COURSE TO CART
   * ---------------------------------------------------------
   */

  const addToCart = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const courseId = getCourseId(course);

    if (isPurchased(course)) {
      navigate(`/learn/${courseId}`, {
        state: {
          course,
        },
      });

      return;
    }

    if (isInCart(course)) {
      navigate("/cart");
      return;
    }

    if (setCart) {
      setCart((previousCart) => [
        ...previousCart,
        {
          ...course,
          id: courseId,
          quantity: 1,
        },
      ]);
    }
  };

  /*
   * ---------------------------------------------------------
   * WISHLIST
   * ---------------------------------------------------------
   */

  const handleWishlist = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (toggleWishlist) {
      const courseId = getCourseId(course);

      toggleWishlist({
        ...course,
        id: courseId,
        _id: courseId,
      });
    }
  };

  /*
   * ---------------------------------------------------------
   * DYNAMIC CATEGORIES
   * ---------------------------------------------------------
   */

  const categories = [
    "All",
    ...new Set(
      courses
        .map((course) => course.category)
        .filter(Boolean)
    ),
  ];

  /*
   * ---------------------------------------------------------
   * FILTER COURSES
   * ---------------------------------------------------------
   */

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter(
          (course) =>
            course.category === activeCategory
        );

  /*
   * ---------------------------------------------------------
   * ENQUIRY FORM
   * ---------------------------------------------------------
   */

  const handleEnquiryChange = (event) => {
    const { name, value } = event.target;

    setEnquiryForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setFormMessage("");
  };

  const handleEnquirySubmit = (event) => {
    event.preventDefault();

    const {
      name,
      email,
      phone,
      course,
    } = enquiryForm;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !course
    ) {
      setFormMessage(
        "Please complete all fields."
      );
      return;
    }

    if (!email.includes("@")) {
      setFormMessage(
        "Please enter a valid email address."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setFormMessage(
      "Your enquiry has been submitted. Our counsellor will contact you shortly."
    );

    setEnquiryForm({
      name: "",
      email: "",
      phone: "",
      course: "",
    });
  };

  /*
   * ---------------------------------------------------------
   * COURSE SLIDER
   * ---------------------------------------------------------
   */

  const scrollCourses = (direction) => {
    if (!courseSliderRef.current) {
      return;
    }

    courseSliderRef.current.scrollBy({
      left:
        direction === "next"
          ? 390
          : -390,
      behavior: "smooth",
    });
  };

  /*
   * ---------------------------------------------------------
   * STATIC HOME DATA
   * ---------------------------------------------------------
   */

  const statistics = [
    {
      icon: <FaAward />,
      number: "30+",
      label: "Years of Excellence",
    },
    {
      icon: <FaUserGraduate />,
      number: "30K+",
      label: "Students Trained",
    },
    {
      icon: <FaBookOpen />,
      number: "30+",
      label: "Online Courses",
    },
    {
      icon: <FaCertificate />,
      number: "100%",
      label: "Learning Support",
    },
  ];

  const platformFeatures = [
    {
      icon: <FaVideo />,
      title: "Recorded Video Lessons",
      description:
        "Learn at your own pace with structured, chapter-wise video lessons available from your student dashboard.",
    },
    {
      icon: <FaTasks />,
      title: "Assignments and Quizzes",
      description:
        "Strengthen your knowledge through practical assignments, quizzes and topic-based assessments.",
    },
    {
      icon: <FaCertificate />,
      title: "Course Certificates",
      description:
        "Complete eligible courses and receive a certificate that reflects your skills and learning progress.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Practical Projects",
      description:
        "Build real applications and portfolio-ready projects using modern tools and industry-focused technologies.",
    },
  ];

  const learningSteps = [
    {
      number: "01",
      title: "Choose a Course",
      description:
        "Browse courses and select a program based on your skills and career goals.",
    },
    {
      number: "02",
      title: "Purchase and Enrol",
      description:
        "Add the course to your cart, complete payment and enrol instantly.",
    },
    {
      number: "03",
      title: "Learn at Your Pace",
      description:
        "Watch lessons, download notes and complete assignments from your dashboard.",
    },
    {
      number: "04",
      title: "Complete and Certify",
      description:
        "Finish the course requirements and receive your completion certificate.",
    },
  ];

  const testimonials = [
    {
      image: "/student-shubham.jpg",
      name: "Shubham Pawar",
      course: "Data Science",
      review:
        "The structured lessons and practical projects helped me understand difficult concepts and apply them confidently.",
    },
    {
      image: "/student-tejal.jpg",
      name: "Tejal Jadhav",
      course: "Digital Marketing",
      review:
        "I could revise lessons anytime and complete assignments at my own pace. The learning platform was simple to use.",
    },
    {
      image: "/student-sandeep.jpg",
      name: "Sandeep Sain",
      course: "Full Stack Development",
      review:
        "The projects, quizzes and recorded lessons gave me the confidence to build complete web applications.",
    },
    {
      image: "/student-ashwini.jpg",
      name: "Ashwini Kundte",
      course: "Business Analytics",
      review:
        "The course content was organised properly, and the progress tracker helped me stay consistent throughout the program.",
    },
  ];

  return (
    <main className="dvoc-home">

      {/* HERO */}

      <section className="dvoc-hero-section">
        <div className="dvoc-hero-content">

          <span className="dvoc-hero-label">
            Learn Online with DVOC Institute
          </span>

          <h1>
            Learn Today.
            <span>
              Build Your Career Tomorrow.
            </span>
          </h1>

          <p>
            Explore career-focused online courses
            with recorded lessons, assignments,
            quizzes, practical projects, progress
            tracking and certification—all available
            through one learning platform.
          </p>

          <div className="dvoc-hero-features">

            <div>
              <FaCheckCircle />
              <span>
                Learn anytime from any device
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                Practical lessons and real projects
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                Track progress from your dashboard
              </span>
            </div>

          </div>

          <div className="dvoc-hero-buttons">

            <Link
              to="/courses"
              className="dvoc-main-button"
            >
              Browse Online Courses
              <FaArrowRight />
            </Link>

            {!isLoggedIn ? (
              <Link
                to="/register"
                className="dvoc-outline-button"
              >
                Create Student Account
              </Link>
            ) : (
              <Link
                to="/my-courses"
                className="dvoc-outline-button"
              >
                Go to My Courses
              </Link>
            )}

          </div>
        </div>

        <div className="dvoc-enquiry-card">

          <div className="dvoc-enquiry-title">
            <div>
              <span>Need help choosing?</span>
              <h2>Course Guidance</h2>
            </div>

            <img
              src="/dvoc.png"
              alt="DVOC Institute"
            />
          </div>

          <p className="dvoc-enquiry-description">
            Tell us your learning interests and
            our counsellor will help you select a
            suitable online course.
          </p>

          <form onSubmit={handleEnquirySubmit}>

            <div className="dvoc-enquiry-row">

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={enquiryForm.name}
                onChange={handleEnquiryChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={enquiryForm.email}
                onChange={handleEnquiryChange}
              />

            </div>

            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number"
              maxLength="10"
              value={enquiryForm.phone}
              onChange={handleEnquiryChange}
            />

            <select
              name="course"
              value={enquiryForm.course}
              onChange={handleEnquiryChange}
            >
              <option value="">
                Select course interest
              </option>

              {courses.map((course) => {
                const courseId =
                  getCourseId(course);

                return (
                  <option
                    key={courseId}
                    value={course.title || ""}
                  >
                    {course.title}
                  </option>
                );
              })}
            </select>

            <button type="submit">
              Request Course Guidance
              <FaArrowRight />
            </button>

          </form>

          {formMessage && (
            <p className="dvoc-form-message">
              {formMessage}
            </p>
          )}

          <small>
            Your information will only be used
            for course counselling.
          </small>

        </div>
      </section>

{/* GOVERNMENT & INDUSTRY PARTNERS */}

<section className="dvoc-partners-section">
  <div className="dvoc-partners-heading">
    <span>RECOGNIZED &amp; CERTIFIED BY</span>

    <h2>Government &amp; Industry Partners</h2>
  </div>

  <div className="dvoc-partners-slider">
    <div className="dvoc-partners-track">

      {/* First set */}
      <div className="dvoc-partner-card">
        <img
          src="/MARATHI.png"
          alt="Government University"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/NSDC.png"
          alt="NSDC"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/MS-CIT.png"
          alt="MS-CIT"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/MKCL.png"
          alt="MKCL"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/tally.png"
          alt="Tally Institute"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/KCLI.png"
          alt="KCLI Courses"
        />
      </div>

      {/* Duplicate set for infinite scrolling */}
      <div className="dvoc-partner-card">
        <img
          src="/MARATHI.png"
          alt="Government University"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/NSDC.png"
          alt="NSDC"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/MS-CIT.png"
          alt="MS-CIT"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/MKCL.png"
          alt="MKCL"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/tally.png"
          alt="Tally Institute"
        />
      </div>

      <div className="dvoc-partner-card">
        <img
          src="/KSLiC.png"
          alt="KCLI Courses"
        />
      </div>

    </div>
  </div>
</section>

      {/* STATISTICS */}

      <section className="dvoc-statistics-section">

        {statistics.map((statistic) => (
          <article key={statistic.label}>

            <div className="dvoc-stat-icon">
              {statistic.icon}
            </div>

            <div>
              <strong>
                {statistic.number}
              </strong>

              <span>
                {statistic.label}
              </span>
            </div>

          </article>
        ))}

      </section>

      {/* PLATFORM FEATURES */}

      <section className="dvoc-home-section dvoc-highlights">

        <div className="dvoc-section-heading">

          <span>Learning Experience</span>

          <h2>
            Everything You Need to{" "}
            <strong>
              Learn Successfully
            </strong>
          </h2>

          <p>
            Learn through structured course
            modules and access all your resources
            from one student dashboard.
          </p>

        </div>

        <div className="dvoc-platform-feature-grid">

          {platformFeatures.map((feature) => (
            <article
              className="dvoc-platform-feature-card"
              key={feature.title}
            >

              <div className="dvoc-highlight-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

            </article>
          ))}

        </div>

      </section>

      {/* COURSES */}

      <section className="dvoc-home-section dvoc-courses-section">

        <div className="dvoc-courses-header">

          <div className="dvoc-section-heading left">

            <span>
              Popular Online Courses
            </span>

            <h2>
              Explore Our{" "}
              <strong>Courses</strong>
            </h2>

            <p>
              Purchase a course once and access
              its lessons, resources and learning
              activities through your account.
            </p>

          </div>

          <div className="dvoc-course-controls">

            <div className="dvoc-course-filters">

              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}

            </div>

            <div className="dvoc-slider-buttons">

              <button
                type="button"
                onClick={() =>
                  scrollCourses("previous")
                }
                aria-label="Previous courses"
              >
                <FaArrowLeft />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollCourses("next")
                }
                aria-label="Next courses"
              >
                <FaArrowRight />
              </button>

            </div>

          </div>

        </div>

        {/* COURSE LOADING */}

        {loadingCourses && (
          <div className="dvoc-course-status">
            <div className="dvoc-course-spinner"></div>

            <h3>
              Loading Courses
            </h3>

            <p>
              Please wait while we load
              the course catalogue.
            </p>
          </div>
        )}

        {/* COURSE ERROR */}

        {!loadingCourses && courseError && (
          <div className="dvoc-course-status">

            <FaBookOpen />

            <h3>
              Unable to Load Courses
            </h3>

            <p>
              {courseError}
            </p>

            <button
              type="button"
              onClick={fetchCourses}
            >
              Try Again
            </button>

          </div>
        )}

        {/* NO COURSES */}

        {!loadingCourses &&
          !courseError &&
          filteredCourses.length === 0 && (
            <div className="dvoc-course-status">

              <FaBookOpen />

              <h3>
                No Courses Found
              </h3>

              <p>
                There are no courses available
                in this category.
              </p>

            </div>
          )}

        {/* DATABASE COURSES */}

        {!loadingCourses &&
          !courseError &&
          filteredCourses.length > 0 && (

            <div
              className="dvoc-course-slider"
              ref={courseSliderRef}
            >

              {filteredCourses.map((course) => {

                const courseId =
                  getCourseId(course);

                const image =
                  getCourseImage(course);

                const price =
                  getPrice(course);

                const originalPrice =
                  getOriginalPrice(course);

                const rating = Math.min(
                  5,
                  Math.max(
                    0,
                    getRating(course)
                  )
                );

                const students =
                  getStudents(course);

                const purchased =
                  isPurchased(course);

                const added =
                  isInCart(course);

                const saved =
                  isInWishlist(course);

                const discount =
                  originalPrice > price
                    ? Math.round(
                        ((originalPrice - price) /
                          originalPrice) *
                          100
                      )
                    : 0;

                return (
                  <article
                    className="dvoc-course-card"
                    key={courseId}
                  >

                    {/* COURSE IMAGE */}

                    <div
                      className="dvoc-course-image"
                      onClick={() =>
                        handleViewDetails(course)
                      }
                    >

                      {image ? (
                        <img
                          src={image}
                          alt={
                            course.title ||
                            "DVOC Course"
                          }
                        />
                      ) : (
                        <div className="dvoc-course-image-placeholder">
                          <FaBookOpen />
                        </div>
                      )}

                      {course.badge && (
                        <span className="dvoc-course-badge">
                          {course.badge}
                        </span>
                      )}

                      <span className="dvoc-course-level">
                        {course.level ||
                          "All Levels"}
                      </span>

                      <button
                        type="button"
                        className={
                          saved
                            ? "dvoc-course-wishlist active"
                            : "dvoc-course-wishlist"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          handleWishlist(course);
                        }}
                        aria-label={
                          saved
                            ? "Remove course from wishlist"
                            : "Add course to wishlist"
                        }
                      >
                        <FaHeart />
                      </button>

                    </div>

                    {/* COURSE INFORMATION */}

                    <div className="dvoc-course-information">

                      <div className="dvoc-course-rating">

                        <FaStar />

                        <strong>
                          {rating.toFixed(1)}
                        </strong>

                        <span>
                          (
                          {students.toLocaleString(
                            "en-IN"
                          )}{" "}
                          students)
                        </span>

                      </div>

                      <h3>
                        {course.title ||
                          "DVOC Online Course"}
                      </h3>

                      <p>
                        {course.description ||
                          "Practical, career-focused learning with structured lessons and projects."}
                      </p>

                      <span className="dvoc-course-instructor">
                        By{" "}
                        {course.instructor ||
                          "DVOC Faculty"}
                      </span>

                      <div className="dvoc-course-meta">

                        <span>
                          <FaClock />

                          {course.duration ||
                            "Self-paced"}
                        </span>

                        <span>
                          <FaPlayCircle />

                          {course.lessons ||
                            0}{" "}
                          lessons
                        </span>

                      </div>

                      <div className="dvoc-course-price-row">

                        <div className="dvoc-course-price">

                          <strong>
                            ₹
                            {formatPrice(
                              price
                            )}
                          </strong>

                          {originalPrice >
                            price && (
                            <span>
                              ₹
                              {formatPrice(
                                originalPrice
                              )}
                            </span>
                          )}

                        </div>

                        {discount > 0 && (
                          <span className="dvoc-course-discount">
                            {discount}% OFF
                          </span>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="dvoc-course-actions">

                        <button
                          type="button"
                          className="dvoc-course-details-button"
                          onClick={() =>
                            handleViewDetails(
                              course
                            )
                          }
                        >
                          View Details
                          <FaArrowRight />
                        </button>

                        <button
                          type="button"
                          className={
                            purchased
                              ? "dvoc-course-cart-button purchased"
                              : added
                              ? "dvoc-course-cart-button added"
                              : "dvoc-course-cart-button"
                          }
                          onClick={() =>
                            addToCart(course)
                          }
                        >

                          {purchased ? (
                            <>
                              <FaPlayCircle />
                              Start Learning
                            </>
                          ) : added ? (
                            <>
                              <FaShoppingCart />
                              View Cart
                            </>
                          ) : (
                            <>
                              <FaShoppingCart />
                              Add to Cart
                            </>
                          )}

                        </button>

                      </div>

                    </div>
                  </article>
                );
              })}

            </div>
          )}

        <div className="dvoc-view-all-wrapper">

          <Link to="/courses">
            View All Courses
            <FaArrowRight />
          </Link>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="dvoc-home-section dvoc-learning-process-section">

        <div className="dvoc-section-heading">

          <span>
            How It Works
          </span>

          <h2>
            Start Learning in{" "}
            <strong>
              Four Simple Steps
            </strong>
          </h2>

          <p>
            From selecting a course to earning
            your certificate, your complete
            learning journey happens on one
            platform.
          </p>

        </div>

        <div className="dvoc-learning-process-grid">

          {learningSteps.map((step) => (
            <article
              className="dvoc-learning-step"
              key={step.number}
            >

              <span>
                {step.number}
              </span>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.description}
              </p>

            </article>
          ))}

        </div>

      </section>

      {/* STUDENT DASHBOARD */}

      <section className="dvoc-dashboard-promotion">

        <div className="dvoc-dashboard-visual">

          <div className="dvoc-dashboard-icon">
            <FaLaptopCode />
          </div>

          <div className="dvoc-dashboard-floating-item item-one">
            <FaPlayCircle />
            Continue Learning
          </div>

          <div className="dvoc-dashboard-floating-item item-two">
            <FaDownload />
            Download Notes
          </div>

          <div className="dvoc-dashboard-floating-item item-three">
            <FaCertificate />
            Earn Certificate
          </div>

        </div>

        <div className="dvoc-dashboard-content">

          <span>
            Your Learning Dashboard
          </span>

          <h2>
            Manage all your courses
            in one place
          </h2>

          <p>
            Access purchased courses, continue
            unfinished lessons, download resources,
            complete quizzes and monitor your
            learning progress through your personal
            student dashboard.
          </p>

          <div className="dvoc-dashboard-benefits">

            <div>
              <FaCheckCircle />
              <span>
                View all purchased courses
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                Track lesson and course completion
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                Access notes and downloadable resources
              </span>
            </div>

            <div>
              <FaCheckCircle />
              <span>
                View quiz scores and certificates
              </span>
            </div>

          </div>

          <Link
            to={
              isLoggedIn
                ? "/my-courses"
                : "/login"
            }
            className="dvoc-dashboard-button"
          >
            {isLoggedIn
              ? "Open My Courses"
              : "Login to Start Learning"}

            <FaArrowRight />
          </Link>

        </div>

      </section>

      {/* TESTIMONIALS */}

      <section className="dvoc-testimonial-section">

        <div className="dvoc-section-heading">

          <span>
            Student Feedback
          </span>

          <h2>
            What Our{" "}
            <strong>
              Learners Say
            </strong>
          </h2>

          <p>
            Students share their experience of
            learning through DVOC’s online courses
            and practical activities.
          </p>

        </div>

        <div className="dvoc-testimonial-grid">

          {testimonials.map((testimonial) => (
            <article
              className="dvoc-testimonial-card"
              key={testimonial.name}
            >

              <div className="dvoc-student-image">

                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                />

              </div>

              <FaQuoteLeft className="dvoc-quote-icon" />

              <p>
                “{testimonial.review}”
              </p>

              <div className="dvoc-testimonial-divider"></div>

              <h3>
                {testimonial.name}
              </h3>

              <span>
                {testimonial.course} Student
              </span>

            </article>
          ))}

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="dvoc-home-cta">

        <div>

          <span>
            Start Learning Today
          </span>

          <h2>
            Build Skills That Move
            <br />
            Your Career{" "}
            <strong>
              Forward
            </strong>
          </h2>

          <p>
            Create your student account, choose
            a course and begin learning through
            recorded lessons, assignments and
            practical projects.
          </p>

        </div>

        <div className="dvoc-home-cta-actions">

          <Link to="/courses">
            Explore Courses
            <FaArrowRight />
          </Link>

          {!isLoggedIn ? (
            <Link to="/register">

              <FaGraduationCap />

              <div>
                <span>
                  New Student?
                </span>

                <strong>
                  Create Free Account
                </strong>
              </div>

            </Link>
          ) : (
            <Link to="/my-courses">

              <FaBookOpen />

              <div>
                <span>
                  Continue Learning
                </span>

                <strong>
                  Open My Courses
                </strong>
              </div>

            </Link>
          )}

        </div>

      </section>

    </main>
  );
}

export default Home;

