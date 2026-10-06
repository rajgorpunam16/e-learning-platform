import { useState } from "react";
import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserGraduate,
} from "react-icons/fa";

import "../css/Contact.css";

function Contact() {
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    course: "",
    branch: "",
    subject: "",
    message: "",
  };

  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const branches = [
    {
      name: "Andheri Branch",
      address:
        "101, 1st Floor, Matru Chhaya Building, Old Nagardas Road, Mumbai 400069",
    },
    {
      name: "Vile Parle Branch",
      address:
        "103, 1st Floor, Hari Leela, Off Nehru Road, Mumbai 400057",
    },
    {
      name: "Grant Road Branch",
      address:
        "Fellowship School, August Kranti Maidan, Grant Road (W), Mumbai 400026",
    },
  ];

  const courses = [
    "Full Stack Development",
    "Java Full Stack",
    "Python Full Stack",
    "Data Science",
    "Data Analytics",
    "FinTech and Analytics",
    "Digital Marketing",
    "AI and GenAI",
    "Tally and Accounting",
    "Other Course",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
    setSent(false);
  };

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.course ||
      !form.branch ||
      !form.message.trim()
    ) {
      return "Please complete all required fields.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(form.phone.trim())) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }

    if (form.message.trim().length < 10) {
      return "Your message must contain at least 10 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSent(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      /*
        Connect your backend API here later.

        Example:

        const response = await fetch(
          "http://localhost:5000/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSent(true);
      setForm(initialForm);
    } catch (submitError) {
      console.error("Contact form error:", submitError);

      setError(
        submitError.message ||
          "Unable to send your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dvoc-contact-page">
      {/* HERO SECTION */}

      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-hero-badge">
            <FaGraduationCap />
            Contact DVOC Institute
          </span>

          <h1>
            Let&apos;s discuss your
            <span> learning journey.</span>
          </h1>

          <p>
            Have questions about courses, fees, batches, certification or
            career opportunities? Speak with the DVOC counselling team and
            receive guidance for choosing the right program.
          </p>

          <div className="contact-hero-actions">
            <a href="tel:+917021733916" className="contact-primary-button">
              <FaPhoneAlt />
              Call +91 70217 33916
            </a>

            <a
              href="mailto:info@dvoc.in"
              className="contact-secondary-button"
            >
              <FaEnvelope />
              Email DVOC
            </a>
          </div>
        </div>

        <div className="contact-hero-card">
          <img
            src="/dvoc.png"
            alt="DVOC Institute"
            className="contact-hero-logo"
          />

          <h2>Free Course Counselling</h2>

          <p>
            Share your interests and career goals. Our counselling team will
            help you understand the available programs and suitable learning
            path.
          </p>

          <div className="contact-hero-points">
            <div>
              <FaCheckCircle />
              <span>Course and career guidance</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Branch and batch information</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Fees and certification details</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION */}

      <section className="contact-main-section">
        <div className="contact-information">
          <div className="contact-section-heading">
            <span>Get in Touch</span>

            <h2>We are here to help you</h2>

            <p>
              Contact the DVOC team for admission enquiries, course
              information, counselling and student support.
            </p>
          </div>

          <div className="contact-details-grid">
            <article className="contact-detail-card">
              <div className="contact-detail-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <h3>Call Us</h3>

                <a href="tel:+917021733916">+91 70217 33916</a>

                <p>For course and admission enquiries</p>
              </div>
            </article>

            <article className="contact-detail-card">
              <div className="contact-detail-icon">
                <FaEnvelope />
              </div>

              <div>
                <h3>Email Us</h3>

                <a href="mailto:info@dvoc.in">info@dvoc.in</a>

                <p>Send your questions by email</p>
              </div>
            </article>

            <article className="contact-detail-card">
              <div className="contact-detail-icon">
                <FaClock />
              </div>

              <div>
                <h3>Institute Hours</h3>

                <strong>Monday–Saturday</strong>

                <p>9:00 AM–9:00 PM</p>
              </div>
            </article>

            <article className="contact-detail-card">
              <div className="contact-detail-icon">
                <FaBuilding />
              </div>

              <div>
                <h3>Mumbai Branches</h3>

                <strong>3 Locations</strong>

                <p>Andheri, Vile Parle and Grant Road</p>
              </div>
            </article>
          </div>

          <div className="contact-branches">
            <div className="contact-branches-heading">
              <FaMapMarkerAlt />

              <div>
                <span>Find DVOC</span>
                <h3>Our Mumbai Branches</h3>
              </div>
            </div>

            <div className="contact-branch-list">
              {branches.map((branch) => (
                <article className="contact-branch-item" key={branch.name}>
                  <div className="contact-branch-marker">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h4>{branch.name}</h4>
                    <p>{branch.address}</p>
                    <span>Monday–Saturday: 9 AM–9 PM</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* ENQUIRY FORM */}

        <div className="contact-form-box">
          <div className="contact-form-heading">
            <div className="contact-form-heading-icon">
              <FaUserGraduate />
            </div>

            <div>
              <span>Course Enquiry</span>
              <h2>Send us a message</h2>
            </div>
          </div>

          <p className="contact-form-description">
            Complete the form and the DVOC team will contact you regarding your
            enquiry.
          </p>

          {sent && (
            <div className="contact-success-message">
              <FaCheckCircle />

              <div>
                <strong>Enquiry submitted successfully.</strong>
                <span>
                  The DVOC counselling team will contact you shortly.
                </span>
              </div>
            </div>
          )}

          {error && <div className="contact-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-email">
                  Email Address <span>*</span>
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-phone">
                  Mobile Number <span>*</span>
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-course">
                  Interested Course <span>*</span>
                </label>

                <select
                  id="contact-course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                >
                  <option value="">Select a course</option>

                  {courses.map((course) => (
                    <option value={course} key={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-branch">
                  Preferred Branch <span>*</span>
                </label>

                <select
                  id="contact-branch"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                >
                  <option value="">Select a branch</option>
                  <option value="Andheri">Andheri</option>
                  <option value="Vile Parle">Vile Parle</option>
                  <option value="Grant Road">Grant Road</option>
                  <option value="Online">Online Learning</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-subject">Subject</label>

                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Example: Admission enquiry"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">
                Your Message <span>*</span>
              </label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us which course or information you are looking for..."
                value={form.message}
                onChange={handleChange}
                rows="6"
              />
            </div>

            <button
              type="submit"
              className="contact-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="contact-button-loader"></span>
                  Submitting Enquiry...
                </>
              ) : (
                <>
                  Submit Enquiry
                  <FaArrowRight />
                </>
              )}
            </button>

            <p className="contact-form-note">
              By submitting this form, you agree to be contacted by the DVOC
              counselling team regarding courses and admissions.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;