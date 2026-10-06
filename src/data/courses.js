export const COURSE_CATEGORIES = [
  "All",
  "Development",
  "Data & AI",
  "Business",
  "Digital Skills",
];

export const DISCOUNT_CODES = {
  DVOC10: 10,
  LEARN15: 15,
  SKILL20: 20,
  FIRSTCOURSE: 25,
};

export const courses = [
  {
    id: 1,
    title: "Java Full Stack Development",
    shortTitle: "Java Full Stack",
    instructor: "DVOC Faculty",
    category: "Development",
    level: "Advanced",
    duration: "288 Hours",
    lessons: 84,
    rating: 4.8,
    reviews: 1240,
    students: 1850,
    price: 12999,
    originalPrice: 17999,
    image: "/course-java.jpg",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    certificate: true,
    description:
      "Learn Java, Spring Boot, Hibernate, REST APIs, React, databases and enterprise application development.",
    skills: [
      "Core Java",
      "Advanced Java",
      "Spring Boot",
      "Hibernate",
      "REST APIs",
      "React",
      "MySQL",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Java Fundamentals",
        lessons: [
          "Introduction to Java",
          "Variables and Data Types",
          "Operators and Control Statements",
          "Arrays and Strings",
          "Object-Oriented Programming",
        ],
      },
      {
        moduleTitle: "Module 2: Advanced Java",
        lessons: [
          "Exception Handling",
          "Collections Framework",
          "File Handling",
          "Multithreading",
          "JDBC",
        ],
      },
      {
        moduleTitle: "Module 3: Backend Development",
        lessons: [
          "Spring Framework",
          "Spring Boot",
          "Hibernate ORM",
          "REST API Development",
          "Authentication and Security",
        ],
      },
      {
        moduleTitle: "Module 4: Frontend Development",
        lessons: [
          "HTML and CSS",
          "JavaScript",
          "React Fundamentals",
          "React Routing",
          "Connecting React with APIs",
        ],
      },
    ],
    previewLesson: {
      title: "Introduction to Java Full Stack Development",
      content:
        "Learn how frontend, backend, databases and APIs work together to build a complete web application.",
    },
  },

  {
    id: 2,
    title: "MERN Full Stack Development",
    shortTitle: "MERN Full Stack",
    instructor: "DVOC Faculty",
    category: "Development",
    level: "Intermediate",
    duration: "240 Hours",
    lessons: 72,
    rating: 4.7,
    reviews: 980,
    students: 1420,
    price: 11999,
    originalPrice: 15999,
    image: "/course-fullstack.jpg",
    badge: "Popular",
    featured: true,
    bestseller: false,
    certificate: true,
    description:
      "Build modern web applications using MongoDB, Express.js, React and Node.js.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Frontend Foundations",
        lessons: [
          "HTML Structure",
          "CSS Styling",
          "Responsive Design",
          "JavaScript Fundamentals",
        ],
      },
      {
        moduleTitle: "Module 2: React Development",
        lessons: [
          "Components",
          "Props and State",
          "Hooks",
          "React Router",
          "API Integration",
        ],
      },
      {
        moduleTitle: "Module 3: Backend Development",
        lessons: [
          "Node.js Basics",
          "Express.js",
          "REST APIs",
          "Authentication",
          "Error Handling",
        ],
      },
      {
        moduleTitle: "Module 4: Database and Deployment",
        lessons: [
          "MongoDB",
          "Mongoose",
          "Cloud Deployment",
          "Final Project",
        ],
      },
    ],
    previewLesson: {
      title: "How the MERN Stack Works",
      content:
        "Understand how MongoDB, Express, React and Node.js connect to create a complete full stack application.",
    },
  },

  {
    id: 3,
    title: "Data Science, Machine Learning and Generative AI",
    shortTitle: "Data Science and AI",
    instructor: "DVOC Faculty",
    category: "Data & AI",
    level: "Advanced",
    duration: "380 Hours",
    lessons: 96,
    rating: 4.9,
    reviews: 870,
    students: 1100,
    price: 15999,
    originalPrice: 21999,
    image: "/course-ai.jpg",
    badge: "Trending",
    featured: true,
    bestseller: true,
    certificate: true,
    description:
      "Learn Python, data analysis, machine learning, deep learning and generative AI through practical projects.",
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Data Visualisation",
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Python for Data Science",
        lessons: [
          "Python Fundamentals",
          "NumPy",
          "Pandas",
          "Data Cleaning",
        ],
      },
      {
        moduleTitle: "Module 2: Data Analysis",
        lessons: [
          "Exploratory Data Analysis",
          "Statistics",
          "Matplotlib",
          "Data Visualisation",
        ],
      },
      {
        moduleTitle: "Module 3: Machine Learning",
        lessons: [
          "Regression",
          "Classification",
          "Clustering",
          "Model Evaluation",
        ],
      },
      {
        moduleTitle: "Module 4: AI and Generative AI",
        lessons: [
          "Neural Networks",
          "Deep Learning",
          "Natural Language Processing",
          "Generative AI Tools",
        ],
      },
    ],
    previewLesson: {
      title: "Introduction to Data Science",
      content:
        "Explore how data is collected, cleaned, analysed and used to create intelligent models.",
    },
  },

  {
    id: 4,
    title: "Professional Data Analytics",
    shortTitle: "Data Analytics",
    instructor: "DVOC Faculty",
    category: "Data & AI",
    level: "Intermediate",
    duration: "180 Hours",
    lessons: 58,
    rating: 4.7,
    reviews: 760,
    students: 920,
    price: 8999,
    originalPrice: 12999,
    image: "/course-data-analytics.jpg",
    badge: "Career Focused",
    featured: false,
    bestseller: false,
    certificate: true,
    description:
      "Master Excel, SQL, Power BI, Python and data visualisation for professional reporting and analysis.",
    skills: [
      "Advanced Excel",
      "SQL",
      "Power BI",
      "Python",
      "Dashboards",
      "Data Visualisation",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Excel Analytics",
        lessons: [
          "Excel Formulas",
          "Pivot Tables",
          "Data Cleaning",
          "Dashboard Creation",
        ],
      },
      {
        moduleTitle: "Module 2: SQL",
        lessons: [
          "Database Fundamentals",
          "SQL Queries",
          "Joins",
          "Aggregations",
        ],
      },
      {
        moduleTitle: "Module 3: Power BI",
        lessons: [
          "Power BI Interface",
          "Data Modelling",
          "DAX",
          "Interactive Dashboards",
        ],
      },
    ],
    previewLesson: {
      title: "Introduction to Data Analytics",
      content:
        "Learn how raw data is transformed into useful insights, reports and dashboards.",
    },
  },

  {
    id: 5,
    title: "FinTech and Business Analytics",
    shortTitle: "FinTech and Analytics",
    instructor: "DVOC Faculty",
    category: "Business",
    level: "Professional",
    duration: "288 Hours",
    lessons: 68,
    rating: 4.6,
    reviews: 640,
    students: 780,
    price: 10999,
    originalPrice: 14999,
    image: "/course-fintech.jpg",
    badge: "Professional",
    featured: false,
    bestseller: false,
    certificate: true,
    description:
      "Learn financial technology, business intelligence, analytics tools and professional reporting.",
    skills: [
      "Financial Analysis",
      "Excel",
      "Power BI",
      "Business Analytics",
      "Investment Analysis",
      "Reporting",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Finance Fundamentals",
        lessons: [
          "Financial Markets",
          "Banking Systems",
          "Digital Payments",
          "Investment Basics",
        ],
      },
      {
        moduleTitle: "Module 2: Business Analytics",
        lessons: [
          "Data Analysis",
          "Excel Reporting",
          "Power BI Dashboards",
          "Business Intelligence",
        ],
      },
      {
        moduleTitle: "Module 3: FinTech Applications",
        lessons: [
          "Digital Banking",
          "Payment Technologies",
          "Financial Modelling",
          "Risk Analysis",
        ],
      },
    ],
    previewLesson: {
      title: "Introduction to FinTech",
      content:
        "Understand how technology is transforming banking, payments, investments and financial services.",
    },
  },

  {
    id: 6,
    title: "Digital Marketing",
    shortTitle: "Digital Marketing",
    instructor: "DVOC Faculty",
    category: "Digital Skills",
    level: "Beginner",
    duration: "110 Hours",
    lessons: 45,
    rating: 4.6,
    reviews: 530,
    students: 850,
    price: 6999,
    originalPrice: 9999,
    image: "/course-marketing.jpg",
    badge: "Beginner Friendly",
    featured: false,
    bestseller: false,
    certificate: true,
    description:
      "Learn SEO, social media marketing, online advertising, analytics and content strategy.",
    skills: [
      "SEO",
      "Social Media Marketing",
      "Google Ads",
      "Content Marketing",
      "Email Marketing",
      "Analytics",
    ],
    modules: [
      {
        moduleTitle: "Module 1: Digital Marketing Fundamentals",
        lessons: [
          "Introduction to Digital Marketing",
          "Marketing Funnels",
          "Audience Research",
          "Content Strategy",
        ],
      },
      {
        moduleTitle: "Module 2: Search and Social",
        lessons: [
          "SEO",
          "Google Ads",
          "Facebook Marketing",
          "Instagram Marketing",
        ],
      },
      {
        moduleTitle: "Module 3: Analytics and Campaigns",
        lessons: [
          "Google Analytics",
          "Campaign Tracking",
          "Email Marketing",
          "Final Campaign Project",
        ],
      },
    ],
    previewLesson: {
      title: "Introduction to Digital Marketing",
      content:
        "Discover how businesses use search engines, social media and online advertising to reach customers.",
    },
  },
];

export function getCourseById(id) {
  return courses.find(
    (course) => String(course.id) === String(id)
  );
}

export function getCoursesByCategory(category) {
  if (!category || category === "All") {
    return courses;
  }

  return courses.filter(
    (course) =>
      course.category.toLowerCase() === category.toLowerCase()
  );
}

export function searchCourses(searchText) {
  const query = searchText.trim().toLowerCase();

  if (!query) {
    return courses;
  }

  return courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(query) ||
      course.shortTitle.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      )
    );
  });
}