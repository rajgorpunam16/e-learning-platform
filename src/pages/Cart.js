import API_BASE_URL from "../config";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLock,
  FaPlayCircle,
  FaShoppingCart,
  FaTag,
  FaTimes,
  FaTrashAlt,
  FaUserGraduate,
} from "react-icons/fa";

import { DISCOUNT_CODES } from "../data/courses";
import "../css/Cart.css";

function Cart({
  cart = [],
  setCart,
  orderCount = 0,
  isLoggedIn = false,
}) {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");

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

  const getCategory = (course) =>
    course?.category || course?.genre || "Professional Course";

  const getInstructor = (course) =>
    course?.instructor || course?.author || "DVOC Faculty";

  const getPrice = (course) => Number(course?.price || 0);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const removeFromCart = (courseId) => {
    if (!setCart) {
      return;
    }

    setCart((previousCart) =>
      previousCart.filter(
        (course) =>
          String(getCourseId(course)) !== String(courseId)
      )
    );
  };

  const clearCart = () => {
    if (setCart) {
      setCart([]);
    }

    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const applyDiscount = () => {
    setDiscountError("");

    const code = discountCode.trim().toUpperCase();
    const percentage = DISCOUNT_CODES[code];

    if (!code) {
      setDiscountError("Please enter a discount code.");
      setAppliedDiscount(null);
      return;
    }

    if (!percentage) {
      setDiscountError(
        "Invalid code. Try DVOC10, LEARN15, SKILL20 or FIRSTCOURSE."
      );
      setAppliedDiscount(null);
      return;
    }

    if (code === "FIRSTCOURSE" && orderCount > 0) {
      setDiscountError(
        "FIRSTCOURSE is only available on your first course purchase."
      );
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount({
      code,
      pct: percentage,
    });
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const subtotal = cart.reduce(
    (total, course) => total + getPrice(course),
    0
  );

  const discountAmount = appliedDiscount
    ? (subtotal * appliedDiscount.pct) / 100
    : 0;

  const taxableAmount = Math.max(
    subtotal - discountAmount,
    0
  );

  const gst = taxableAmount * 0.18;
  const total = taxableAmount + gst;

  if (!isLoggedIn) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <div className="empty-icon">
            <FaLock />
          </div>

          <h1>Student Login Required</h1>

          <p>
            Sign in to view your course cart and continue with
            enrolment.
          </p>

          <Link to="/login" className="cart-primary-link">
            Student Login
            <FaArrowRight />
          </Link>

          <Link to="/courses" className="cart-secondary-link">
            Browse Courses
          </Link>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <div className="empty-icon">
            <FaShoppingCart />
          </div>

          <h1>Your Course Cart Is Empty</h1>

          <p>
            Explore DVOC courses and add a suitable programme to
            begin your learning journey.
          </p>

          <Link to="/courses" className="cart-primary-link">
            Browse Online Courses
            <FaArrowRight />
          </Link>

          <Link to="/wishlist" className="cart-secondary-link">
            View Wishlist
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div>
          <span className="cart-page-label">
            DVOC Course Enrolment
          </span>

          <h1>Your Course Cart</h1>

          <p>
            Review your selected courses before completing payment
            and unlocking your learning content.
          </p>
        </div>

        <div className="cart-hero-icon">
          <FaShoppingCart />

          <span>
            {cart.length}{" "}
            {cart.length === 1 ? "Course" : "Courses"}
          </span>
        </div>
      </section>

      <section className="cart-container">
        <div className="cart-title-row">
          <div>
            <span>Selected Courses</span>

            <h2>
              {cart.length}{" "}
              {cart.length === 1
                ? "course ready"
                : "courses ready"}{" "}
              for enrolment
            </h2>
          </div>

          <div className="cart-title-actions">
            <Link to="/courses" className="continue-link">
              <FaArrowLeft />
              Continue Browsing
            </Link>

            <button
              type="button"
              className="clear-cart-button"
              onClick={clearCart}
            >
              <FaTrashAlt />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((course) => {
              const courseId = getCourseId(course);
              const image = getCourseImage(course);
              const price = getPrice(course);

              return (
                <article
                  className="cart-item"
                  key={courseId}
                >
                  <button
                    type="button"
                    className="cart-remove-icon"
                    onClick={() => removeFromCart(courseId)}
                    aria-label={`Remove ${course.title} from cart`}
                    title="Remove course"
                  >
                    <FaTimes />
                  </button>

                  <div className="cart-item-cover">
                    {image ? (
                      <img
                        src={image}
                        alt={course.title || "Course"}
                      />
                    ) : (
                      <FaBookOpen />
                    )}

                    {course.badge && (
                      <span className="cart-course-badge">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-course-topline">
                      <span className="cart-item-genre">
                        {getCategory(course)}
                      </span>

                      {course.certificate !== false && (
                        <span className="cart-certified-label">
                          <FaCertificate />
                          Certificate Included
                        </span>
                      )}
                    </div>

                    <h3>{course.title || "DVOC Course"}</h3>

                    <div className="cart-course-instructor">
                      <FaUserGraduate />

                      <span>
                        Instructor:{" "}
                        <strong>
                          {getInstructor(course)}
                        </strong>
                      </span>
                    </div>

                    <p className="cart-course-description">
                      {course.description ||
                        "Career-focused online training with lessons, assignments and practical learning."}
                    </p>

                    <div className="cart-course-meta">
                      <span>
                        <FaClock />
                        {course.duration || "Self-paced"}
                      </span>

                      <span>
                        <FaPlayCircle />
                        {course.lessons || 0} lessons
                      </span>

                      <span>
                        <FaGraduationCap />
                        {course.level || "All Levels"}
                      </span>
                    </div>

                    <div className="cart-access-note">
                      <FaCheckCircle />

                      <span>
                        Instant access after successful payment
                      </span>
                    </div>
                  </div>

                  <div className="cart-item-price-area">
                    {Number(course.originalPrice || 0) >
                      price && (
                      <span className="cart-original-price">
                        ₹
                        {formatPrice(
                          course.originalPrice
                        )}
                      </span>
                    )}

                    <strong className="cart-item-price">
                      ₹{formatPrice(price)}
                    </strong>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeFromCart(courseId)
                      }
                    >
                      <FaTrashAlt />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-side">
            <div className="cart-summary">
              <div className="cart-summary-heading">
                <div className="cart-summary-icon">
                  <FaBookOpen />
                </div>

                <div>
                  <span>Payment Details</span>
                  <h2>Order Summary</h2>
                </div>
              </div>

              <div className="summary-row">
                <span>
                  Course subtotal ({cart.length})
                </span>

                <strong>₹{formatPrice(subtotal)}</strong>
              </div>

              {appliedDiscount && (
                <div className="summary-row discount-line">
                  <span>
                    Discount ({appliedDiscount.pct}%)
                  </span>

                  <strong>
                    -₹{formatPrice(discountAmount)}
                  </strong>
                </div>
              )}

              <div className="summary-row">
                <span>GST (18%)</span>

                <strong>₹{formatPrice(gst)}</strong>
              </div>

              <div className="summary-row digital-access-row">
                <span>Digital course access</span>

                <strong>FREE</strong>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>

                <strong>₹{formatPrice(total)}</strong>
              </div>

              <Link
                to="/payment"
                className="checkout-link"
                state={{
                  subtotal,
                  total,
                  discountAmt: discountAmount,
                  tax: gst,
                  appliedDiscount,
                  cart,
                }}
              >
                <button
                  type="button"
                  className="checkout-btn"
                >
                  Proceed to Secure Payment
                  <FaArrowRight />
                </button>
              </Link>

              <div className="cart-secure-note">
                <FaLock />

                <span>
                  Secure payment and instant course enrolment
                </span>
              </div>
            </div>

            <div className="discount-box">
              <div className="discount-heading">
                <div>
                  <FaTag />
                </div>

                <span>
                  <small>Save on Your Enrolment</small>
                  <h3>Apply Discount Code</h3>
                </span>
              </div>

              <p className="discount-hint">
                Available codes: DVOC10, LEARN15, SKILL20 and
                FIRSTCOURSE.
              </p>

              {!appliedDiscount ? (
                <>
                  <div className="discount-row">
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(event) => {
                        setDiscountCode(
                          event.target.value.toUpperCase()
                        );
                        setDiscountError("");
                      }}
                      className="discount-input"
                    />

                    <button
                      type="button"
                      className="discount-apply-btn"
                      onClick={applyDiscount}
                    >
                      Apply
                    </button>
                  </div>

                  {discountError && (
                    <p className="discount-error">
                      {discountError}
                    </p>
                  )}
                </>
              ) : (
                <div className="discount-applied-box">
                  <FaCheckCircle />

                  <div>
                    <strong>
                      {appliedDiscount.code} applied
                    </strong>

                    <span>
                      You received{" "}
                      {appliedDiscount.pct}% off
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeDiscount}
                    aria-label="Remove discount"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <div className="cart-benefits-box">
              <h3>Included with Your Purchase</h3>

              <div>
                <FaPlayCircle />
                <span>Structured course lessons</span>
              </div>

              <div>
                <FaBookOpen />
                <span>Learning resources and projects</span>
              </div>

              <div>
                <FaCertificate />
                <span>Certificate after completion</span>
              </div>

              <div>
                <FaGraduationCap />
                <span>Access through My Courses</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Cart;