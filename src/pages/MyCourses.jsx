import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLock,
  FaPlay,
  FaPlayCircle,
  FaStar,
  FaTasks,
} from "react-icons/fa";

import "../css/MyCourses.css";

function MyCourses({
  purchasedCourses = [],
  isLoggedIn = false,
}) {
  /* =====================================
     HELPERS
  ====================================== */

  const courses = purchasedCourses;

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

  const getInstructor = (course) =>
    course?.instructor ||
    course?.author ||
    "DVOC Faculty";

  const getProgress = (course) => {
    const progress = Number(
      course?.progress || 0
    );

    return Math.min(
      100,
      Math.max(0, progress)
    );
  };

  const getCompletedLessons = (course) => {
    if (
      Array.isArray(course?.completedLessons)
    ) {
      return course.completedLessons.length;
    }

    return 0;
  };

  const getTotalLessons = (course) => {
    if (
      Number(course?.lessons || 0) > 0
    ) {
      return Number(course.lessons);
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

  const formatPurchaseDate = (date) => {
    if (!date) {
      return "Recently enrolled";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
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
     LOGIN REQUIRED
  ====================================== */

  if (!isLoggedIn) {
    return (
      <main className="library-page">
        <section className="library-status-card">
          <div className="library-status-icon">
            <FaLock />
          </div>

          <span className="library-status-label">
            DVOC Student Account
          </span>

          <h1>
            Login to Access Your Courses
          </h1>

          <p>
            Sign in to your DVOC student
            account to access enrolled
            courses, lessons, learning
            resources, progress and
            certificates.
          </p>

          <Link
            to="/login"
            className="library-primary-button"
          >
            Student Login

            <FaArrowRight />
          </Link>

          <Link
            to="/courses"
            className="library-secondary-button"
          >
            Browse Courses
          </Link>
        </section>
      </main>
    );
  }

  /* =====================================
     EMPTY COURSES
  ====================================== */

  if (courses.length === 0) {
    return (
      <main className="library-page">
        <section className="library-empty-header">
          <span>
            Student Learning Dashboard
          </span>

          <h1>My Courses</h1>

          <p>
            Access all your enrolled DVOC
            courses from one place.
          </p>
        </section>

        <section className="library-status-card">
          <div className="library-status-icon">
            <FaBookOpen />
          </div>

          <span className="library-status-label">
            No Enrolled Courses
          </span>

          <h2>
            Your Learning Dashboard Is Empty
          </h2>

          <p>
            Explore the DVOC course catalogue
            and enrol in a career-focused
            programme to begin your learning
            journey.
          </p>

          <Link
            to="/courses"
            className="library-primary-button"
          >
            Explore Online Courses

            <FaArrowRight />
          </Link>

          <Link
            to="/wishlist"
            className="library-secondary-button"
          >
            View Wishlist
          </Link>
        </section>
      </main>
    );
  }

  /* =====================================
     COURSE STATISTICS
  ====================================== */

  const completedCourses = courses.filter(
    (course) =>
      getProgress(course) === 100 ||
      course.certificateEarned === true
  ).length;

  const coursesInProgress = courses.filter(
    (course) => {
      const progress = getProgress(course);

      return progress > 0 && progress < 100;
    }
  ).length;

  const notStartedCourses = courses.filter(
    (course) =>
      getProgress(course) === 0
  ).length;

  const totalCompletedLessons =
    courses.reduce(
      (total, course) =>
        total +
        getCompletedLessons(course),
      0
    );

  return (
    <main className="library-page">
      {/* =====================================
          HERO
      ====================================== */}

      <section className="library-hero">
        <div>
          <span className="library-hero-label">
            DVOC Learning Dashboard
          </span>

          <h1>My Courses</h1>

          <p>
            Continue learning, track lesson
            progress and access all your
            enrolled DVOC courses from one
            student dashboard.
          </p>
        </div>

        <div className="library-hero-icon">
          <FaGraduationCap />

          <span>
            {courses.length}{" "}
            {courses.length === 1
              ? "Enrolled Course"
              : "Enrolled Courses"}
          </span>
        </div>
      </section>

      <section className="library-container">
        {/* =====================================
            SUMMARY CARDS
        ====================================== */}

        <div className="library-summary-grid">
          <article className="library-summary-card">
            <div className="library-summary-icon">
              <FaBookOpen />
            </div>

            <div>
              <strong>
                {courses.length}
              </strong>

              <span>Total Courses</span>
            </div>
          </article>

          <article className="library-summary-card">
            <div className="library-summary-icon">
              <FaPlayCircle />
            </div>

            <div>
              <strong>
                {coursesInProgress}
              </strong>

              <span>In Progress</span>
            </div>
          </article>

          <article className="library-summary-card">
            <div className="library-summary-icon">
              <FaCertificate />
            </div>

            <div>
              <strong>
                {completedCourses}
              </strong>

              <span>Completed</span>
            </div>
          </article>

          <article className="library-summary-card">
            <div className="library-summary-icon">
              <FaTasks />
            </div>

            <div>
              <strong>
                {totalCompletedLessons}
              </strong>

              <span>Lessons Completed</span>
            </div>
          </article>
        </div>

        {/* =====================================
            COURSE HEADING
        ====================================== */}

        <div className="library-heading-row">
          <div>
            <span>Your Learning</span>

            <h2>
              Continue Your Courses
            </h2>

            <p>
              Open a course to continue from
              your lessons and track your
              learning progress.
            </p>
          </div>

          <Link
            to="/courses"
            className="library-browse-link"
          >
            Browse More Courses

            <FaArrowRight />
          </Link>
        </div>

        {/* =====================================
            COURSE GRID
        ====================================== */}

        <div className="library-course-grid">
          {courses.map((course) => {
            const courseId =
              getCourseId(course);

            const image =
              getCourseImage(course);

            const progress =
              getProgress(course);

            const rating = Number(
              course.rating || 0
            );

            const completedLessons =
              getCompletedLessons(course);

            const totalLessons =
              getTotalLessons(course);

            const certificateEarned =
              course.certificateEarned ===
                true || progress === 100;

            const progressStatus =
              progress === 100
                ? "Course Completed"
                : progress > 0
                ? "Learning In Progress"
                : "Course Not Started";

            return (
              <article
                className="library-course-card"
                key={courseId}
              >
                {/* IMAGE */}

                <div className="library-course-image">
                  {image ? (
                    <img
                      src={image}
                      alt={
                        course.title ||
                        "DVOC Course"
                      }
                    />
                  ) : (
                    <div className="library-image-placeholder">
                      <FaBookOpen />
                    </div>
                  )}

                  <span className="library-owned-badge">
                    Enrolled
                  </span>

                  <span className="library-course-level">
                    {course.level ||
                      "All Levels"}
                  </span>

                  {certificateEarned && (
                    <span className="library-completed-badge">
                      <FaCheckCircle />
                      Completed
                    </span>
                  )}
                </div>

                {/* COURSE CONTENT */}

                <div className="library-course-content">
                  <div className="library-course-category-row">
                    <span>
                      {course.category ||
                        "Professional Course"}
                    </span>

                    {course.certificate !==
                      false && (
                      <span className="library-certificate-label">
                        <FaCertificate />

                        {certificateEarned
                          ? "Earned"
                          : "Certificate"}
                      </span>
                    )}
                  </div>

                  <h3>
                    {course.title ||
                      "DVOC Online Course"}
                  </h3>

                  <div className="library-instructor">
                    <FaGraduationCap />

                    <span>
                      Instructor:{" "}

                      <strong>
                        {getInstructor(course)}
                      </strong>
                    </span>
                  </div>

                  <p className="library-course-description">
                    {course.description ||
                      "Career-focused online learning with structured lessons, practical projects and industry-aligned course content."}
                  </p>

                  {/* META */}

                  <div className="library-course-meta">
                    <span>
                      <FaClock />

                      {course.duration ||
                        "Self-paced"}
                    </span>

                    <span>
                      <FaPlayCircle />

                      {totalLessons} lessons
                    </span>

                    {rating > 0 && (
                      <span>
                        <FaStar />

                        {rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* ENROLMENT */}

                  <div className="library-enrolment-date">
                    Enrolled:{" "}

                    <strong>
                      {formatPurchaseDate(
                        course.purchasedAt
                      )}
                    </strong>
                  </div>

                  {/* LESSON PROGRESS */}

                  <div className="library-progress-section">
                    <div className="library-progress-heading">
                      <span>
                        Course Progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>
                    </div>

                    <div className="library-progress-track">
                      <div
                        className="library-progress-value"
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>
                    </div>

                    <div className="library-lesson-progress">
                      <span>
                        <FaCheckCircle />

                        {completedLessons} of{" "}
                        {totalLessons} lessons
                        completed
                      </span>

                      <strong>
                        {progressStatus}
                      </strong>
                    </div>
                  </div>

                  {/* COURSE BUTTON */}

                  <Link
                    to={`/learn/${courseId}`}
                    state={{ course }}
                    className={
                      certificateEarned
                        ? "library-learn-button completed"
                        : "library-learn-button"
                    }
                  >
                    {certificateEarned ? (
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

                  {/* CERTIFICATE */}

                  {certificateEarned && (
                    <Link
                      to="/certificates"
                      className="library-view-certificate"
                    >
                      <FaCertificate />

                      View Course Certificate
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================
            NOT STARTED NOTICE
        ====================================== */}

        {notStartedCourses > 0 && (
          <section className="library-learning-notice">
            <div>
              <FaPlayCircle />
            </div>

            <div>
              <span>
                Continue Your Learning Journey
              </span>

              <h3>
                {notStartedCourses}{" "}
                {notStartedCourses === 1
                  ? "Course Is"
                  : "Courses Are"}{" "}
                Waiting for You
              </h3>

              <p>
                Start your enrolled courses
                and complete lessons to track
                progress and unlock DVOC
                certificates.
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default MyCourses;