import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
  FaDownload,
  FaFileInvoice,
  FaGraduationCap,
  FaLock,
  FaReceipt,
} from "react-icons/fa";

import "../css/PurchaseHistory.css";

function PurchaseHistory({
  purchasedCourses = [],
  isLoggedIn = false,
}) {
  const [downloadingId, setDownloadingId] = useState("");

  const currentUser = useMemo(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error("Unable to read saved user:", error);
      return null;
    }
  }, []);

  const studentName =
    currentUser?.name ||
    currentUser?.fullName ||
    "DVOC Student";

  const studentEmail =
    currentUser?.email || "Not available";

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

  const getPurchaseDate = (course) => {
    const dateValue =
      course?.paymentDetails?.paidAt ||
      course?.purchasedAt;

    if (!dateValue) {
      return "Date unavailable";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPurchaseDateTime = (course) => {
    const dateValue =
      course?.paymentDetails?.paidAt ||
      course?.purchasedAt;

    if (!dateValue) {
      return "Date unavailable";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAmountPaid = (course) => {
    if (
      course?.paymentDetails?.total !== undefined
    ) {
      return Number(course.paymentDetails.total);
    }

    return Number(course?.price || 0);
  };

  const getPaymentMethod = (course) => {
    const method =
      course?.paymentDetails?.method || "";

    const paymentMethods = {
      card: "Credit / Debit Card",
      upi: "UPI",
      netbanking: "Net Banking",
    };

    return paymentMethods[method] || "Online Payment";
  };

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const totalAmountPaid = purchasedCourses.reduce(
    (total, course) =>
      total + getAmountPaid(course),
    0
  );

  const generateInvoiceNumber = (
    course,
    index
  ) => {
    const courseId = String(
      getCourseId(course) || index + 1
    );

    return `DVOC-${courseId
      .slice(-6)
      .toUpperCase()}-${String(index + 1).padStart(
      3,
      "0"
    )}`;
  };

  const downloadInvoice = (
    course,
    index
  ) => {
    const courseId = getCourseId(course);

    try {
      setDownloadingId(courseId);

      const invoiceWindow = window.open(
        "",
        "_blank",
        "width=1050,height=800"
      );

      if (!invoiceWindow) {
        throw new Error(
          "Popup blocked. Please allow popups and try again."
        );
      }

      const invoiceNumber =
        generateInvoiceNumber(course, index);

      const amountPaid =
        getAmountPaid(course);

      const subtotal = Number(
        course?.paymentDetails?.subtotal ??
          course?.price ??
          0
      );

      const discount = Number(
        course?.paymentDetails?.discountAmount ??
          0
      );

      const gst = Number(
        course?.paymentDetails?.gst ??
          Math.max(subtotal - discount, 0) *
            0.18
      );

      const paymentMethod =
        getPaymentMethod(course);

      const purchaseDateTime =
        getPurchaseDateTime(course);

      invoiceWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              DVOC Invoice - ${invoiceNumber}
            </title>

            <style>
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 35px;
                font-family: Arial, sans-serif;
                color: #17233d;
                background: #eef2f6;
              }

              .invoice {
                width: 100%;
                max-width: 950px;
                margin: auto;
                padding: 45px;
                background: #ffffff;
                box-shadow:
                  0 18px 45px rgba(16, 24, 40, 0.12);
              }

              .invoice-header {
                padding-bottom: 25px;
                display: flex;
                justify-content: space-between;
                gap: 30px;
                border-bottom: 3px solid #f58220;
              }

              .brand {
                display: flex;
                align-items: center;
                gap: 15px;
              }

              .brand img {
                width: 88px;
                height: 88px;
                object-fit: contain;
              }

              .brand h1 {
                margin: 0;
                font-size: 27px;
              }

              .brand p {
                margin: 6px 0 0;
                color: #667085;
                font-size: 13px;
              }

              .invoice-meta {
                text-align: right;
              }

              .invoice-meta span,
              .invoice-meta strong {
                display: block;
              }

              .invoice-meta span {
                color: #667085;
                font-size: 12px;
              }

              .invoice-meta strong {
                margin: 5px 0 14px;
                font-size: 16px;
              }

              .section {
                margin-top: 30px;
              }

              .section-title {
                margin-bottom: 12px;
                color: #f58220;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 1.3px;
                text-transform: uppercase;
              }

              .student-box {
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 18px;
                border: 1px solid #e4e7ec;
                background: #f8fafc;
              }

              .student-box span,
              .student-box strong {
                display: block;
              }

              .student-box span {
                margin-bottom: 5px;
                color: #667085;
                font-size: 11px;
              }

              .student-box strong {
                font-size: 14px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
              }

              th,
              td {
                padding: 14px;
                border: 1px solid #e4e7ec;
                text-align: left;
              }

              th {
                color: #475467;
                background: #f8fafc;
                font-size: 11px;
                text-transform: uppercase;
              }

              td {
                font-size: 13px;
              }

              .amount-section {
                width: 430px;
                max-width: 100%;
                margin: 30px 0 0 auto;
              }

              .amount-row {
                padding: 11px 0;
                display: flex;
                justify-content: space-between;
                gap: 20px;
                border-bottom: 1px solid #e4e7ec;
                font-size: 13px;
              }

              .amount-row.total {
                padding-top: 16px;
                border-bottom: 0;
                color: #17233d;
                font-size: 19px;
                font-weight: 800;
              }

              .paid-badge {
                margin-top: 25px;
                padding: 13px 18px;
                display: inline-block;
                border-radius: 8px;
                color: #166534;
                background: #dcfce7;
                font-size: 13px;
                font-weight: 800;
              }

              .invoice-footer {
                margin-top: 45px;
                padding-top: 20px;
                border-top: 1px solid #e4e7ec;
                color: #667085;
                font-size: 11px;
                line-height: 1.7;
                text-align: center;
              }

              .print-button {
                margin: 25px auto 0;
                padding: 12px 22px;
                display: block;
                border: none;
                border-radius: 8px;
                color: #ffffff;
                background: #f58220;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
              }

              @media print {
                body {
                  padding: 0;
                  background: #ffffff;
                }

                .invoice {
                  max-width: none;
                  box-shadow: none;
                }

                .print-button {
                  display: none;
                }
              }
            </style>
          </head>

          <body>
            <section class="invoice">
              <header class="invoice-header">
                <div class="brand">
                  <img
                    src="${window.location.origin}/dvoc.png"
                    alt="DVOC Institute"
                  />

                  <div>
                    <h1>DVOC Institute</h1>

                    <p>
                      E-Learning Course Payment Invoice
                    </p>
                  </div>
                </div>

                <div class="invoice-meta">
                  <span>Invoice Number</span>

                  <strong>
                    ${invoiceNumber}
                  </strong>

                  <span>Payment Date</span>

                  <strong>
                    ${purchaseDateTime}
                  </strong>
                </div>
              </header>

              <section class="section">
                <div class="section-title">
                  Student Information
                </div>

                <div class="student-box">
                  <div>
                    <span>Student Name</span>

                    <strong>
                      ${
                        course?.studentDetails?.name ||
                        studentName
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Email Address</span>

                    <strong>
                      ${
                        course?.studentDetails?.email ||
                        studentEmail
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Payment Method</span>

                    <strong>
                      ${paymentMethod}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>

                    <strong>Paid</strong>
                  </div>
                </div>
              </section>

              <section class="section">
                <div class="section-title">
                  Course Details
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Category</th>
                      <th>Duration</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        ${
                          course.title ||
                          "DVOC Course"
                        }
                      </td>

                      <td>
                        ${
                          course.category ||
                          "Professional Course"
                        }
                      </td>

                      <td>
                        ${
                          course.duration ||
                          "Self-paced"
                        }
                      </td>

                      <td>
                        ₹${formatPrice(
                          course.price
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <div class="amount-section">
                <div class="amount-row">
                  <span>Subtotal</span>

                  <strong>
                    ₹${formatPrice(subtotal)}
                  </strong>
                </div>

                <div class="amount-row">
                  <span>Discount</span>

                  <strong>
                    -₹${formatPrice(discount)}
                  </strong>
                </div>

                <div class="amount-row">
                  <span>GST (18%)</span>

                  <strong>
                    ₹${formatPrice(gst)}
                  </strong>
                </div>

                <div class="amount-row total">
                  <span>Total Paid</span>

                  <strong>
                    ₹${formatPrice(amountPaid)}
                  </strong>
                </div>
              </div>

              <div class="paid-badge">
                Payment Successfully Completed
              </div>

              <footer class="invoice-footer">
                This invoice confirms payment for digital course
                enrolment on the DVOC E-Learning Platform.
                Course access is provided through the student's
                My Courses dashboard.
              </footer>
            </section>

            <button
              class="print-button"
              onclick="window.print()"
            >
              Download / Save Invoice as PDF
            </button>
          </body>
        </html>
      `);

      invoiceWindow.document.close();
      invoiceWindow.focus();
    } catch (error) {
      console.error(
        "Invoice generation error:",
        error
      );

      alert(
        error.message ||
          "Unable to generate the invoice."
      );
    } finally {
      setDownloadingId("");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="purchase-history-status">
        <div className="purchase-history-status-icon">
          <FaLock />
        </div>

        <span>DVOC Student Account</span>

        <h1>Login Required</h1>

        <p>
          Sign in to view your course purchases,
          payment records and downloadable invoices.
        </p>

        <Link to="/login">
          Student Login
          <FaArrowRight />
        </Link>
      </main>
    );
  }

  return (
    <main className="purchase-history-page">
      <section className="purchase-history-hero">
        <div className="purchase-history-hero-icon">
          <FaFileInvoice />
        </div>

        <span>Payment Records</span>

        <h1>Purchase History</h1>

        <p>
          View course enrolment payments and
          download invoices for your records.
        </p>

        <div className="purchase-history-summary">
          <div>
            <FaBookOpen />

            <span>
              <small>Total Purchases</small>

              <strong>
                {purchasedCourses.length}
              </strong>
            </span>
          </div>

          <div>
            <FaReceipt />

            <span>
              <small>Total Paid</small>

              <strong>
                ₹{formatPrice(totalAmountPaid)}
              </strong>
            </span>
          </div>
        </div>
      </section>

      <section className="purchase-history-container">
        <div className="purchase-history-heading">
          <div>
            <span>Course Transactions</span>

            <h2>Your Payment Records</h2>

            <p>
              Every successful course enrolment
              appears below with payment and
              invoice details.
            </p>
          </div>

          <Link to="/courses">
            Browse More Courses
            <FaArrowRight />
          </Link>
        </div>

        {purchasedCourses.length === 0 ? (
          <section className="purchase-history-empty">
            <div className="purchase-history-empty-icon">
              <FaFileInvoice />
            </div>

            <span>No Payment Records</span>

            <h2>No Purchases Yet</h2>

            <p>
              Your completed course purchases
              and invoice records will appear
              here after enrolment.
            </p>

            <Link to="/courses">
              Browse Courses
              <FaArrowRight />
            </Link>
          </section>
        ) : (
          <div className="purchase-history-table-wrapper">
            <div className="purchase-history-table">
              <div className="purchase-history-head">
                <span>Course</span>
                <span>Purchase Date</span>
                <span>Payment Method</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Invoice</span>
              </div>

              {purchasedCourses.map(
                (course, index) => {
                  const courseId =
                    getCourseId(course);

                  const image =
                    getCourseImage(course);

                  const invoiceNumber =
                    generateInvoiceNumber(
                      course,
                      index
                    );

                  return (
                    <div
                      className="purchase-history-row"
                      key={courseId}
                    >
                      <div className="purchase-course-cell">
                        <div className="purchase-course-image">
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

                        <div>
                          <strong>
                            {course.title ||
                              "DVOC Course"}
                          </strong>

                          <span>
                            {course.category ||
                              "Professional Course"}
                          </span>

                          <small>
                            {invoiceNumber}
                          </small>
                        </div>
                      </div>

                      <span>
                        {getPurchaseDate(course)}
                      </span>

                      <span>
                        {getPaymentMethod(course)}
                      </span>

                      <strong>
                        ₹
                        {formatPrice(
                          getAmountPaid(course)
                        )}
                      </strong>

                      <span className="purchase-success">
                        <FaCheckCircle />
                        Paid
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          downloadInvoice(
                            course,
                            index
                          )
                        }
                        disabled={
                          downloadingId ===
                          courseId
                        }
                      >
                        {downloadingId ===
                        courseId ? (
                          <>
                            <span className="purchase-loader"></span>
                            Preparing
                          </>
                        ) : (
                          <>
                            <FaDownload />
                            Invoice
                          </>
                        )}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default PurchaseHistory;