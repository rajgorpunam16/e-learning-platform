import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCertificate,
  FaCheck,
  FaClock,
  FaGraduationCap,
  FaHeart,
  FaPlayCircle,
  FaRedoAlt,
  FaShoppingCart,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa";

import "../css/CourseDetails.css";

import API_BASE_URL from "../config";

const API_URL= `${API_BASE_URL}/api/courses`;
function CourseDetails({
  cart = [],
  setCart,
  wishlist = [],
  toggleWishlist,
  isLoggedIn = false,
  purchasedCourses = [],
}) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState(
    location.state?.course || null
  );

  const [loading, setLoading] = useState(
    !location.state?.course
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    const stateCourse = location.state?.course;
    const stateCourseId =
      stateCourse?._id || stateCourse?.id;

    if (
      stateCourse &&
      String(stateCourseId) === String(id)
    ) {
      setCourse(stateCourse);
      setLoading(false);
      return;
    }

    fetchCourse();
  }, [id, location.state]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load this course."
        );
      }

      setCourse(data.course || data);
    } catch (requestError) {
      console.error("Course details error:", requestError);

      setError(
        requestError.message ||
          "Unable to load this course."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCourseId = (item) =>
    item?._id || item?.id;

  const courseId = getCourseId(course);

  const courseImage =
    course?.image ||
    course?.coverImage ||
    course?.coverUrl ||
    "";

  const price = Number(course?.price || 0);

  const originalPrice = Number(
    course?.originalPrice ||
      course?.original ||
      course?.price ||
      0
  );

  const rating = Math.min(
    5,
    Math.max(0, Number(course?.rating || 0))
  );

  const reviews = Number(course?.reviews || 0);
  const students = Number(course?.students || 0);
  const totalLessons = Number(course?.lessons || 0);

  const discount =
    originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) *
            100
        )
      : 0;

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const inCart = useMemo(() => {
    if (!courseId) {
      return false;
    }

    return cart.some(
      (item) =>
        String(getCourseId(item)) ===
        String(courseId)
    );
  }, [cart, courseId]);

  const inWishlist = useMemo(() => {
    if (!courseId) {
      return false;
    }

    return wishlist.some(
      (item) =>
        String(getCourseId(item)) ===
        String(courseId)
    );
  }, [wishlist, courseId]);

  const purchased = useMemo(() => {
    if (!courseId) {
      return false;
    }

    return purchasedCourses.some(
      (item) =>
        String(getCourseId(item)) ===
        String(courseId)
    );
  }, [purchasedCourses, courseId]);

  const handleAddToCart = () => {
    if (!course) {
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (purchased) {
      navigate(`/learn/${courseId}`, {
        state: { course },
      });

      return;
    }

    if (inCart) {
      navigate("/cart");
      return;
    }

    if (typeof setCart !== "function") {
      return;
    }

    setCart((previousCart) => [
      ...previousCart,
      {
        ...course,
        id: courseId,
        _id: courseId,
        quantity: 1,
      },
    ]);
  };

  const handleWishlist = () => {
    if (!course) {
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (typeof toggleWishlist !== "function") {
      return;
    }

    toggleWishlist({
      ...course,
      id: courseId,
      _id: courseId,
    });
  };

  const handleBuyNow = () => {
    if (!course) {
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (purchased) {
      navigate(`/learn/${courseId}`, {
        state: { course },
      });

      return;
    }

    if (!inCart && typeof setCart === "function") {
      setCart((previousCart) => [
        ...previousCart,
        {
          ...course,
          id: courseId,
          _id: courseId,
          quantity: 1,
        },
      ]);
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <main className="course-details-state">
        <div className="course-details-loader"></div>

        <h1>Loading Course</h1>

        <p>
          Please wait while we load the course details.
        </p>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="course-details-state">
        <FaBookOpen />

        <h1>Course Not Found</h1>

        <p>
          {error ||
            "The requested course is currently unavailable."}
        </p>

        <div className="course-state-actions">
          <button
            type="button"
            onClick={fetchCourse}
          >
            <FaRedoAlt />
            Try Again
          </button>

          <Link to="/courses">
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="course-details-page">
      <section className="course-details-hero">
        <div className="course-details-hero-inner">
          <button
            type="button"
            className="course-details-back"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back to Courses
          </button>

          <div className="course-details-grid">
            <div className="course-details-image">
              {courseImage ? (
                <img
                  src={courseImage}
                  alt={course.title}
                />
              ) : (
                <div className="course-details-placeholder">
                  <FaBookOpen />
                </div>
              )}

              {course.badge && (
                <span className="course-details-badge">
                  {course.badge}
                </span>
              )}

              <span className="course-details-level">
                {course.level || "All Levels"}
              </span>
            </div>

            <div className="course-details-main">
              <span className="course-details-category">
                {course.category ||
                  "Professional Course"}
              </span>

              <h1>{course.title}</h1>

              <p className="course-details-description">
                {course.longDescription ||
                  course.description ||
                  "Develop practical, career-ready skills with structured lessons, projects and certification."}
              </p>

              <div className="course-details-rating-row">
                <div className="course-details-rating">
                  <FaStar />

                  <strong>
                    {rating.toFixed(1)}
                  </strong>

                  <span>
                    ({reviews.toLocaleString("en-IN")} reviews)
                  </span>
                </div>

                <div className="course-details-students">
                  <FaUserGraduate />

                  <span>
                    {students.toLocaleString("en-IN")} students enrolled
                  </span>
                </div>
              </div>

              <div className="course-details-instructor">
                <div className="course-instructor-avatar">
                  <FaUserGraduate />
                </div>

                <div>
                  <span>Course Instructor</span>

                  <strong>
                    {course.instructor ||
                      "DVOC Faculty"}
                  </strong>
                </div>
              </div>

              <div className="course-details-price-row">
                <div className="course-details-price">
                  <strong>
                    ₹{formatPrice(price)}
                  </strong>

                  {originalPrice > price && (
                    <span>
                      ₹{formatPrice(originalPrice)}
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <span className="course-details-discount">
                    Save {discount}%
                  </span>
                )}
              </div>

              <div className="course-details-actions">
                <button
                  type="button"
                  className="course-details-cart"
                  onClick={handleAddToCart}
                >
                  {purchased ? (
                    <>
                      <FaPlayCircle />
                      Start Learning
                    </>
                  ) : inCart ? (
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

                {!purchased && (
                  <button
                    type="button"
                    className="course-details-buy"
                    onClick={handleBuyNow}
                  >
                    Enrol Now
                  </button>
                )}

                <button
                  type="button"
                  className={
                    inWishlist
                      ? "course-details-wishlist active"
                      : "course-details-wishlist"
                  }
                  onClick={handleWishlist}
                >
                  <FaHeart />

                  <span>
                    {inWishlist
                      ? "Saved"
                      : "Wishlist"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="course-details-content">
        <div className="course-details-left">
          <article className="course-details-card">
            <div className="course-section-heading">
              <span>Course Benefits</span>
              <h2>What You Will Learn</h2>
            </div>

            {course.learningOutcomes?.length > 0 ? (
              <div className="course-outcomes-grid">
                {course.learningOutcomes.map(
                  (outcome, index) => (
                    <div
                      key={`${outcome}-${index}`}
                      className="course-outcome-item"
                    >
                      <span>
                        <FaCheck />
                      </span>

                      <p>{outcome}</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="course-details-empty-text">
                Learning outcomes will be added soon.
              </p>
            )}
          </article>

          <article className="course-details-card">
            <div className="course-section-heading">
              <span>Skills Covered</span>
              <h2>Course Skills</h2>
            </div>

            {course.skills?.length > 0 ? (
              <div className="course-skills-list">
                {course.skills.map(
                  (skill, index) => (
                    <span key={`${skill}-${index}`}>
                      <FaCheck />
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="course-details-empty-text">
                Skills information will be added soon.
              </p>
            )}
          </article>

          <article className="course-details-card">
            <div className="course-section-heading">
              <span>Structured Learning</span>
              <h2>Course Curriculum</h2>
            </div>

            {course.modules?.length > 0 ? (
              <div className="course-modules-list">
                {course.modules.map(
                  (module, moduleIndex) => (
                    <details
                      key={
                        module._id ||
                        `${module.moduleTitle}-${moduleIndex}`
                      }
                      open={moduleIndex === 0}
                    >
                      <summary>
                        <div className="module-summary-left">
                          <span className="module-number">
                            {String(
                              moduleIndex + 1
                            ).padStart(2, "0")}
                          </span>

                          <div>
                            <h3>
                              {module.moduleTitle ||
                                `Module ${
                                  moduleIndex + 1
                                }`}
                            </h3>

                            <span>
                              {module.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </div>

                        <FaArrowLeft className="module-arrow" />
                      </summary>

                      <div className="module-lessons">
                        {(module.lessons || []).map(
                          (lesson, lessonIndex) => (
                            <div
                              className="module-lesson"
                              key={`${lesson}-${lessonIndex}`}
                            >
                              <div>
                                <FaPlayCircle />

                                <span>
                                  Lesson{" "}
                                  {lessonIndex + 1}
                                </span>
                              </div>

                              <p>{lesson}</p>
                            </div>
                          )
                        )}
                      </div>
                    </details>
                  )
                )}
              </div>
            ) : (
              <p className="course-details-empty-text">
                Curriculum details will be added soon.
              </p>
            )}
          </article>
        </div>

        <aside className="course-details-side">
          <div className="course-details-side-card">
            <div className="course-side-title">
              <FaGraduationCap />

              <div>
                <span>Course Access</span>
                <h3>This Course Includes</h3>
              </div>
            </div>

            <ul>
              <li>
                <FaPlayCircle />

                <span>
                  {totalLessons} structured lessons
                </span>
              </li>

              <li>
                <FaClock />

                <span>
                  {course.duration ||
                    "Self-paced learning"}
                </span>
              </li>

              <li>
                <FaBookOpen />

                <span>
                  Practical assignments and projects
                </span>
              </li>

              <li>
                <FaCertificate />

                <span>
                  {course.certificate !== false
                    ? "DVOC completion certificate"
                    : "Certificate information unavailable"}
                </span>
              </li>

              <li>
                <FaGraduationCap />

                <span>
                  Student dashboard access
                </span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleAddToCart}
            >
              {purchased
                ? "Continue Learning"
                : inCart
                ? "Go to Cart"
                : "Enrol in This Course"}
            </button>

            {!isLoggedIn && (
              <p className="course-side-login-note">
                Login is required before enrolment.
              </p>
            )}
          </div>

          <div className="course-details-support-card">
            <span>Need Guidance?</span>

            <h3>
              Speak with a DVOC course counsellor
            </h3>

            <p>
              Get help choosing the right programme for
              your career goals.
            </p>

            <Link to="/contact">
              Get Course Guidance
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CourseDetails;