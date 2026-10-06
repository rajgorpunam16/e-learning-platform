import { Link } from "react-router-dom";
import aboutStudents from "../assets/about-students.jpg";
import ashishBafna from "../assets/ashish-bafna.jpg";
import lajwantiSharma from "../assets/lajwanti-sharma.jpg";
import dhruvBafna from "../assets/dhruv-bafna.jpg";
import poonamPathak from "../assets/poonam-pathak.jpg";
import {
  FaArrowRight,
  FaAward,
  FaBuilding,
  FaBullseye,
  FaCertificate,
  FaCheckCircle,
  FaGraduationCap,
  FaHandshake,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuoteLeft,
  FaUserGraduate,
  FaUsers,
   FaLaptopCode,
  FaChartLine,
  FaBullhorn,
  FaDatabase
} from "react-icons/fa";

import "../css/About.css";


function About() {

  const statistics = [
    {
      number: "30+",
      label: "Years of Excellence",
    },
    {
      number: "30K+",
      label: "Students Trained",
    },
    {
      number: "30+",
      label: "Courses Offered",
    },
  ];

  const values = [
    {
      icon: <FaBullseye />,
      title: "Practical First",
      description: "Every concept backed by real-world application.",
    },
    {
      icon: <FaHandshake />,
      title: "Student-First",
      description: "Your success is our measure of achievement.",
    },
    {
      icon: <FaCertificate />,
      title: "Government Recognised",
      description: "NSDC, MS-CIT, Tally Institute certified.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "3 Mumbai Branches",
      description: "Close to home, accessible by train and bus.",
    },
  ];

  const founders = [
    {
        image: lajwantiSharma,
      name: "Lajwanti Sharma",
      role: "Chief Business Officer",
      description:
        "Lajwanti Sharma brings warmth, clarity, and purpose to everything she does at DVOC Institute. As Chief Business Officer, she works tirelessly behind the scenes to ensure that every student's journey—from enrolment to employment—is smooth, supported, and meaningful. Her deep understanding of people and commitment to building genuine relationships have made her the backbone of DVOC's growth and community trust.",
    },
    {
      image: dhruvBafna,
      name: "Dhruv Bafna",
      role: "Director",
      description:
        "Dhruv Bafna leads DVOC Institute with a passion for innovation and a deep belief in the potential of every learner. As Director, he drives the institute's vision forward—shaping programmes, strengthening industry connections, and creating an environment where students feel inspired to grow. His hands-on approach and genuine care for student success make him a guiding force for students and faculty alike.",
    },
    {
      image: poonamPathak,
      name: "Poonam Pathak",
      role: "Head of Placements",
      description:
        "Poonam Pathak is the person who turns hard work into opportunities. As Head of Placements, she builds bridges between DVOC's talented students and the companies that need them—nurturing partnerships, guiding students through interviews, and celebrating every offer letter as a personal win. Her dedication has helped hundreds find careers they are truly proud of.",
    },
  ];

  const advisoryMembers = [
  {
    icon: <FaLaptopCode />,
    title: "Advisory Member",
    role: "Senior IT Director",
    experience: "18+ Years Experience",
    description:
      "Former technology director at a leading Mumbai-based IT firm. Advises DVOC on curriculum design for Full Stack and Data Science programs.",
  },
  {
    icon: <FaChartLine />,
    title: "Advisory Member",
    role: "Finance Industry Expert",
    experience: "22+ Years Experience",
    description:
      "Senior banker and financial services professional. Guides the FinTech and Business Analytics curriculum to align with industry expectations.",
  },
  {
    icon: <FaBullhorn />,
    title: "Advisory Member",
    role: "Marketing & Digital Expert",
    experience: "30+ Years Experience",
    description:
      "Digital marketing entrepreneur with agency experience across India and the GCC. Shapes the Digital Marketing and AI programs at DVOC.",
  },
  {
    icon: <FaDatabase />,
    title: "Advisory Member",
    role: "Data Science Industry Leader",
    experience: "20+ Years Experience",
    description:
      "Experienced industry leader who helps ensure DVOC's Data Science and analytics programs reflect real professional standards.",
  },
];

  return (
    <main className="dvoc-about-page">
      {/* HERO SECTION */}

      <section
  className="dvoc-about-hero"
  style={{
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(10, 23, 45, 0.97) 0%,
        rgba(10, 23, 45, 0.91) 48%,
        rgba(10, 23, 45, 0.7) 100%
      ),
      url(${aboutStudents})
    `,
  }}
>
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <span className="about-hero-badge">
            <FaBuilding />
            Est. 1996
          </span>

          <h1>
            Empowering Mumbai
            <br />
            Through <span>Quality Education</span>
          </h1>

          <p>
            DVOC Institute has been Mumbai&apos;s trusted professional and
            skill-development training institute for more than 30 years —
            government recognised, placement-focused, and student-first in
            everything we do.
          </p>

          <div className="about-hero-actions">
            <Link to="/courses" className="about-orange-button">
              Explore Courses
              <FaArrowRight />
            </Link>

            <Link to="/contact" className="about-light-button">
              Book Free Counselling
            </Link>
          </div>
        </div>

        <div className="about-hero-statistics">
          {statistics.map((statistic) => (
            <div className="about-hero-stat" key={statistic.label}>
              <strong>{statistic.number}</strong>
              <span>{statistic.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}

      <section className="about-story-section">
        <div className="about-story-image">
          <img
            src={aboutStudents}
            alt="Students learning together at DVOC Institute"
          />

          <div className="story-experience-badge">
            <FaAward />
            <div>
              <strong>30+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>
        </div>

        <div className="about-story-content">
          <div className="about-section-label">
            <span></span>
            Our Story
          </div>

          <h2>
            About <span>DVOC Institute</span>
          </h2>

          <p>
            DVOC Institute was founded in 1996 with a simple but powerful
            mission: to make quality professional and skill-development
            education accessible to every student and professional in Mumbai —
            regardless of background.
          </p>

          <p>
            More than 30 years and 30,000 students later, we remain deeply
            committed to practical, industry-aligned education. We do not just
            teach theory. We train students to be job-ready from day one —
            using real tools, real projects, and real placement support.
          </p>

          <p>
            With three branches across Mumbai in Andheri, Vile Parle, and Grant
            Road, along with partnerships involving NSDC, MS-CIT, Tally, and
            MKCI, DVOC has grown into a recognised vocational training
            institute in the city.
          </p>

          <div className="about-values-grid">
            {values.map((value) => (
              <article className="about-value-card" key={value.title}>
                <div className="about-value-icon">{value.icon}</div>

                <div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR'S DESK */}

      <section className="director-section">
        <div className="director-content">
          <div className="about-section-label director-label">
            <span></span>
            Director&apos;s Desk
          </div>

          <FaQuoteLeft className="director-quote-icon" />

          <blockquote>
            “Education is not just about passing exams — it is about building
            the confidence to build a career.”
          </blockquote>

          <p>
            Ashish Bafna founded DVOC Institute with a heartfelt vision—to
            guide students towards brighter futures by equipping them with
            practical skills, industry knowledge, and the confidence to achieve
            their career goals.
          </p>

          <p>
            He believes that every student deserves the right opportunities and
            support to succeed. Through his dedication and leadership, DVOC
            Institute has become a trusted learning platform that has helped
            thousands of learners grow personally and professionally, turning
            their aspirations into meaningful careers.
          </p>

          <div className="director-signature">
            <strong>Ashish Bafna</strong>
            <span>Director, DVOC Institute</span>
            <small>Mumbai&apos;s Premier Professional Training Institute</small>
          </div>
        </div>

        <div className="director-image-wrapper">
          <div className="director-image-background"></div>

          <img
            src={ashishBafna}
            alt="Ashish Bafna, Director of DVOC Institute"
          />

          <div className="director-image-card">
            <FaGraduationCap />
            <div>
              <strong>Student Success</strong>
              <span>Our highest priority</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}

      <section className="founders-section">
        <div className="about-wide-heading">
          <div className="about-section-label">
            <span></span>
            Leadership
          </div>

          <h2>
            Meet the <span>Founders</span>
          </h2>
        </div>

        <div className="founders-grid">
          {founders.map((founder) => (
            <article className="founder-card" key={founder.name}>
              <div className="founder-image">
                <img src={founder.image} alt={founder.name} />

                <div className="founder-image-overlay"></div>
              </div>

              <div className="founder-information">
                <h3>{founder.name}</h3>

                <span className="founder-role">
                  {founder.role} · DVOC Institute
                </span>

                <p>{founder.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ADVISORY BOARD */}

      <section className="advisory-section">
        <div className="about-wide-heading">
          <div className="about-section-label">
            <span></span>
            Advisory Board
          </div>

          <h2>
            30+ Years of <span>Industry Expertise</span>
          </h2>

          <p>
            Our advisory board brings together senior leaders from IT, finance,
            design, and business — guiding our curriculum to stay ahead of
            industry needs.
          </p>
        </div>

        <div className="advisory-grid">
          {advisoryMembers.map((member) => (
            <article
              className="advisory-card"
              key={`${member.icon}-${member.role}`}
            >
              <div className="advisory-avatar">{member.icon}</div>

              <div className="advisory-content">
                <h3>{member.title}</h3>

                <div className="advisory-role">
                  {member.role}
                  <span> · </span>
                  {member.experience}
                </div>

                <p>{member.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INSTITUTE DETAILS */}

      <section className="about-recognition-section">
        <div className="recognition-heading">
          <span>Trusted Training Institute</span>

          <h2>Learning that supports real career growth</h2>
        </div>

        <div className="recognition-items">
          <div>
            <FaCertificate />
            <span>Government-recognised certification</span>
          </div>

          <div>
            <FaUserGraduate />
            <span>30,000+ students trained</span>
          </div>

          <div>
            <FaUsers />
            <span>Student-focused learning environment</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Placement and career support</span>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}

      <section className="about-cta-section">
        <div className="about-cta-content">
          <span>Start Today</span>

          <h2>
            Your Career in Tech
            <br />
            Starts with <strong>One Call</strong>
          </h2>

          <p>
            Book a free counselling session. No obligation — just clarity on
            which course is right for you.
          </p>
        </div>

        <div className="about-cta-actions">
          <Link to="/contact" className="cta-white-button">
            Book Free Counselling
            <FaArrowRight />
          </Link>

          <a href="tel:+917021733916" className="cta-call-button">
            <FaPhoneAlt />

            <div>
              <span>Call Now</span>
              <strong>+91 70217 33916</strong>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;