import { useEffect, useMemo, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaGraduationCap,
  FaLock,
  FaPlay,
  FaPlayCircle,
  FaRedoAlt,
  FaShoppingCart,
} from "react-icons/fa";

import "../css/CourseLearning.css";

const COURSE_API =
  "http://localhost:5000/api/courses";

const CHAPTER_API =
  "http://localhost:5000/api/admin/chapters";

function CourseLearning({
  purchasedCourses = [],
  setPurchasedCourses,
  isLoggedIn = false,
  cart = [],
  setCart,
}) {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState(
    location.state?.course || null
  );

  const [chapters, setChapters] = useState([]);

  const [activeModule, setActiveModule] =
    useState(0);

  const [activeLesson, setActiveLesson] =
    useState(0);

  const [completedLessonKeys, setCompletedLessonKeys] =
    useState([]);

  const [loading, setLoading] = useState(
    !location.state?.course
  );

  const [error, setError] = useState("");

  /* =====================================
     HELPERS
  ====================================== */

  const getCourseId = (item) =>
    item?._id || item?.id;

  const courseId = getCourseId(course) || id;

  const getChapterId = (chapter) =>
    chapter?._id || chapter?.id;

  const getChapterCourseId = (chapter) => {
    if (
      chapter?.course &&
      typeof chapter.course === "object"
    ) {
      return (
        chapter.course._id ||
        chapter.course.id
      );
    }

    return (
      chapter?.course ||
      chapter?.courseId
    );
  };

  const getLessonKey = (
    moduleIndex,
    lessonIndex
  ) => {
    return `${moduleIndex}-${lessonIndex}`;
  };

  const getCourseImage = (item) =>
    item?.image ||
    item?.coverImage ||
    item?.coverUrl ||
    "";

  /* =====================================
     LOAD COURSE
  ====================================== */

  useEffect(() => {
    if (!id) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    const stateCourse =
      location.state?.course;

    const stateCourseId =
      getCourseId(stateCourse);

    if (
      stateCourse &&
      String(stateCourseId) === String(id)
    ) {
      setCourse(stateCourse);
      setLoading(false);
    } else {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${COURSE_API}/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load this course."
        );
      }

      setCourse(data.course || data);
    } catch (requestError) {
      console.error(
        "Course learning fetch error:",
        requestError
      );

      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     LOAD CHAPTERS FROM BACKEND
  ====================================== */

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchChapters();
  }, [id]);

  const fetchChapters = async () => {
    try {
      const response = await fetch(
        `${CHAPTER_API}?course=${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const chapterList = Array.isArray(data)
        ? data
        : data.chapters ||
          data.lessons ||
          [];

      const matchingChapters =
        chapterList.filter(
          (chapter) =>
            String(
              getChapterCourseId(chapter)
            ) === String(id)
        );

      setChapters(
        matchingChapters.sort(
          (first, second) =>
            Number(first.order || 0) -
            Number(second.order || 0)
        )
      );
    } catch (requestError) {
      console.error(
        "Chapter fetch error:",
        requestError
      );
    }
  };

  /* =====================================
     PURCHASED COURSE
  ====================================== */

  const purchasedCourse = useMemo(() => {
    return purchasedCourses.find(
      (item) =>
        String(getCourseId(item)) ===
        String(id)
    );
  }, [purchasedCourses, id]);

  const isPurchased = Boolean(
    purchasedCourse
  );

  useEffect(() => {
    if (
      Array.isArray(
        purchasedCourse?.completedLessons
      )
    ) {
      setCompletedLessonKeys(
        purchasedCourse.completedLessons
      );
    } else {
      setCompletedLessonKeys([]);
    }
  }, [purchasedCourse]);

  /* =====================================
     CREATE LEARNING MODULES
  ====================================== */

  const learningModules = useMemo(() => {
    /*
      Use separately managed chapters first.
      Each chapter becomes a lesson.
    */

    if (chapters.length > 0) {
      const groupedModules = {};

      chapters.forEach((chapter) => {
        const moduleTitle =
          chapter.moduleTitle ||
          "Course Lessons";

        if (!groupedModules[moduleTitle]) {
          groupedModules[moduleTitle] = [];
        }

        groupedModules[moduleTitle].push({
          id: getChapterId(chapter),

          title:
            chapter.title ||
            chapter.lessonTitle ||
            "Course Lesson",

          description:
            chapter.description || "",

          content:
            chapter.content || "",

          videoUrl:
            chapter.videoUrl || "",

          duration:
            chapter.duration || "",

          freePreview:
            chapter.freePreview || false,

          order:
            Number(chapter.order || 0),
        });
      });

      return Object.entries(
        groupedModules
      ).map(
        ([moduleTitle, lessons]) => ({
          moduleTitle,

          lessons: lessons.sort(
            (first, second) =>
              first.order - second.order
          ),
        })
      );
    }

    /*
      Fallback to modules stored inside
      the Course document.
    */

    return (course?.modules || []).map(
      (module) => ({
        moduleTitle:
          module.moduleTitle ||
          "Course Module",

        lessons: (
          module.lessons || []
        ).map(
          (lesson, lessonIndex) => {
            if (
              typeof lesson === "object"
            ) {
              return {
                id:
                  lesson._id ||
                  `${module.moduleTitle}-${lessonIndex}`,

                title:
                  lesson.title ||
                  lesson.lessonTitle ||
                  `Lesson ${
                    lessonIndex + 1
                  }`,

                description:
                  lesson.description || "",

                content:
                  lesson.content || "",

                videoUrl:
                  lesson.videoUrl || "",

                duration:
                  lesson.duration || "",

                freePreview:
                  lesson.freePreview ||
                  false,
              };
            }

            return {
              id: `${module.moduleTitle}-${lessonIndex}`,

              title: lesson,

              description: "",

              content: "",

              videoUrl: "",

              duration: "",

              freePreview:
                lessonIndex === 0,
            };
          }
        ),
      })
    );
  }, [chapters, course]);

  const currentModule =
    learningModules[activeModule];

  const currentLesson =
    currentModule?.lessons?.[
      activeLesson
    ];

  const totalLessons = useMemo(() => {
    return learningModules.reduce(
      (total, module) =>
        total +
        Number(
          module.lessons?.length || 0
        ),
      0
    );
  }, [learningModules]);

  const completedLessons =
    completedLessonKeys.length;

  const progress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round(
            (completedLessons /
              totalLessons) *
              100
          )
        )
      : 0;

  const currentLessonKey =
    getLessonKey(
      activeModule,
      activeLesson
    );

  const currentLessonCompleted =
    completedLessonKeys.includes(
      currentLessonKey
    );

  /* =====================================
     FLAT LESSON POSITION
  ====================================== */

  const flatLessons = useMemo(() => {
    const result = [];

    learningModules.forEach(
      (module, moduleIndex) => {
        module.lessons.forEach(
          (lesson, lessonIndex) => {
            result.push({
              moduleIndex,
              lessonIndex,
              module,
              lesson,
            });
          }
        );
      }
    );

    return result;
  }, [learningModules]);

  const currentFlatIndex =
    flatLessons.findIndex(
      (item) =>
        item.moduleIndex ===
          activeModule &&
        item.lessonIndex ===
          activeLesson
    );

  const hasPrevious =
    currentFlatIndex > 0;

  const hasNext =
    currentFlatIndex >= 0 &&
    currentFlatIndex <
      flatLessons.length - 1;

  /* =====================================
     SELECT LESSON
  ====================================== */

  const selectLesson = (
    moduleIndex,
    lessonIndex
  ) => {
    const lesson =
      learningModules[moduleIndex]
        ?.lessons?.[lessonIndex];

    if (!lesson) {
      return;
    }

    const canPreview =
      lesson.freePreview ||
      (moduleIndex === 0 &&
        lessonIndex === 0);

    if (
      !isPurchased &&
      !canPreview
    ) {
      return;
    }

    setActiveModule(moduleIndex);
    setActiveLesson(lessonIndex);
  };

  /* =====================================
     MARK LESSON COMPLETE
  ====================================== */

  const handleMarkComplete = () => {
    if (
      !isPurchased ||
      !currentLesson
    ) {
      return;
    }

    let updatedCompletedLessons;

    if (currentLessonCompleted) {
      updatedCompletedLessons =
        completedLessonKeys.filter(
          (lessonKey) =>
            lessonKey !==
            currentLessonKey
        );
    } else {
      updatedCompletedLessons = [
        ...completedLessonKeys,
        currentLessonKey,
      ];
    }

    setCompletedLessonKeys(
      updatedCompletedLessons
    );

    const newProgress =
      totalLessons > 0
        ? Math.round(
            (updatedCompletedLessons.length /
              totalLessons) *
              100
          )
        : 0;

    if (
      typeof setPurchasedCourses ===
      "function"
    ) {
      setPurchasedCourses(
        (previousCourses) =>
          previousCourses.map(
            (item) => {
              if (
                String(
                  getCourseId(item)
                ) !== String(id)
              ) {
                return item;
              }

              return {
                ...item,

                completedLessons:
                  updatedCompletedLessons,

                progress: newProgress,

                certificateEarned:
                  newProgress === 100,

                lastLesson: {
                  moduleIndex:
                    activeModule,

                  lessonIndex:
                    activeLesson,

                  lessonTitle:
                    currentLesson.title,

                  updatedAt:
                    new Date().toISOString(),
                },
              };
            }
          )
      );
    }
  };

  /* =====================================
     PREVIOUS / NEXT LESSON
  ====================================== */

  const goToPreviousLesson = () => {
    if (!hasPrevious) {
      return;
    }

    const previousLesson =
      flatLessons[
        currentFlatIndex - 1
      ];

    selectLesson(
      previousLesson.moduleIndex,
      previousLesson.lessonIndex
    );
  };

  const goToNextLesson = () => {
    if (!hasNext) {
      return;
    }

    const nextLesson =
      flatLessons[
        currentFlatIndex + 1
      ];

    selectLesson(
      nextLesson.moduleIndex,
      nextLesson.lessonIndex
    );
  };

  /* =====================================
     ADD TO CART
  ====================================== */

  const handleAddToCart = () => {
    if (!course) {
      return;
    }

    const selectedCourseId =
      getCourseId(course);

    const alreadyAdded = cart.some(
      (item) =>
        String(getCourseId(item)) ===
        String(selectedCourseId)
    );

    if (alreadyAdded) {
      navigate("/cart");
      return;
    }

    if (
      typeof setCart === "function"
    ) {
      setCart((previousCart) => [
        ...previousCart,

        {
          ...course,

          id: selectedCourseId,
          _id: selectedCourseId,

          quantity: 1,
        },
      ]);
    }

    navigate("/cart");
  };

  /* =====================================
     LOGIN REQUIRED
  ====================================== */

  if (!isLoggedIn) {
    return (
      <main className="learning-status-page">
        <section className="learning-status-card">
          <div className="learning-status-icon">
            <FaLock />
          </div>

          <h1>
            Student Login Required
          </h1>

          <p>
            Sign in to your DVOC
            student account to access
            course previews and enrolled
            course lessons.
          </p>

          <Link
            to="/login"
            className="learning-primary-link"
          >
            Student Login
          </Link>

          <Link
            to="/courses"
            className="learning-secondary-link"
          >
            Browse Courses
          </Link>
        </section>
      </main>
    );
  }

  /* =====================================
     LOADING
  ====================================== */

  if (loading) {
    return (
      <main className="learning-status-page">
        <section className="learning-status-card">
          <div className="learning-loader"></div>

          <h1>
            Loading Course
          </h1>

          <p>
            Please wait while the course
            learning content is loaded.
          </p>
        </section>
      </main>
    );
  }

  /* =====================================
     COURSE NOT FOUND
  ====================================== */

  if (error || !course) {
    return (
      <main className="learning-status-page">
        <section className="learning-status-card">
          <div className="learning-status-icon">
            <FaBookOpen />
          </div>

          <h1>
            Course Not Found
          </h1>

          <p>
            {error ||
              "This course is unavailable or the course link is invalid."}
          </p>

          <button
            type="button"
            className="learning-primary-link"
            onClick={fetchCourse}
          >
            <FaRedoAlt />
            Try Again
          </button>

          <Link
            to="/courses"
            className="learning-secondary-link"
          >
            Browse Courses
          </Link>
        </section>
      </main>
    );
  }

  /* =====================================
     NO LESSONS
  ====================================== */

  if (
    learningModules.length === 0 ||
    totalLessons === 0
  ) {
    return (
      <main className="learning-status-page">
        <section className="learning-status-card">
          <div className="learning-status-icon">
            <FaBookOpen />
          </div>

          <h1>
            Lessons Coming Soon
          </h1>

          <p>
            The course has been created,
            but lesson content has not yet
            been added by the administrator.
          </p>

          <Link
            to={`/courses/${courseId}`}
            state={{ course }}
            className="learning-primary-link"
          >
            View Course Details
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="learning-page">
      {/* =====================================
          TOP HEADER
      ====================================== */}

      <header className="learning-header">
        <button
          type="button"
          className="learning-back-button"
          onClick={() =>
            navigate("/my-courses")
          }
        >
          <FaArrowLeft />
          My Courses
        </button>

        <div className="learning-header-course">
          <span>
            DVOC Online Learning
          </span>

          <h1>{course.title}</h1>

          <p>
            {course.category ||
              "Professional Course"}{" "}
            ·{" "}
            {course.level ||
              "All Levels"}
          </p>
        </div>

        <div>
          {isPurchased ? (
            <span className="learning-access-badge full">
              <FaCheck />
              Full Course Access
            </span>
          ) : (
            <span className="learning-access-badge preview">
              <FaPlayCircle />
              Free Course Preview
            </span>
          )}
        </div>
      </header>

      {/* =====================================
          LEARNING LAYOUT
      ====================================== */}

      <div className="learning-layout">
        {/* =====================================
            SIDEBAR
        ====================================== */}

        <aside className="learning-sidebar">
          <div className="learning-sidebar-header">
            <span>Course Content</span>

            <h2>
              Modules & Lessons
            </h2>

            <div className="learning-sidebar-meta">
              <span>
                {learningModules.length}{" "}
                Modules
              </span>

              <span>
                {totalLessons} Lessons
              </span>
            </div>
          </div>

          {isPurchased && (
            <div className="learning-progress-box">
              <div className="learning-progress-title">
                <span>
                  Your Progress
                </span>

                <strong>
                  {progress}%
                </strong>
              </div>

              <div className="learning-progress-track">
                <div
                  className="learning-progress-value"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>

              <small className="learning-progress-count">
                {completedLessons} of{" "}
                {totalLessons} lessons
                completed
              </small>
            </div>
          )}

          <div className="learning-module-list">
            {learningModules.map(
              (
                module,
                moduleIndex
              ) => {
                const moduleIsActive =
                  activeModule ===
                  moduleIndex;

                return (
                  <div
                    className="learning-module"
                    key={`${module.moduleTitle}-${moduleIndex}`}
                  >
                    <button
                      type="button"
                      className={
                        moduleIsActive
                          ? "learning-module-button active"
                          : "learning-module-button"
                      }
                      onClick={() => {
                        setActiveModule(
                          moduleIndex
                        );

                        setActiveLesson(0);
                      }}
                    >
                      <span className="learning-module-number">
                        {String(
                          moduleIndex + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="learning-module-name">
                        {
                          module.moduleTitle
                        }
                      </span>

                      {moduleIsActive ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </button>

                    {moduleIsActive && (
                      <div className="learning-lessons">
                        {module.lessons.map(
                          (
                            lesson,
                            lessonIndex
                          ) => {
                            const lessonIsActive =
                              activeLesson ===
                              lessonIndex;

                            const lessonKey =
                              getLessonKey(
                                moduleIndex,
                                lessonIndex
                              );

                            const lessonCompleted =
                              completedLessonKeys.includes(
                                lessonKey
                              );

                            const lessonUnlocked =
                              isPurchased ||
                              lesson.freePreview ||
                              (moduleIndex ===
                                0 &&
                                lessonIndex ===
                                  0);

                            return (
                              <button
                                type="button"
                                key={
                                  lesson.id ||
                                  `${lesson.title}-${lessonIndex}`
                                }
                                className={[
                                  "learning-lesson",

                                  lessonIsActive
                                    ? "active"
                                    : "",

                                  lessonCompleted
                                    ? "completed"
                                    : "",

                                  !lessonUnlocked
                                    ? "locked"
                                    : "",
                                ]
                                  .filter(
                                    Boolean
                                  )
                                  .join(" ")}
                                onClick={() =>
                                  selectLesson(
                                    moduleIndex,
                                    lessonIndex
                                  )
                                }
                              >
                                <span className="learning-lesson-icon">
                                  {!lessonUnlocked ? (
                                    <FaLock />
                                  ) : lessonCompleted ? (
                                    <FaCheckCircle />
                                  ) : lessonIsActive ? (
                                    <FaPlay />
                                  ) : (
                                    <FaPlayCircle />
                                  )}
                                </span>

                                <span className="learning-lesson-info">
                                  <strong>
                                    {
                                      lesson.title
                                    }
                                  </strong>

                                  <small>
                                    Lesson{" "}
                                    {lessonIndex +
                                      1}

                                    {lesson.duration
                                      ? ` · ${lesson.duration}`
                                      : ""}
                                  </small>
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </aside>

        {/* =====================================
            MAIN LESSON AREA
        ====================================== */}

        <section className="learning-main">
          <div className="learning-video-container">
            {currentLesson?.videoUrl ? (
              <video
                controls
                className="learning-video-player"
                key={
                  currentLesson.videoUrl
                }
              >
                <source
                  src={
                    currentLesson.videoUrl
                  }
                />

                Your browser does not
                support video playback.
              </video>
            ) : (
              <div
                className={
                  isPurchased
                    ? "learning-video-placeholder"
                    : "learning-video-placeholder preview"
                }
              >
                <div className="learning-play-button">
                  <FaPlay />
                </div>

                <span>
                  {isPurchased
                    ? "DVOC Course Lesson"
                    : "Free Preview Lesson"}
                </span>

                <h2>
                  {currentLesson?.title ||
                    `Introduction to ${course.title}`}
                </h2>

                <p>
                  {isPurchased
                    ? "The lesson video will be displayed here when it is added by the administrator."
                    : "Preview this lesson before enrolling in the complete course."}
                </p>
              </div>
            )}
          </div>

          {/* =====================================
              LESSON INFORMATION
          ====================================== */}

          <div className="learning-content-card">
            <div className="learning-content-heading">
              <div>
                <span>
                  {currentModule?.moduleTitle ||
                    "Course Lesson"}
                </span>

                <h2>
                  {currentLesson?.title ||
                    "Introduction"}
                </h2>
              </div>

              {isPurchased && (
                <button
                  type="button"
                  className={
                    currentLessonCompleted
                      ? "learning-complete-button completed"
                      : "learning-complete-button"
                  }
                  onClick={
                    handleMarkComplete
                  }
                >
                  {currentLessonCompleted ? (
                    <>
                      <FaCheckCircle />
                      Completed
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="learning-lesson-description">
              <h3>
                About This Lesson
              </h3>

              <p>
                {currentLesson?.description ||
                  `In this lesson, you will study ${
                    currentLesson?.title ||
                    "the selected topic"
                  }. The lesson combines clear concepts, practical examples and career-focused learning.`}
              </p>

              {currentLesson?.content && (
                <div className="learning-written-content">
                  <h3>
                    Lesson Notes
                  </h3>

                  <p>
                    {
                      currentLesson.content
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="learning-course-meta">
              <div>
                <FaClock />

                <span>
                  <small>
                    Course Duration
                  </small>

                  {course.duration ||
                    "Self-paced"}
                </span>
              </div>

              <div>
                <FaPlayCircle />

                <span>
                  <small>
                    Total Lessons
                  </small>

                  {totalLessons} Lessons
                </span>
              </div>

              <div>
                <FaGraduationCap />

                <span>
                  <small>
                    Course Level
                  </small>

                  {course.level ||
                    "All Levels"}
                </span>
              </div>

              <div>
                <FaCertificate />

                <span>
                  <small>
                    Certification
                  </small>

                  {course.certificate !==
                  false
                    ? "DVOC Certificate"
                    : "Not Included"}
                </span>
              </div>
            </div>

            {isPurchased && (
              <div className="learning-navigation-buttons">
                <button
                  type="button"
                  onClick={
                    goToPreviousLesson
                  }
                  disabled={!hasPrevious}
                >
                  <FaArrowLeft />
                  Previous Lesson
                </button>

                <button
                  type="button"
                  onClick={
                    goToNextLesson
                  }
                  disabled={!hasNext}
                >
                  Next Lesson
                  <FaArrowRight />
                </button>
              </div>
            )}
          </div>

          {/* =====================================
              COURSE COMPLETION
          ====================================== */}

          {isPurchased &&
            progress === 100 && (
              <section className="learning-completion-card">
                <div>
                  <FaCertificate />
                </div>

                <span>
                  Course Completed
                </span>

                <h2>
                  Congratulations!
                </h2>

                <p>
                  You have completed every
                  lesson in this course. Your
                  DVOC certificate is now
                  available.
                </p>

                <Link to="/certificates">
                  View Certificate
                </Link>
              </section>
            )}

          {/* =====================================
              ENROLMENT SECTION
          ====================================== */}

          {!isPurchased && (
            <section className="learning-enrol-card">
              <div className="learning-enrol-icon">
                <FaLock />
              </div>

              <div className="learning-enrol-content">
                <span>
                  Preview Complete
                </span>

                <h2>
                  Continue Learning with
                  Full Course Access
                </h2>

                <p>
                  Enrol in this course to
                  unlock all modules,
                  lessons, resources,
                  projects and
                  certification.
                </p>

                <div className="learning-enrol-features">
                  <span>
                    <FaCheck />
                    All course modules
                  </span>

                  <span>
                    <FaCheck />
                    {totalLessons} lessons
                  </span>

                  <span>
                    <FaCheck />
                    Practical projects
                  </span>

                  <span>
                    <FaCheck />
                    Course certificate
                  </span>
                </div>
              </div>

              <div className="learning-enrol-price">
                {Number(
                  course.originalPrice ||
                    0
                ) >
                  Number(
                    course.price || 0
                  ) && (
                  <span>
                    ₹
                    {Number(
                      course.originalPrice
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                )}

                <strong>
                  ₹
                  {Number(
                    course.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                >
                  <FaShoppingCart />
                  Enrol Now
                </button>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

export default CourseLearning;