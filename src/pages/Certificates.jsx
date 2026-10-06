import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaDownload,
  FaGraduationCap,
  FaLock,
  FaMedal,
} from "react-icons/fa";

import "../css/Certificates.css";

function Certificates({
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

  const getCourseId = (course) =>
    course?._id || course?.id;

  const getCompletionDate = (course) => {
    const dateValue =
      course?.completedAt ||
      course?.certificateIssuedAt ||
      course?.lastLesson?.updatedAt ||
      course?.purchasedAt;

    if (!dateValue) {
      return "Recently completed";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently completed";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const completedCourses = purchasedCourses.filter(
    (course) =>
      course?.certificateEarned === true ||
      Number(course?.progress || 0) === 100
  );

  const downloadCertificate = async (course) => {
    const courseId = getCourseId(course);

    try {
      setDownloadingId(courseId);

      const certificateWindow = window.open(
        "",
        "_blank",
        "width=1100,height=800"
      );

      if (!certificateWindow) {
        throw new Error(
          "Popup blocked. Please allow popups and try again."
        );
      }

      const completionDate =
        getCompletionDate(course);

      certificateWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              DVOC Certificate - ${course.title || "Course"}
            </title>

            <style>
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 35px;
                font-family: Arial, sans-serif;
                background: #eef2f6;
                color: #17233d;
              }

              .certificate {
                position: relative;
                width: 100%;
                max-width: 1000px;
                min-height: 680px;
                margin: auto;
                padding: 55px 70px;
                overflow: hidden;
                border: 14px solid #17233d;
                background:
                  radial-gradient(
                    circle at top right,
                    rgba(245, 130, 32, 0.14),
                    transparent 32%
                  ),
                  #ffffff;
                text-align: center;
              }

              .certificate::before,
              .certificate::after {
                content: "";
                position: absolute;
                width: 180px;
                height: 180px;
                border: 2px solid rgba(245, 130, 32, 0.28);
                border-radius: 50%;
              }

              .certificate::before {
                top: -90px;
                right: -90px;
              }

              .certificate::after {
                left: -90px;
                bottom: -90px;
              }

              .logo {
                width: 105px;
                height: 105px;
                margin: 0 auto 15px;
                object-fit: contain;
              }

              .label {
                margin-bottom: 10px;
                color: #f58220;
                font-size: 14px;
                font-weight: 800;
                letter-spacing: 3px;
                text-transform: uppercase;
              }

              h1 {
                margin: 0;
                font-size: 48px;
                letter-spacing: 1px;
              }

              .presented {
                margin: 30px 0 10px;
                color: #667085;
                font-size: 18px;
              }

              .student-name {
                display: inline-block;
                min-width: 480px;
                padding: 8px 20px 13px;
                border-bottom: 2px solid #f58220;
                font-size: 35px;
                font-weight: 800;
              }

              .completion-text {
                max-width: 760px;
                margin: 28px auto 14px;
                color: #475467;
                font-size: 17px;
                line-height: 1.8;
              }

              .course-title {
                margin: 12px 0 28px;
                color: #f58220;
                font-size: 30px;
                font-weight: 800;
              }

              .details {
                margin-top: 35px;
                display: flex;
                justify-content: space-between;
                gap: 25px;
                text-align: left;
              }

              .details div {
                flex: 1;
                padding-top: 13px;
                border-top: 1px solid #d0d5dd;
              }

              .details span,
              .details strong {
                display: block;
              }

              .details span {
                margin-bottom: 5px;
                color: #667085;
                font-size: 12px;
                text-transform: uppercase;
              }

              .details strong {
                font-size: 15px;
              }

              .signature {
                margin-top: 55px;
                display: flex;
                justify-content: space-between;
                gap: 80px;
              }

              .signature div {
                flex: 1;
                padding-top: 10px;
                border-top: 1px solid #17233d;
                font-size: 13px;
                font-weight: 700;
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

                .certificate {
                  max-width: none;
                  min-height: 100vh;
                  border-width: 10px;
                }

                .print-button {
                  display: none;
                }
              }
            </style>
          </head>

          <body>
            <section class="certificate">
              <img
                src="${window.location.origin}/dvoc.png"
                alt="DVOC Institute"
                class="logo"
              />

              <div class="label">
                DVOC Institute
              </div>

              <h1>
                Certificate of Completion
              </h1>

              <p class="presented">
                This certificate is proudly presented to
              </p>

              <div class="student-name">
                ${studentName}
              </div>

              <p class="completion-text">
                for successfully completing all required lessons,
                learning activities and course requirements for
              </p>

              <div class="course-title">
                ${course.title || "DVOC Professional Course"}
              </div>

              <div class="details">
                <div>
                  <span>Course Category</span>

                  <strong>
                    ${course.category || "Professional Training"}
                  </strong>
                </div>

                <div>
                  <span>Course Duration</span>

                  <strong>
                    ${course.duration || "Self-paced"}
                  </strong>
                </div>

                <div>
                  <span>Completion Date</span>

                  <strong>
                    ${completionDate}
                  </strong>
                </div>
              </div>

              <div class="signature">
                <div>
                  Course Coordinator
                </div>

                <div>
                  Director, DVOC Institute
                </div>
              </div>
            </section>

            <button
              class="print-button"
              onclick="window.print()"
            >
              Download / Save as PDF
            </button>
          </body>
        </html>
      `);

      certificateWindow.document.close();
      certificateWindow.focus();
    } catch (error) {
      console.error(
        "Certificate download error:",
        error
      );

      alert(
        error.message ||
          "Unable to generate the certificate."
      );
    } finally {
      setDownloadingId("");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="certificate-status">
        <div className="certificate-status-icon">
          <FaLock />
        </div>

        <span>DVOC Student Account</span>

        <h1>Login Required</h1>

        <p>
          Sign in to view certificates earned
          after completing your DVOC courses.
        </p>

        <Link to="/login">
          Student Login
          <FaArrowRight />
        </Link>

        <Link
          to="/courses"
          className="certificate-secondary-link"
        >
          Browse Courses
        </Link>
      </main>
    );
  }

  return (
    <main className="certificates-page">
      <section className="certificates-hero">
        <div className="certificates-hero-icon">
          <FaCertificate />
        </div>

        <span>DVOC Achievements</span>

        <h1>My Certificates</h1>

        <p>
          View and download certificates earned
          after successfully completing DVOC
          professional courses.
        </p>

        <div className="certificate-hero-count">
          <FaMedal />

          <strong>
            {completedCourses.length}
          </strong>

          <span>
            {completedCourses.length === 1
              ? "Certificate Earned"
              : "Certificates Earned"}
          </span>
        </div>
      </section>

      <section className="certificates-container">
        <div className="certificates-heading-row">
          <div>
            <span>Your Achievements</span>

            <h2>
              Course Completion Certificates
            </h2>

            <p>
              Certificates are unlocked after
              completing 100% of an eligible
              course.
            </p>
          </div>

          <Link to="/my-courses">
            Continue Learning
            <FaArrowRight />
          </Link>
        </div>

        {completedCourses.length === 0 ? (
          <section className="certificate-empty">
            <div className="certificate-empty-icon">
              <FaCertificate />
            </div>

            <span>
              No Certificates Available
            </span>

            <h2>No Certificates Yet</h2>

            <p>
              Complete every lesson in an
              eligible DVOC course to unlock
              your certificate of completion.
            </p>

            <Link to="/my-courses">
              Continue Learning
              <FaArrowRight />
            </Link>
          </section>
        ) : (
          <div className="certificate-grid">
            {completedCourses.map(
              (course) => {
                const courseId =
                  getCourseId(course);

                const completionDate =
                  getCompletionDate(course);

                return (
                  <article
                    className="certificate-card"
                    key={courseId}
                  >
                    <div className="certificate-preview">
                      <div className="certificate-preview-border">
                        <img
                          src="/dvoc.png"
                          alt="DVOC Institute"
                        />

                        <span>
                          Certificate of Completion
                        </span>

                        <small>
                          This certificate is presented to
                        </small>

                        <strong>
                          {studentName}
                        </strong>

                        <p>
                          for successfully completing
                        </p>

                        <h2>
                          {course.title ||
                            "DVOC Course"}
                        </h2>

                        <div className="certificate-preview-footer">
                          <span>
                            DVOC Institute
                          </span>

                          <span>
                            {completionDate}
                          </span>
                        </div>
                      </div>

                      <div className="certificate-earned-badge">
                        <FaCheckCircle />

                        Verified Completion
                      </div>
                    </div>

                    <div className="certificate-info">
                      <span>
                        {course.category ||
                          "Professional Course"}
                      </span>

                      <h3>
                        {course.title ||
                          "DVOC Course"}
                      </h3>

                      <p>
                        Completed on{" "}
                        <strong>
                          {completionDate}
                        </strong>
                      </p>

                      <div className="certificate-course-meta">
                        <span>
                          <FaGraduationCap />

                          {course.level ||
                            "All Levels"}
                        </span>

                        <span>
                          <FaBookOpen />

                          {course.lessons || 0} lessons
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          downloadCertificate(course)
                        }
                        disabled={
                          downloadingId === courseId
                        }
                      >
                        {downloadingId ===
                        courseId ? (
                          <>
                            <span className="certificate-loader"></span>

                            Preparing...
                          </>
                        ) : (
                          <>
                            <FaDownload />

                            Download Certificate
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Certificates;