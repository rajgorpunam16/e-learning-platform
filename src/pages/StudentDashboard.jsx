import { useMemo } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaHeart,
  FaHistory,
  FaLock,
  FaPlay,
  FaPlayCircle,
  FaShoppingCart,
  FaTasks,
  FaUserGraduate,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "../css/StudentDashboard.css";

function StudentDashboard({
  purchasedCourses = [],
  wishlist = [],
  cart = [],
  isLoggedIn = false,
}) {
  /* =====================================
     USER
  ====================================== */

  const currentUser = useMemo(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        "Unable to read student data:",
        error
      );

      return null;
    }
  }, []);

  const studentName =
    currentUser?.name ||
    currentUser?.fullName ||
    "Student";

  const firstName =
    studentName.trim().split(" ")[0] ||
    "Student";

  /* =====================================
     HELPERS
  ====================================== */

  const getCourseId = (course) =>
    course?._id || course?.id;

  const getCourseImage = (course) => {
    if (course?.coverImage) {
      return course.coverImage;
    }

    if (course?.coverUrl) {
      return course.coverUrl;
    }

    if (course?.image) {
      if (
        course.image.startsWith("http") ||
        course.image.startsWith("/")
      ) {
        return course.image;
      }

      return `${API_BASE_URL}/${course.image}`;
    }

    return "";
  };

  const getProgress = (course) => {
    const progress = Number(
      course?.progress || 0
    );

    return Math.min(
      100,
      Math.max(0, progress)
    );
  };

  const getCompletedLessonCount = (
    course
  ) => {
    if (
      Array.isArray(
        course?.completedLessons
      )
    ) {
      return course.completedLessons.length;
    }

    return 0;
  };

  const getTotalLessons = (course) => {
    const directLessons = Number(
      course?.lessons || 0
    );

    if (directLessons > 0) {
      return directLessons;
    }

    if (Array.isArray(course?.modules)) {
      return course.modules.reduce(
        (total, module) =>
          total +
          Number(
            module?.lessons?.length || 0
          ),
        0
      );
    }

    return 0;
  };

  const getActivityDate = (course) => {
    const dateValue =
      course?.lastLesson?.updatedAt ||
      course?.paymentDetails?.paidAt ||
      course?.purchasedAt;

    if (!dateValue) {
      return 0;
    }

    const parsedDate = new Date(dateValue);

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? 0
      : parsedDate.getTime();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Recently enrolled";
    }

    const parsedDate = new Date(dateValue);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Recently enrolled";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================
     DASHBOARD STATISTICS
  ====================================== */

  const averageProgress =
    purchasedCourses.length > 0
      ? Math.round(
          purchasedCourses.reduce(
            (total, course) =>
              total +
              getProgress(course),
            0
          ) /
            purchasedCourses.length
        )
      : 0;

  const completedCourses =
    purchasedCourses.filter(
      (course) =>
        getProgress(course) === 100 ||
        course?.certificateEarned === true
    ).length;

  const coursesInProgress =
    purchasedCourses.filter((course) => {
      const progress =
        getProgress(course);

      return (
        progress > 0 &&
        progress < 100
      );
    }).length;

  const totalCompletedLessons =
    purchasedCourses.reduce(
      (total, course) =>
        total +
        getCompletedLessonCount(course),
      0
    );

  const certificateCount =
    purchasedCourses.filter(
      (course) =>
        course?.certificateEarned === true ||
        getProgress(course) === 100
    ).length;

  const recentCourses = [
    ...purchasedCourses,
  ]
    .sort(
      (first, second) =>
        getActivityDate(second) -
        getActivityDate(first)
    )
    .slice(0, 3);

  /* =====================================
     LOGIN REQUIRED
  ====================================== */

  if (!isLoggedIn) {
    return (
      <main className="student-dashboard-status">
        <div className="dashboard-status-icon">
          <FaLock />
        </div>

        <span>
          DVOC Student Account
        </span>

        <h1>Login Required</h1>

        <p>
          Sign in to access your courses,
          progress, certificates and student
          learning dashboard.
        </p>

        <Link to="/login">
          Student Login
          <FaArrowRight />
        </Link>

        <Link
          to="/courses"
          className="dashboard-status-secondary"
        >
          Browse Courses
        </Link>
      </main>
    );
  }

  return (
    <main className="student-dashboard-page">
      {/* =====================================
          HERO
      ====================================== */}

      <section className="student-dashboard-hero">
        <div className="student-dashboard-hero-content">
          <span>
            DVOC Student Dashboard
          </span>

          <h1>
            Welcome Back, {firstName}
          </h1>

          <p>
            Continue your courses, complete
            lessons, track progress and manage
            your DVOC learning account.
          </p>

          <div className="dashboard-hero-meta">
            <div>
              <FaGraduationCap />

              <strong>
                {purchasedCourses.length}
              </strong>

              <small>
                Enrolled Courses
              </small>
            </div>

            <div>
              <FaTasks />

              <strong>
                {totalCompletedLessons}
              </strong>

              <small>
                Lessons Completed
              </small>
            </div>

            <div>
              <FaCertificate />

              <strong>
                {certificateCount}
              </strong>

              <small>
                Certificates Earned
              </small>
            </div>
          </div>
        </div>

        <div className="student-dashboard-hero-actions">
          <Link to="/courses">
            Explore More Courses
            <FaArrowRight />
          </Link>

          <Link
            to="/my-courses"
            className="dashboard-secondary-hero-button"
          >
            My Courses
          </Link>
        </div>
      </section>

      <section className="student-dashboard-container">
        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="student-dashboard-stats">
          <article>
            <FaBookOpen />

            <div>
              <strong>
                {purchasedCourses.length}
              </strong>

              <span>
                Enrolled Courses
              </span>
            </div>
          </article>

          <article>
            <FaPlayCircle />

            <div>
              <strong>
                {coursesInProgress}
              </strong>

              <span>
                Courses in Progress
              </span>
            </div>
          </article>

          <article>
            <FaCertificate />

            <div>
              <strong>
                {completedCourses}
              </strong>

              <span>
                Completed Courses
              </span>
            </div>
          </article>

          <article>
            <FaHeart />

            <div>
              <strong>
                {wishlist.length}
              </strong>

              <span>
                Wishlist Courses
              </span>
            </div>
          </article>
        </div>

        <div className="student-dashboard-layout">
          {/* =====================================
              RECENT COURSES
          ====================================== */}

          <section className="student-dashboard-main">
            <div className="student-dashboard-heading">
              <div>
                <span>
                  Continue Learning
                </span>

                <h2>
                  Your Recent Courses
                </h2>
              </div>

              <Link to="/my-courses">
                View All
                <FaArrowRight />
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <div className="student-dashboard-empty">
                <FaBookOpen />

                <h3>
                  No Courses Enrolled Yet
                </h3>

                <p>
                  Enrol in a DVOC course to
                  begin learning and tracking
                  your progress.
                </p>

                <Link to="/courses">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="student-dashboard-courses">
                {recentCourses.map(
                  (course) => {
                    const courseId =
                      getCourseId(course);

                    const image =
                      getCourseImage(course);

                    const progress =
                      getProgress(course);

                    const completedLessons =
                      getCompletedLessonCount(
                        course
                      );

                    const totalLessons =
                      getTotalLessons(course);

                    const completed =
                      progress === 100 ||
                      course
                        ?.certificateEarned ===
                        true;

                    return (
                      <article
                        className={
                          completed
                            ? "dashboard-course-card completed"
                            : "dashboard-course-card"
                        }
                        key={courseId}
                      >
                        <div className="dashboard-course-image">
                          {image ? (
                            <img
                              src={image}
                              alt={
                                course.title ||
                                "DVOC Course"
                              }
                            />
                          ) : (
                            <div className="dashboard-course-placeholder">
                              <FaBookOpen />
                            </div>
                          )}

                          <span className="dashboard-course-level">
                            {course.level ||
                              "All Levels"}
                          </span>

                          {completed && (
                            <span className="dashboard-completed-badge">
                              <FaCheckCircle />
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="dashboard-course-content">
                          <span className="dashboard-course-category">
                            {course.category ||
                              "Professional Course"}
                          </span>

                          <h3>
                            {course.title ||
                              "DVOC Online Course"}
                          </h3>

                          <div className="dashboard-course-meta">
                            <span>
                              <FaClock />

                              {course.duration ||
                                "Self-paced"}
                            </span>

                            <span>
                              <FaPlayCircle />

                              {totalLessons} lessons
                            </span>
                          </div>

                          <div className="dashboard-course-lesson-status">
                            <span>
                              <FaCheckCircle />

                              {completedLessons} of{" "}
                              {totalLessons} lessons
                            </span>

                            <small>
                              Enrolled{" "}
                              {formatDate(
                                course.purchasedAt
                              )}
                            </small>
                          </div>

                          <div className="dashboard-progress-heading">
                            <span>
                              Course Progress
                            </span>

                            <strong>
                              {progress}%
                            </strong>
                          </div>

                          <div className="dashboard-progress-track">
                            <div
                              style={{
                                width: `${progress}%`,
                              }}
                            ></div>
                          </div>

                          <div className="dashboard-course-actions">
                            <Link
                              to={`/learn/${courseId}`}
                              state={{ course }}
                            >
                              {completed ? (
                                <>
                                  <FaBookOpen />
                                  Review Course
                                </>
                              ) : progress > 0 ? (
                                <>
                                  <FaPlay />
                                  Continue Learning
                                </>
                              ) : (
                                <>
                                  <FaPlayCircle />
                                  Start Course
                                </>
                              )}

                              <FaArrowRight />
                            </Link>

                            {completed && (
                              <Link
                                to="/certificates"
                                className="dashboard-certificate-link"
                              >
                                <FaCertificate />
                                Certificate
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* =====================================
              SIDEBAR
          ====================================== */}

          <aside className="student-dashboard-side">
            <div className="dashboard-quick-links">
              <div className="dashboard-side-heading">
                <span>
                  Student Navigation
                </span>

                <h3>Quick Actions</h3>
              </div>

              <Link to="/my-courses">
                <FaBookOpen />

                <span>My Courses</span>

                <strong>
                  {purchasedCourses.length}
                </strong>
              </Link>

              <Link to="/wishlist">
                <FaHeart />

                <span>Wishlist</span>

                <strong>
                  {wishlist.length}
                </strong>
              </Link>

              <Link to="/cart">
                <FaShoppingCart />

                <span>Course Cart</span>

                <strong>
                  {cart.length}
                </strong>
              </Link>

              <Link to="/certificates">
                <FaCertificate />

                <span>Certificates</span>

                <strong>
                  {certificateCount}
                </strong>
              </Link>

              <Link to="/purchase-history">
                <FaHistory />

                <span>
                  Purchase History
                </span>

                <FaArrowRight />
              </Link>
            </div>

            <div className="dashboard-progress-summary">
              <span className="dashboard-summary-label">
                Learning Performance
              </span>

              <h3>
                Overall Progress
              </h3>

              <div
                className="dashboard-progress-circle"
                style={{
                  background: `conic-gradient(
                    #f58220 ${averageProgress}%,
                    #fff3e7 ${averageProgress}% 100%
                  )`,
                }}
              >
                <div>
                  <strong>
                    {averageProgress}%
                  </strong>

                  <span>
                    Average Progress
                  </span>
                </div>
              </div>

              <p>
                {averageProgress === 100
                  ? "Excellent work. You have completed all your enrolled courses."
                  : averageProgress > 0
                  ? "Keep completing lessons to increase your overall learning progress."
                  : "Start your first course to begin tracking your learning progress."}
              </p>

              <Link to="/my-courses">
                Continue Learning
                <FaArrowRight />
              </Link>
            </div>

            <div className="dashboard-profile-card">
              <div>
                <FaUserGraduate />
              </div>

              <span>
                Student Account
              </span>

              <h3>{studentName}</h3>

              <p>
                Manage your profile and student
                account details.
              </p>

              <Link to="/profile">
                View Profile
                <FaArrowRight />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default StudentDashboard;