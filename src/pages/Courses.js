import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaClock,
  FaGraduationCap,
  FaHeart,
  FaPlayCircle,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa";

import "../css/Courses.css";

const API_URL = "http://localhost:5000/api/courses";

function Courses({
  
  cart = [],
  setCart,
  wishlist = [],
  toggleWishlist,
  isLoggedIn = false,
  purchasedCourses = [],
}) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
 const [searchParams] = useSearchParams();

const urlCategory = searchParams.get("category");

const [category, setCategory] = useState(
  urlCategory || "All"
);

useEffect(() => {
  setCategory(urlCategory || "All");
}, [urlCategory]);
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
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
    } catch (requestError) {
      console.error("Course fetch error:", requestError);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

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

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const inCart = (courseId) =>
    cart.some(
      (course) =>
        String(getCourseId(course)) === String(courseId)
    );

  const inWishlist = (courseId) =>
    wishlist.some(
      (course) =>
        String(getCourseId(course)) === String(courseId)
    );

  const isPurchased = (courseId) =>
    purchasedCourses.some(
      (course) =>
        String(getCourseId(course)) === String(courseId)
    );

  const handleAddToCart = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const courseId = getCourseId(course);

    if (isPurchased(courseId)) {
      navigate(`/learn/${courseId}`, {
        state: { course },
      });
      return;
    }

    if (inCart(courseId)) {
      navigate("/cart");
      return;
    }

    setCart((previousCart) => [
      ...previousCart,
      {
        ...course,
        id: courseId,
        quantity: 1,
      },
    ]);
  };

  const handleWishlist = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const courseId = getCourseId(course);

    toggleWishlist({
      ...course,
      id: courseId,
      _id: courseId,
    });
  };

  const handleViewDetails = (course) => {
    const courseId = getCourseId(course);

    navigate(`/courses/${courseId}`, {
      state: { course },
    });
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  const levels = useMemo(() => {
    return [
      "All",
      ...new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    let result = courses.filter((course) => {
      const searchableText = `
        ${course.title || ""}
        ${course.shortTitle || ""}
        ${course.category || ""}
        ${course.instructor || ""}
        ${course.description || ""}
        ${(course.skills || []).join(" ")}
      `.toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableText.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        course.category === category;

      const matchesLevel =
        level === "All" ||
        course.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });

    if (sort === "price-low") {
      result = [...result].sort(
        (first, second) =>
          getPrice(first) - getPrice(second)
      );
    }

    if (sort === "price-high") {
      result = [...result].sort(
        (first, second) =>
          getPrice(second) - getPrice(first)
      );
    }

    if (sort === "rating") {
      result = [...result].sort(
        (first, second) =>
          getRating(second) - getRating(first)
      );
    }

    if (sort === "students") {
      result = [...result].sort(
        (first, second) =>
          Number(second.students || 0) -
          Number(first.students || 0)
      );
    }

    return result;
  }, [courses, search, category, level, sort]);

  return (
    <main className="courses-page">
      <section className="courses-hero">
        <div className="courses-hero-content">
          <span className="courses-hero-label">
            DVOC Online Learning
          </span>

          <h1>
            Build Career-Ready Skills with
            Practical Courses
          </h1>

          <p>
            Learn through structured lessons, practical
            projects, assessments and recognised
            certification.
          </p>

          <div className="courses-hero-highlights">
            <span>
              <FaBookOpen />
              Practical Learning
            </span>

            <span>
              <FaCertificate />
              Course Certificate
            </span>

            <span>
              <FaUserGraduate />
              Expert Faculty
            </span>
          </div>
        </div>

        <div className="courses-hero-card">
          <FaGraduationCap />

          <strong>
            {loading ? "..." : `${courses.length}+`}
          </strong>

          <span>Career-Focused Courses</span>
        </div>
      </section>

      <section className="courses-container">
        <div className="courses-heading-row">
          <div>
            <span>Explore Programmes</span>
            <h2>All Online Courses</h2>
            <p>
              Choose a programme that matches your career
              goals and learning level.
            </p>
          </div>

          <div className="courses-result-count">
            {loading
              ? "Loading courses..."
              : `${filteredCourses.length} course${
                  filteredCourses.length !== 1 ? "s" : ""
                } available`}
          </div>
        </div>

        <div className="courses-toolbar">
          <div className="courses-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search course, skill or instructor..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Categories"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) =>
              setLevel(event.target.value)
            }
          >
            {levels.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Levels"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >
            <option value="default">
              Sort: Default
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="students">
              Most Popular
            </option>
          </select>
        </div>

        {!isLoggedIn && (
          <div className="courses-login-notice">
            <FaGraduationCap />

            <span>
              You can explore all courses without logging
              in.{" "}
              <Link to="/login">
                Login
              </Link>{" "}
              when you want to enrol, save a course or
              access learning content.
            </span>
          </div>
        )}

        {loading && (
          <div className="courses-status">
            <div className="courses-spinner"></div>
            <h3>Loading DVOC Courses</h3>
            <p>Please wait while we load the course catalogue.</p>
          </div>
        )}

        {!loading && error && (
          <div className="courses-status">
            <FaBookOpen />
            <h3>Unable to Load Courses</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchCourses}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredCourses.length === 0 && (
            <div className="courses-status">
              <FaSearch />
              <h3>No Courses Found</h3>
              <p>
                Try changing the search text or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setLevel("All");
                  setSort("default");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredCourses.length > 0 && (
            <div className="courses-grid">
              {filteredCourses.map((course) => {
                const courseId = getCourseId(course);
                const image = getCourseImage(course);
                const price = getPrice(course);
                const originalPrice =
                  getOriginalPrice(course);
                const rating = Math.min(
                  5,
                  Math.max(0, getRating(course))
                );

                const discount =
                  originalPrice > price
                    ? Math.round(
                        ((originalPrice - price) /
                          originalPrice) *
                          100
                      )
                    : 0;

                const purchased =
                  isPurchased(courseId);

                const addedToCart =
                  inCart(courseId);

                const saved =
                  inWishlist(courseId);

                return (
                  <article
                    className="course-card"
                    key={courseId}
                  >
                    <div
                      className="course-card-image"
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
                        <div className="course-image-placeholder">
                          <FaBookOpen />
                        </div>
                      )}

                      {course.badge && (
                        <span className="course-card-badge">
                          {course.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        className={
                          saved
                            ? "course-heart-button active"
                            : "course-heart-button"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          handleWishlist(course);
                        }}
                        aria-label="Save course"
                      >
                        <FaHeart />
                      </button>

                      <span className="course-card-level">
                        {course.level || "All Levels"}
                      </span>
                    </div>

                    <div className="course-card-content">
                      <div className="course-card-category-row">
                        <span>
                          {course.category ||
                            "Professional Course"}
                        </span>

                        {course.certificate !== false && (
                          <span className="course-certificate-label">
                            <FaCertificate />
                            Certificate
                          </span>
                        )}
                      </div>

                      <h3>
                        {course.title ||
                          "DVOC Online Course"}
                      </h3>

                      <p className="course-card-description">
                        {course.description ||
                          "Practical, career-focused learning with structured lessons and projects."}
                      </p>

                      <div className="course-instructor">
                        <FaUserGraduate />

                        <span>
                          Instructor:{" "}
                          <strong>
                            {course.instructor ||
                              "DVOC Faculty"}
                          </strong>
                        </span>
                      </div>

                      <div className="course-rating-row">
                        <div>
                          <FaStar />

                          <strong>
                            {rating.toFixed(1)}
                          </strong>

                          <span>
                            (
                            {Number(
                              course.reviews || 0
                            ).toLocaleString("en-IN")}
                            )
                          </span>
                        </div>

                        <div>
                          <FaGraduationCap />

                          <span>
                            {Number(
                              course.students || 0
                            ).toLocaleString("en-IN")}{" "}
                            students
                          </span>
                        </div>
                      </div>

                      <div className="course-meta-row">
                        <span>
                          <FaClock />
                          {course.duration ||
                            "Self-paced"}
                        </span>

                        <span>
                          <FaPlayCircle />
                          {course.lessons || 0} lessons
                        </span>
                      </div>

                      <div className="course-price-row">
                        <div className="course-price">
                          <strong>
                            ₹{formatPrice(price)}
                          </strong>

                          {originalPrice > price && (
                            <span>
                              ₹
                              {formatPrice(
                                originalPrice
                              )}
                            </span>
                          )}
                        </div>

                        {discount > 0 && (
                          <span className="course-discount">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="course-card-actions">
                        <button
                          type="button"
                          className="course-details-button"
                          onClick={() =>
                            handleViewDetails(course)
                          }
                        >
                          View Details
                          <FaArrowRight />
                        </button>

                        <button
                          type="button"
                          className={
                            purchased ||
                            addedToCart
                              ? "course-cart-button added"
                              : "course-cart-button"
                          }
                          onClick={() =>
                            handleAddToCart(course)
                          }
                        >
                          {purchased ? (
                            <>
                              <FaPlayCircle />
                              Start Learning
                            </>
                          ) : addedToCart ? (
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
      </section>
    </main>
  );
}

export default Courses;