import { useState } from "react";
import {
  FaChevronDown,
  FaQuestionCircle,
  FaSearch,
} from "react-icons/fa";

import "../css/FAQ.css";

const FAQ_DATA = [
  {
    question: "How do I purchase a course?",
    answer:
      "Open the Courses page, select a course, add it to your cart and complete payment. The course will then appear in My Courses.",
  },
  {
    question: "Where can I access purchased courses?",
    answer:
      "Purchased courses are available from the My Courses section in your student profile menu.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Eligible courses include a DVOC completion certificate after the required lessons and assessments are completed.",
  },
  {
    question: "Can I access lessons on mobile?",
    answer:
      "Yes. The learning platform is responsive and can be accessed from desktop, tablet and mobile devices.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Select Forgot Password on the login page, enter your registered email and use the reset link sent to you.",
  },
  {
    question: "Can I request a refund?",
    answer:
      "Refund eligibility depends on the refund policy and whether course content has already been accessed.",
  },
  {
    question: "How long can I access a course?",
    answer:
      "Course access depends on the course plan shown during enrolment. Your enrolled courses remain visible in My Courses.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFAQs = FAQ_DATA.filter((item) =>
    item.question
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <FaQuestionCircle />
        <span>Help Centre</span>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers about courses, payments, certificates and
          your DVOC student account.
        </p>

        <div className="faq-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </section>

      <section className="faq-container">
        <div className="faq-list">
          {filteredFAQs.map((item, index) => (
            <article
              key={item.question}
              className={
                openIndex === index
                  ? "faq-item open"
                  : "faq-item"
              }
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(
                    openIndex === index ? -1 : index
                  )
                }
              >
                <span>{item.question}</span>
                <FaChevronDown />
              </button>

              {openIndex === index && (
                <p>{item.answer}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default FAQ;