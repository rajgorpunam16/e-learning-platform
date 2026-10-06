import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaClock,
  FaGraduationCap,
  FaHeart,
  FaLock,
  FaPlayCircle,
  FaShoppingCart,
  FaStar,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";

import "../css/Wishlist.css";

function Wishlist({
  wishlist = [],
  toggleWishlist,
  cart = [],
  setCart,
  isLoggedIn = false,
}) {
  const navigate = useNavigate();

  const getCourseId = (course) => course?._id || course?.id;

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

  const getPrice = (course) =>
    Number(course?.price || 0);

  const getOriginalPrice = (course) =>
    Number(
      course?.originalPrice ||
        course?.original ||
        course?.price ||
        0
    );

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const inCart = (courseId) =>
    cart.some(
      (course) =>
        String(getCourseId(course)) === String(courseId)
    );

  const addToCart = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const courseId = getCourseId(course);

    if (inCart(courseId)) {
      navigate("/cart");
      return;
    }

    if (!setCart) {
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

  const removeFromWishlist = (course) => {
    if (toggleWishlist) {
      toggleWishlist(course);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-status-card">
          <div className="wishlist-status-icon">
            <FaLock />
          </div>

          <span className="wishlist-status-label">
            DVOC Student Account
          </span>

          <h1>Login to View Your Wishlist</h1>

          <p>
            Sign in to save courses, compare programmes and
            return to them later.
          </p>

          <Link
            to="/login"
            className="wishlist-primary-button"
          >
            Student Login
            <FaArrowRight />
          </Link>

          <Link
            to="/courses"
            className="wishlist-secondary-button"
          >
            Browse Courses
          </Link>
        </section>
      </main>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-empty-header">
          <span>Saved Courses</span>
          <h1>My Wishlist</h1>
          <p>
            Save courses you want to compare or purchase later.
          </p>
        </section>

        <section className="wishlist-status-card">
          <div className="wishlist-status-icon">
            <FaHeart />
          </div>

          <span className="wishlist-status-label">
            No Saved Courses
          </span>

          <h2>Your Wishlist Is Empty</h2>

          <p>
            Select the heart icon on any course to save it for
            later.
          </p>

          <Link
            to="/courses"
            className="wishlist-primary-button"
          >
            Explore Online Courses
            <FaArrowRight />
          </Link>

          <Link
            to="/cart"
            className="wishlist-secondary-button"
          >
            View Course Cart
          </Link>
        </section>
      </main>
    );
  }

  const totalValue = wishlist.reduce(
    (total, course) => total + getPrice(course),
    0
  );

  const certifiedCourses = wishlist.filter(
    (course) => course.certificate !== false
  ).length;

  const totalLessons = wishlist.reduce(
    (total, course) =>
      total + Number(course.lessons || 0),
    0
  );

  return (
    <main className="wishlist-page">
      <section className="wishlist-hero">
        <div>
          <span className="wishlist-hero-label">
            Saved Learning Programmes
          </span>

          <h1>My Wishlist</h1>

          <p>
            Review saved DVOC courses, compare learning details
            and add your selected programmes to the course cart.
          </p>
        </div>

        <div className="wishlist-hero-icon">
          <FaHeart />

          <span>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "Saved Course"
              : "Saved Courses"}
          </span>
        </div>
      </section>

      <section className="wishlist-container">
        <div className="wishlist-summary-grid">
          <article className="wishlist-summary-card">
            <div className="wishlist-summary-icon">
              <FaHeart />
            </div>

            <div>
              <strong>{wishlist.length}</strong>
              <span>Saved Courses</span>
            </div>
          </article>

          <article className="wishlist-summary-card">
            <div className="wishlist-summary-icon">
              <FaCertificate />
            </div>

            <div>
              <strong>{certifiedCourses}</strong>
              <span>Certified Courses</span>
            </div>
          </article>

          <article className="wishlist-summary-card">
            <div className="wishlist-summary-icon">
              <FaPlayCircle />
            </div>

            <div>
              <strong>{totalLessons}</strong>
              <span>Total Lessons</span>
            </div>
          </article>

          <article className="wishlist-summary-card">
            <div className="wishlist-summary-icon">
              <FaShoppingCart />
            </div>

            <div>
              <strong>₹{formatPrice(totalValue)}</strong>
              <span>Total Wishlist Value</span>
            </div>
          </article>
        </div>

        <div className="wishlist-heading-row">
          <div>
            <span>Your Saved Courses</span>

            <h2>Courses You Want to Learn</h2>

            <p>
              Move a course to your cart when you are ready to
              enrol.
            </p>
          </div>

          <Link
            to="/courses"
            className="wishlist-browse-link"
          >
            Browse More Courses
            <FaArrowRight />
          </Link>
        </div>

        <div className="wishlist-course-grid">
          {wishlist.map((course) => {
            const courseId = getCourseId(course);
            const image = getCourseImage(course);
            const price = getPrice(course);
            const originalPrice =
              getOriginalPrice(course);
            const rating = Number(course.rating || 0);
            const reviews = Number(course.reviews || 0);
            const addedToCart = inCart(courseId);

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
                className="wishlist-course-card"
                key={courseId}
              >
                <button
                  type="button"
                  className="wishlist-remove-button"
                  onClick={() =>
                    removeFromWishlist(course)
                  }
                  aria-label={`Remove ${course.title} from wishlist`}
                  title="Remove from wishlist"
                >
                  <FaTimes />
                </button>

                <div className="wishlist-course-image">
                  {image ? (
                    <img
                      src={image}
                      alt={course.title || "DVOC Course"}
                    />
                  ) : (
                    <div className="wishlist-image-placeholder">
                      <FaBookOpen />
                    </div>
                  )}

                  {course.badge && (
                    <span className="wishlist-course-badge">
                      {course.badge}
                    </span>
                  )}

                  <span className="wishlist-course-level">
                    {course.level || "All Levels"}
                  </span>
                </div>

                <div className="wishlist-course-content">
                  <div className="wishlist-course-category-row">
                    <span>
                      {course.category ||
                        "Professional Course"}
                    </span>

                    {course.certificate !== false && (
                      <span className="wishlist-certified">
                        <FaCertificate />
                        Certificate
                      </span>
                    )}
                  </div>

                  <h3>
                    {course.title || "DVOC Online Course"}
                  </h3>

                  <div className="wishlist-instructor">
                    <FaUserGraduate />

                    <span>
                      Instructor:{" "}
                      <strong>
                        {getInstructor(course)}
                      </strong>
                    </span>
                  </div>

                  <p className="wishlist-description">
                    {course.description ||
                      "Career-focused online learning with lessons, assignments and practical projects."}
                  </p>

                  <div className="wishlist-rating-row">
                    <div>
                      <FaStar />
                      <strong>{rating.toFixed(1)}</strong>
                      <span>
                        ({reviews.toLocaleString("en-IN")} reviews)
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

                  <div className="wishlist-course-meta">
                    <span>
                      <FaClock />
                      {course.duration || "Self-paced"}
                    </span>

                    <span>
                      <FaPlayCircle />
                      {course.lessons || 0} lessons
                    </span>
                  </div>

                  <div className="wishlist-price-row">
                    <div className="wishlist-price">
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
                      <span className="wishlist-discount">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="wishlist-actions">
                    <Link
                      to={`/courses/${courseId}`}
                      state={{ course }}
                      className="wishlist-details-button"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      className={
                        addedToCart
                          ? "wishlist-cart-button added"
                          : "wishlist-cart-button"
                      }
                      onClick={() => addToCart(course)}
                    >
                      {addedToCart ? (
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
      </section>
    </main>
  );
}

export default Wishlist;