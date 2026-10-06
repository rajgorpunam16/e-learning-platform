import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaGraduationCap,
  FaLock,
  FaMobileAlt,
  FaPlayCircle,
  FaShieldAlt,
  FaUniversity,
  FaUserGraduate,
} from "react-icons/fa";

import "../css/payment.css";

function Payment({
  cart = [],
  setCart,
  setPurchasedCourses,
  setOrderCount,
  isLoggedIn = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [method, setMethod] = useState("card");

  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upi: "",
    bank: "",
    billingName: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentState = location.state || {};

  const {
    subtotal: stateSubtotal,
    total: stateTotal,
    discountAmt = 0,
    tax: stateTax,
    appliedDiscount = null,
  } = paymentState;

  /* =========================
     COURSE HELPERS
  ========================= */

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

      return `http://localhost:5000/${course.image}`;
    }

    return "";
  };

  const getInstructor = (course) =>
    course?.instructor ||
    course?.author ||
    "DVOC Faculty";

  const getPrice = (course) =>
    Number(course?.price || 0);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  /* =========================
     TOTAL CALCULATIONS
  ========================= */

  const calculatedSubtotal = useMemo(() => {
    return cart.reduce(
      (total, course) =>
        total + getPrice(course),
      0
    );
  }, [cart]);

  const subtotal =
    stateSubtotal !== undefined
      ? Number(stateSubtotal)
      : calculatedSubtotal;

  const discountAmount =
    Number(discountAmt || 0);

  const taxableAmount = Math.max(
    subtotal - discountAmount,
    0
  );

  const gst =
    stateTax !== undefined
      ? Number(stateTax)
      : taxableAmount * 0.18;

  const finalTotal =
    stateTotal !== undefined
      ? Number(stateTotal)
      : taxableAmount + gst;

  /* =========================
     ROUTE PROTECTION
  ========================= */

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (cart.length === 0 && !success) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    cart.length,
    isLoggedIn,
    navigate,
    success,
  ]);

  /* =========================
     INPUT HANDLING
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "cardNumber") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      const numbers = value
        .replace(/\D/g, "")
        .slice(0, 4);

      updatedValue =
        numbers.length > 2
          ? `${numbers.slice(0, 2)}/${numbers.slice(2)}`
          : numbers;
    }

    if (name === "cvv") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: updatedValue,
    }));

    setError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateCommonFields = () => {
    if (!form.billingName.trim()) {
      return "Please enter the student name.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(form.phone)) {
      return "Please enter a valid 10-digit mobile number.";
    }

    return "";
  };

  const validatePaymentDetails = () => {
    const commonError =
      validateCommonFields();

    if (commonError) {
      return commonError;
    }

    if (method === "card") {
      const cardDigits =
        form.cardNumber.replace(/\s/g, "");

      if (!form.cardholderName.trim()) {
        return "Please enter the cardholder name.";
      }

      if (cardDigits.length !== 16) {
        return "Please enter a valid 16-digit card number.";
      }

      if (
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
          form.expiry
        )
      ) {
        return "Please enter expiry in MM/YY format.";
      }

      if (!/^\d{3}$/.test(form.cvv)) {
        return "Please enter a valid 3-digit CVV.";
      }
    }

    if (method === "upi") {
      const upiPattern =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

      if (!upiPattern.test(form.upi.trim())) {
        return "Please enter a valid UPI ID.";
      }
    }

    if (
      method === "netbanking" &&
      !form.bank
    ) {
      return "Please select your bank.";
    }

    return "";
  };

  /* =========================
     PAYMENT
  ========================= */

  const handlePay = async (event) => {
    event.preventDefault();

    setError("");

    const validationError =
      validatePaymentDetails();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setProcessing(true);

      /*
        Demo payment delay.

        Later, connect a real gateway here:
        - Razorpay
        - Stripe
        - Cashfree
        - PayU

        After real payment verification,
        save enrolment details in MongoDB.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setSuccess(true);
    } catch (paymentError) {
      console.error(
        "Payment processing error:",
        paymentError
      );

      setError(
        "Payment could not be processed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =========================
     SUCCESSFUL ENROLMENT
  ========================= */

  const handleSuccessClose = () => {
    if (
      typeof setPurchasedCourses ===
      "function"
    ) {
      setPurchasedCourses(
        (previousCourses) => {
          const newCourses = cart.filter(
            (course) =>
              !previousCourses.some(
                (purchasedCourse) =>
                  String(
                    getCourseId(
                      purchasedCourse
                    )
                  ) ===
                  String(
                    getCourseId(course)
                  )
              )
          );

          const enrolledCourses =
            newCourses.map((course) => ({
              ...course,

              id: getCourseId(course),
              _id: getCourseId(course),

              purchasedAt:
                new Date().toISOString(),

              progress: 0,

              completedLessons: [],

              certificateEarned: false,

              enrollmentStatus: "active",

              studentDetails: {
                name: form.billingName.trim(),
                email: form.email
                  .trim()
                  .toLowerCase(),
                phone: form.phone,
              },

              paymentDetails: {
                method,
                subtotal,
                discountAmount,
                gst,
                total: finalTotal,
                discountCode:
                  appliedDiscount?.code ||
                  "",
                paidAt:
                  new Date().toISOString(),
              },
            }));

          return [
            ...previousCourses,
            ...enrolledCourses,
          ];
        }
      );
    }

    if (
      typeof setOrderCount === "function"
    ) {
      setOrderCount(
        (previousCount) =>
          Number(previousCount || 0) + 1
      );
    }

    if (typeof setCart === "function") {
      setCart([]);
    }

    setSuccess(false);

    navigate("/my-courses");
  };

  if (!isLoggedIn || cart.length === 0) {
    return null;
  }

  return (
    <main className="payment-page">
      {/* =========================
          SUCCESS MODAL
      ========================= */}

      {success && (
        <div className="success-overlay">
          <section className="success-modal">
            <div className="success-icon">
              <FaCheckCircle />
            </div>

            <span className="success-label">
              Payment Successful
            </span>

            <h2>
              Course Enrolment Confirmed
            </h2>

            <p>
              Your selected courses have been
              added to your learning account.
              You can now access lessons,
              modules and course resources
              from My Courses.
            </p>

            <div className="success-details">
              <div>
                <FaBookOpen />

                <span>
                  <small>
                    Courses Enrolled
                  </small>

                  {cart.length}
                </span>
              </div>

              <div>
                <FaGraduationCap />

                <span>
                  <small>Total Paid</small>

                  ₹{formatPrice(finalTotal)}
                </span>
              </div>

              <div>
                <FaCertificate />

                <span>
                  <small>Access</small>

                  Available Now
                </span>
              </div>
            </div>

            <button
              type="button"
              className="success-primary-button"
              onClick={handleSuccessClose}
            >
              Go to My Courses
              <FaArrowRight />
            </button>
          </section>
        </div>
      )}

      {/* =========================
          PAYMENT HERO
      ========================= */}

      <section className="payment-hero">
        <div>
          <span>
            Secure Course Enrolment
          </span>

          <h1>Complete Your Payment</h1>

          <p>
            Review your enrolment details and
            complete payment to unlock your
            selected DVOC courses.
          </p>
        </div>

        <div className="payment-security-badge">
          <FaShieldAlt />

          <div>
            <strong>
              Secure Checkout
            </strong>

            <span>
              Protected payment process
            </span>
          </div>
        </div>
      </section>

      <section className="payment-container">
        <div className="payment-top-row">
          <Link
            to="/cart"
            className="payment-back-link"
          >
            <FaArrowLeft />
            Return to Course Cart
          </Link>

          <div className="payment-step-indicator">
            <span className="completed">
              <FaCheckCircle />
              Course Cart
            </span>

            <span className="active">
              <FaCreditCard />
              Payment
            </span>

            <span>
              <FaGraduationCap />
              Enrolment
            </span>
          </div>
        </div>

        <div className="payment-grid">
          {/* =========================
              PAYMENT FORM
          ========================= */}

          <section className="payment-form-box">
            <div className="payment-box-heading">
              <div className="payment-heading-icon">
                <FaLock />
              </div>

              <div>
                <span>
                  Payment Information
                </span>

                <h2>
                  Select Payment Method
                </h2>
              </div>
            </div>

            <div className="payment-methods">
              <button
                type="button"
                className={
                  method === "card"
                    ? "payment-method-btn active"
                    : "payment-method-btn"
                }
                onClick={() => {
                  setMethod("card");
                  setError("");
                }}
              >
                <FaCreditCard />

                <span>
                  <strong>
                    Credit / Debit Card
                  </strong>

                  <small>
                    Visa, Mastercard and RuPay
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  method === "upi"
                    ? "payment-method-btn active"
                    : "payment-method-btn"
                }
                onClick={() => {
                  setMethod("upi");
                  setError("");
                }}
              >
                <FaMobileAlt />

                <span>
                  <strong>UPI</strong>

                  <small>
                    Pay using any UPI
                    application
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  method === "netbanking"
                    ? "payment-method-btn active"
                    : "payment-method-btn"
                }
                onClick={() => {
                  setMethod("netbanking");
                  setError("");
                }}
              >
                <FaUniversity />

                <span>
                  <strong>
                    Net Banking
                  </strong>

                  <small>
                    Pay through your bank
                    account
                  </small>
                </span>
              </button>
            </div>

            {error && (
              <div className="payment-error-message">
                {error}
              </div>
            )}

            <form
              className="payment-form"
              onSubmit={handlePay}
            >
              {/* CARD */}

              {method === "card" && (
                <div className="payment-method-fields">
                  <div className="payment-section-heading">
                    <span>
                      Card Payment
                    </span>

                    <h3>
                      Enter Card Details
                    </h3>
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="cardholderName">
                      Cardholder Name
                    </label>

                    <input
                      id="cardholderName"
                      type="text"
                      name="cardholderName"
                      placeholder="Name shown on card"
                      value={
                        form.cardholderName
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="cardNumber">
                      Card Number
                    </label>

                    <div className="payment-input-icon">
                      <FaCreditCard />

                      <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={
                          form.cardNumber
                        }
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="payment-form-row">
                    <div className="payment-form-group">
                      <label htmlFor="expiry">
                        Expiry Date
                      </label>

                      <input
                        id="expiry"
                        type="text"
                        name="expiry"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={form.expiry}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="payment-form-group">
                      <label htmlFor="cvv">
                        CVV
                      </label>

                      <input
                        id="cvv"
                        type="password"
                        name="cvv"
                        inputMode="numeric"
                        placeholder="3 digits"
                        maxLength="3"
                        value={form.cvv}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI */}

              {method === "upi" && (
                <div className="payment-method-fields">
                  <div className="payment-section-heading">
                    <span>
                      UPI Payment
                    </span>

                    <h3>
                      Enter Your UPI ID
                    </h3>
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="upi">
                      UPI ID
                    </label>

                    <div className="payment-input-icon">
                      <FaMobileAlt />

                      <input
                        id="upi"
                        type="text"
                        name="upi"
                        placeholder="yourname@upi"
                        value={form.upi}
                        onChange={handleChange}
                      />
                    </div>

                    <small className="payment-field-note">
                      Enter the UPI ID linked
                      with your payment
                      application.
                    </small>
                  </div>
                </div>
              )}

              {/* NET BANKING */}

              {method === "netbanking" && (
                <div className="payment-method-fields">
                  <div className="payment-section-heading">
                    <span>
                      Net Banking
                    </span>

                    <h3>
                      Select Your Bank
                    </h3>
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="bank">
                      Bank
                    </label>

                    <select
                      id="bank"
                      name="bank"
                      value={form.bank}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select your bank
                      </option>

                      <option value="State Bank of India">
                        State Bank of India
                      </option>

                      <option value="HDFC Bank">
                        HDFC Bank
                      </option>

                      <option value="ICICI Bank">
                        ICICI Bank
                      </option>

                      <option value="Axis Bank">
                        Axis Bank
                      </option>

                      <option value="Bank of Baroda">
                        Bank of Baroda
                      </option>

                      <option value="Other Bank">
                        Other Bank
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* STUDENT DETAILS */}

              <div className="payment-student-section">
                <div className="payment-section-heading">
                  <span>
                    Student Details
                  </span>

                  <h3>
                    Course Enrolment
                    Information
                  </h3>
                </div>

                <div className="payment-form-group">
                  <label htmlFor="billingName">
                    Student Full Name
                  </label>

                  <div className="payment-input-icon">
                    <FaUserGraduate />

                    <input
                      id="billingName"
                      type="text"
                      name="billingName"
                      placeholder="Enter student full name"
                      value={
                        form.billingName
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="payment-form-row">
                  <div className="payment-form-group">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="payment-form-group">
                    <label htmlFor="phone">
                      Mobile Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="pay-btn"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="payment-loader"></span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay ₹
                    {formatPrice(finalTotal)}
                  </>
                )}
              </button>

              <p className="secure-note">
                <FaShieldAlt />
                Your payment information is
                encrypted and securely
                processed.
              </p>
            </form>
          </section>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <aside className="payment-summary">
            <div className="payment-summary-heading">
              <span>
                Course Enrolment
              </span>

              <h2>Order Summary</h2>

              <p>
                {cart.length}{" "}
                {cart.length === 1
                  ? "course selected"
                  : "courses selected"}
              </p>
            </div>

            <div className="order-items">
              {cart.map((course) => {
                const courseId =
                  getCourseId(course);

                const image =
                  getCourseImage(course);

                return (
                  <article
                    className="order-item"
                    key={courseId}
                  >
                    <div className="order-item-cover">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            course.title ||
                            "DVOC Course"
                          }
                        />
                      ) : (
                        <FaBookOpen />
                      )}
                    </div>

                    <div className="order-item-info">
                      <span>
                        {course.category ||
                          "Professional Course"}
                      </span>

                      <h4>
                        {course.title ||
                          "DVOC Course"}
                      </h4>

                      <p>
                        By{" "}
                        {getInstructor(course)}
                      </p>

                      <div className="order-course-meta">
                        <span>
                          <FaClock />

                          {course.duration ||
                            "Self-paced"}
                        </span>

                        <span>
                          <FaPlayCircle />

                          {course.lessons || 0}{" "}
                          lessons
                        </span>
                      </div>
                    </div>

                    <div className="order-item-price">
                      ₹
                      {formatPrice(
                        getPrice(course)
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="order-divider"></div>

            <div className="payment-summary-row">
              <span>
                Course Subtotal
              </span>

              <strong>
                ₹{formatPrice(subtotal)}
              </strong>
            </div>

            {appliedDiscount && (
              <div className="payment-summary-row payment-discount-line">
                <span>
                  Discount (
                  {appliedDiscount.pct}%)
                </span>

                <strong>
                  -₹
                  {formatPrice(
                    discountAmount
                  )}
                </strong>
              </div>
            )}

            <div className="payment-summary-row">
              <span>GST (18%)</span>

              <strong>
                ₹{formatPrice(gst)}
              </strong>
            </div>

            <div className="payment-summary-row digital-access-line">
              <span>
                Digital Course Access
              </span>

              <strong>FREE</strong>
            </div>

            <div className="order-divider"></div>

            <div className="payment-summary-row payment-total-row">
              <span>
                Total Amount
              </span>

              <strong>
                ₹{formatPrice(finalTotal)}
              </strong>
            </div>

            <div className="payment-benefits">
              <div>
                <FaCheckCircle />

                <span>
                  Instant course access after
                  payment
                </span>
              </div>

              <div>
                <FaBookOpen />

                <span>
                  Lessons and course resources
                </span>
              </div>

              <div>
                <FaCertificate />

                <span>
                  Certificate after course
                  completion
                </span>
              </div>

              <div>
                <FaGraduationCap />

                <span>
                  Access through My Courses
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Payment;