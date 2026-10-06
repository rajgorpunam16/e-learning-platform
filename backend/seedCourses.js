require("dotenv").config();

const dns = require("node:dns");
const mongoose = require("mongoose");

const Course = require("./models/Course");

/*
  ============================================================
  DNS CONFIGURATION
  ============================================================

  Use public DNS servers for MongoDB Atlas SRV lookup.

  This is useful because this seed file runs as a separate
  Node.js process from server.js.
*/

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
  "1.1.1.1",
]);

/*
  ============================================================
  COURSE DATA
  ============================================================

  These courses now match the courses displayed on Home.jsx.

  Home has 6 courses:

  1. Java Full Stack Development
  2. MERN Full Stack Development
  3. Data Science, Machine Learning and GenAI
  4. FinTech and Business Analytics
  5. Professional Data Analytics
  6. Digital Marketing
*/

const courses = [
  /*
    ==========================================================
    1. JAVA FULL STACK DEVELOPMENT
    ==========================================================
  */

  {
    title: "Java Full Stack Development",

    shortTitle: "Java Full Stack",

    instructor: "DVOC Faculty",

    category: "Development",

    description:
      "Learn Java, Spring Boot, Hibernate, REST APIs, React and database development.",

    longDescription:
      "Master front-end and back-end development using Core Java, Advanced Java, JDBC, Hibernate, Spring, Spring Boot, REST APIs, React, MySQL, Git and deployment. This career-focused programme includes structured lessons, practical assignments and complete projects.",

    level: "Advanced",

    duration: "288 hours",

    lessons: 84,

    price: 12999,

    originalPrice: 17999,

    rating: 4.8,

    reviews: 1240,

    students: 1240,

    badge: "Advanced",

    image: "/course-java.jpg",

    certificate: true,

    featured: true,

    bestseller: true,

    active: true,

    skills: [
      "Core Java",
      "Object-Oriented Programming",
      "JDBC",
      "Hibernate",
      "Spring Framework",
      "Spring Boot",
      "REST APIs",
      "React",
      "MySQL",
      "Git and GitHub",
    ],

    learningOutcomes: [
      "Build complete Java web applications",
      "Develop REST APIs using Spring Boot",
      "Connect Java applications with MySQL",
      "Use Hibernate for database operations",
      "Build responsive React interfaces",
      "Complete and deploy a full-stack project",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Core Java",

        lessons: [
          "Introduction to Java",
          "Variables and Data Types",
          "Operators and Control Statements",
          "Arrays and Strings",
          "Classes and Objects",
          "Inheritance and Polymorphism",
          "Exception Handling",
          "Collections Framework",
        ],
      },

      {
        moduleTitle: "Module 2: Database and JDBC",

        lessons: [
          "MySQL Fundamentals",
          "SQL Queries",
          "JDBC Connectivity",
          "PreparedStatement",
          "CRUD Operations",
          "Transactions",
        ],
      },

      {
        moduleTitle: "Module 3: Hibernate",

        lessons: [
          "Introduction to ORM",
          "Hibernate Configuration",
          "Entity Mapping",
          "Hibernate CRUD",
          "One-to-One Relationships",
          "One-to-Many Relationships",
        ],
      },

      {
        moduleTitle: "Module 4: Spring and Spring Boot",

        lessons: [
          "Spring Framework Introduction",
          "Dependency Injection",
          "Spring Boot Project Setup",
          "REST API Development",
          "Spring Data JPA",
          "Validation and Exception Handling",
          "Authentication Fundamentals",
        ],
      },

      {
        moduleTitle: "Module 5: React",

        lessons: [
          "React Introduction",
          "Components",
          "Props and State",
          "React Hooks",
          "React Router",
          "Forms and Validation",
          "API Integration",
        ],
      },

      {
        moduleTitle: "Module 6: Final Project",

        lessons: [
          "Project Planning",
          "Database Design",
          "Backend Development",
          "Frontend Development",
          "Testing",
          "Deployment",
        ],
      },
    ],
  },

  /*
    ==========================================================
    2. MERN FULL STACK DEVELOPMENT
    ==========================================================
  */

  {
    title: "MERN Full Stack Development",

    shortTitle: "MERN Full Stack",

    instructor: "DVOC Faculty",

    category: "Development",

    description:
      "Build modern web applications using MongoDB, Express, React and Node.js.",

    longDescription:
      "Learn complete MERN stack development using HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, REST APIs, authentication, Git and deployment. Students build practical projects and learn how modern web applications work from frontend to backend.",

    level: "Intermediate",

    duration: "240 hours",

    lessons: 72,

    price: 11999,

    originalPrice: 15999,

    rating: 4.7,

    reviews: 980,

    students: 980,

    badge: "Intermediate",

    image: "/course-fullstack.jpg",

    certificate: true,

    featured: true,

    bestseller: false,

    active: true,

    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "REST APIs",
      "JWT Authentication",
      "Git and GitHub",
    ],

    learningOutcomes: [
      "Build responsive React applications",
      "Create Node.js and Express APIs",
      "Store and manage data in MongoDB",
      "Implement user login and authentication",
      "Connect frontend applications with backend APIs",
      "Deploy complete MERN applications",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Web Fundamentals",

        lessons: [
          "HTML Structure",
          "Forms and Tables",
          "CSS Styling",
          "Flexbox and Grid",
          "Responsive Design",
          "JavaScript Fundamentals",
          "DOM Manipulation",
        ],
      },

      {
        moduleTitle: "Module 2: React",

        lessons: [
          "React Introduction",
          "Components",
          "Props",
          "State",
          "Hooks",
          "React Router",
          "Forms and Validation",
        ],
      },

      {
        moduleTitle: "Module 3: Node.js and Express",

        lessons: [
          "Node.js Fundamentals",
          "Express Server",
          "Routing",
          "Middleware",
          "REST API Development",
          "Error Handling",
        ],
      },

      {
        moduleTitle: "Module 4: MongoDB",

        lessons: [
          "MongoDB Introduction",
          "Collections and Documents",
          "MongoDB CRUD",
          "Mongoose Schemas",
          "Mongoose Models",
          "Relationships",
        ],
      },

      {
        moduleTitle: "Module 5: Authentication",

        lessons: [
          "User Registration",
          "Password Hashing",
          "User Login",
          "JWT Authentication",
          "Protected Routes",
          "Role-Based Access",
        ],
      },

      {
        moduleTitle: "Module 6: MERN Project",

        lessons: [
          "Project Setup",
          "Backend API Development",
          "Frontend Development",
          "Authentication Integration",
          "Testing",
          "Deployment",
        ],
      },
    ],
  },

  /*
    ==========================================================
    3. DATA SCIENCE, MACHINE LEARNING AND GENAI
    ==========================================================
  */

  {
    title: "Data Science, Machine Learning and GenAI",

    shortTitle: "Data Science and GenAI",

    instructor: "DVOC Faculty",

    category: "Data & AI",

    description:
      "Learn Python, data analytics, machine learning, AI models and generative AI.",

    longDescription:
      "Develop practical skills in Python programming, data analysis, statistics, data visualisation, machine learning, deep learning, natural language processing and generative AI. Work with real datasets and build industry-focused AI projects.",

    level: "Advanced",

    duration: "380 hours",

    lessons: 96,

    price: 15999,

    originalPrice: 21999,

    rating: 4.9,

    reviews: 870,

    students: 870,

    badge: "Advanced",

    image: "/course-ai.jpg",

    certificate: true,

    featured: true,

    bestseller: true,

    active: true,

    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Statistics",
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Generative AI",
      "Prompt Engineering",
    ],

    learningOutcomes: [
      "Analyse and clean real-world datasets",
      "Create meaningful data visualisations",
      "Build regression and classification models",
      "Evaluate machine-learning models",
      "Understand neural networks and deep learning",
      "Build basic generative AI applications",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Python Programming",

        lessons: [
          "Python Introduction",
          "Variables and Data Types",
          "Control Statements",
          "Functions",
          "Collections",
          "Object-Oriented Programming",
          "File Handling",
        ],
      },

      {
        moduleTitle: "Module 2: Data Analysis",

        lessons: [
          "NumPy",
          "Pandas",
          "Data Cleaning",
          "Missing Values",
          "Data Transformation",
          "Exploratory Data Analysis",
        ],
      },

      {
        moduleTitle: "Module 3: Data Visualisation",

        lessons: [
          "Matplotlib",
          "Charts and Graphs",
          "Visual Analysis",
          "Dashboard Concepts",
          "Data Storytelling",
        ],
      },

      {
        moduleTitle: "Module 4: Machine Learning",

        lessons: [
          "Machine Learning Fundamentals",
          "Linear Regression",
          "Logistic Regression",
          "Decision Trees",
          "Classification",
          "Clustering",
          "Model Evaluation",
        ],
      },

      {
        moduleTitle: "Module 5: Deep Learning",

        lessons: [
          "Neural Network Fundamentals",
          "TensorFlow Introduction",
          "Computer Vision",
          "Natural Language Processing",
          "Deep Learning Models",
        ],
      },

      {
        moduleTitle: "Module 6: Generative AI",

        lessons: [
          "Generative AI Introduction",
          "Large Language Models",
          "Prompt Engineering",
          "AI Chatbot Concepts",
          "AI Application Development",
          "Responsible AI",
        ],
      },
    ],
  },

  /*
    ==========================================================
    4. FINTECH AND BUSINESS ANALYTICS
    ==========================================================
  */

  {
    title: "FinTech and Business Analytics",

    shortTitle: "FinTech and Analytics",

    instructor: "DVOC Faculty",

    category: "Business",

    description:
      "Learn financial technology, Excel, Power BI, analytics and business reporting.",

    longDescription:
      "Build practical finance and analytics skills using advanced Excel, Power BI, SQL and financial technology concepts. Learn how to analyse business data, build dashboards, create reports and support data-driven decision-making.",

    level: "Professional",

    duration: "288 hours",

    lessons: 68,

    price: 10999,

    originalPrice: 14999,

    rating: 4.6,

    reviews: 640,

    students: 640,

    badge: "Professional",

    image: "/course-fintech.jpg",

    certificate: true,

    featured: true,

    bestseller: false,

    active: true,

    skills: [
      "Advanced Excel",
      "Financial Analysis",
      "Power BI",
      "SQL",
      "Business Intelligence",
      "FinTech Fundamentals",
      "Data Visualisation",
      "Financial Reporting",
      "Dashboard Development",
    ],

    learningOutcomes: [
      "Create professional financial reports",
      "Analyse business data using Excel",
      "Write SQL analytics queries",
      "Build Power BI dashboards",
      "Understand digital payments and FinTech",
      "Complete a business analytics project",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Finance Fundamentals",

        lessons: [
          "Accounting Fundamentals",
          "Financial Statements",
          "Financial Ratios",
          "Business Finance",
          "Financial Analysis",
        ],
      },

      {
        moduleTitle: "Module 2: Advanced Excel",

        lessons: [
          "Advanced Excel Formulas",
          "Lookup Functions",
          "Pivot Tables",
          "Data Cleaning",
          "Charts",
          "Financial Models",
        ],
      },

      {
        moduleTitle: "Module 3: SQL for Analytics",

        lessons: [
          "SQL Fundamentals",
          "Filtering and Sorting",
          "Aggregate Functions",
          "Joins",
          "Subqueries",
          "Business Queries",
        ],
      },

      {
        moduleTitle: "Module 4: Power BI",

        lessons: [
          "Power BI Introduction",
          "Data Import",
          "Data Transformation",
          "Data Modelling",
          "DAX Fundamentals",
          "Dashboard Creation",
        ],
      },

      {
        moduleTitle: "Module 5: FinTech",

        lessons: [
          "FinTech Ecosystem",
          "Digital Payments",
          "Banking Technology",
          "Financial Data Analytics",
          "Risk and Compliance",
        ],
      },

      {
        moduleTitle: "Module 6: Final Analytics Project",

        lessons: [
          "Business Problem Selection",
          "Data Collection",
          "Data Cleaning",
          "Data Analysis",
          "Dashboard Development",
          "Final Presentation",
        ],
      },
    ],
  },

  /*
    ==========================================================
    5. PROFESSIONAL DATA ANALYTICS
    ==========================================================
  */

  {
    title: "Professional Data Analytics",

    shortTitle: "Data Analytics",

    instructor: "DVOC Faculty",

    category: "Data & AI",

    description:
      "Master Excel, SQL, Power BI, Python and data visualisation techniques.",

    longDescription:
      "Build practical professional data analytics skills using Excel, SQL, Power BI, Python and modern data visualisation techniques. Learn how to clean datasets, analyse business information, create dashboards and communicate insights effectively.",

    level: "Intermediate",

    duration: "180 hours",

    lessons: 58,

    price: 8999,

    originalPrice: 12999,

    rating: 4.7,

    reviews: 760,

    students: 760,

    badge: "Intermediate",

    image: "/course-data-analytics.jpg",

    certificate: true,

    featured: true,

    bestseller: false,

    active: true,

    skills: [
      "Microsoft Excel",
      "Advanced Excel",
      "SQL",
      "Power BI",
      "Python",
      "Pandas",
      "Data Cleaning",
      "Data Visualisation",
      "Business Analytics",
      "Dashboard Development",
    ],

    learningOutcomes: [
      "Analyse business data using Excel",
      "Clean and prepare datasets",
      "Write SQL queries for analytics",
      "Build interactive Power BI dashboards",
      "Use Python for data analysis",
      "Create professional data visualisations",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Excel Fundamentals",

        lessons: [
          "Introduction to Excel",
          "Rows, Columns and Worksheets",
          "Basic Formulas",
          "Functions",
          "Sorting and Filtering",
          "Conditional Formatting",
          "Data Validation",
        ],
      },

      {
        moduleTitle: "Module 2: Advanced Excel",

        lessons: [
          "Advanced Excel Functions",
          "VLOOKUP and XLOOKUP",
          "INDEX and MATCH",
          "Pivot Tables",
          "Pivot Charts",
          "Advanced Data Cleaning",
          "Excel Dashboards",
        ],
      },

      {
        moduleTitle: "Module 3: SQL for Data Analytics",

        lessons: [
          "Introduction to SQL",
          "SELECT Queries",
          "Filtering Data",
          "Sorting Data",
          "Aggregate Functions",
          "GROUP BY and HAVING",
          "SQL Joins",
          "Subqueries",
        ],
      },

      {
        moduleTitle: "Module 4: Power BI",

        lessons: [
          "Introduction to Power BI",
          "Importing Data",
          "Power Query",
          "Data Transformation",
          "Data Modelling",
          "DAX Fundamentals",
          "Interactive Dashboards",
        ],
      },

      {
        moduleTitle: "Module 5: Python for Analytics",

        lessons: [
          "Python Introduction",
          "Variables and Data Types",
          "Python Collections",
          "Functions",
          "NumPy Fundamentals",
          "Pandas Fundamentals",
          "DataFrames",
          "Data Cleaning with Python",
        ],
      },

      {
        moduleTitle: "Module 6: Data Visualisation Project",

        lessons: [
          "Understanding Business Problems",
          "Data Collection",
          "Data Cleaning",
          "Data Analysis",
          "Dashboard Design",
          "Data Visualisation",
          "Business Insights",
          "Final Analytics Project",
        ],
      },
    ],
  },

  /*
    ==========================================================
    6. DIGITAL MARKETING
    ==========================================================
  */

  {
    title: "Digital Marketing",

    shortTitle: "Digital Marketing",

    instructor: "DVOC Faculty",

    category: "Digital Skills",

    description:
      "Learn SEO, social media, online advertising, analytics and content strategy.",

    longDescription:
      "Learn the fundamentals of modern digital marketing, including search engine optimisation, social media marketing, content marketing, online advertising, email marketing, web analytics and digital campaign strategy. Build practical marketing campaigns and learn how to measure their performance.",

    level: "Beginner",

    duration: "110 hours",

    lessons: 45,

    price: 6999,

    originalPrice: 9999,

    rating: 4.6,

    reviews: 530,

    students: 530,

    badge: "Beginner",

    image: "/course-marketing.jpg",

    certificate: true,

    featured: true,

    bestseller: false,

    active: true,

    skills: [
      "Digital Marketing Fundamentals",
      "Search Engine Optimisation",
      "Social Media Marketing",
      "Content Marketing",
      "Email Marketing",
      "Google Analytics",
      "Online Advertising",
      "Campaign Management",
      "Marketing Analytics",
      "Content Strategy",
    ],

    learningOutcomes: [
      "Understand modern digital marketing fundamentals",
      "Create effective SEO strategies",
      "Plan and manage social media campaigns",
      "Create engaging digital content",
      "Understand online advertising campaigns",
      "Analyse marketing performance using analytics",
    ],

    modules: [
      {
        moduleTitle: "Module 1: Digital Marketing Fundamentals",

        lessons: [
          "Introduction to Digital Marketing",
          "Digital Marketing Channels",
          "Understanding Target Audiences",
          "Customer Journey",
          "Marketing Funnel",
          "Digital Marketing Strategy",
        ],
      },

      {
        moduleTitle: "Module 2: Search Engine Optimisation",

        lessons: [
          "Introduction to SEO",
          "Keyword Research",
          "On-Page SEO",
          "Technical SEO",
          "Off-Page SEO",
          "Link Building",
          "SEO Analytics",
        ],
      },

      {
        moduleTitle: "Module 3: Social Media Marketing",

        lessons: [
          "Social Media Fundamentals",
          "Facebook Marketing",
          "Instagram Marketing",
          "LinkedIn Marketing",
          "Social Media Content",
          "Social Media Strategy",
          "Social Media Analytics",
        ],
      },

      {
        moduleTitle: "Module 4: Content Marketing",

        lessons: [
          "Content Marketing Fundamentals",
          "Content Strategy",
          "Blog Writing",
          "Video Content",
          "Visual Content",
          "Content Distribution",
          "Content Performance",
        ],
      },

      {
        moduleTitle: "Module 5: Online Advertising",

        lessons: [
          "Introduction to Online Advertising",
          "Search Advertising",
          "Display Advertising",
          "Social Media Advertising",
          "Campaign Planning",
          "Ad Performance",
          "Conversion Tracking",
        ],
      },

      {
        moduleTitle: "Module 6: Marketing Analytics Project",

        lessons: [
          "Analytics Fundamentals",
          "Website Analytics",
          "Campaign Analytics",
          "Traffic Analysis",
          "Conversion Analysis",
          "Marketing Dashboard",
          "Final Digital Marketing Project",
        ],
      },
    ],
  },
];

/*
  ============================================================
  SEED COURSES
  ============================================================
*/

const seedCourses = async () => {
  try {
    /*
      ----------------------------------------------------------
      CHECK MONGO URI
      ----------------------------------------------------------
    */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file."
      );
    }

    console.log("");
    console.log("============================================");
    console.log("DVOC COURSE DATABASE SEED");
    console.log("============================================");
    console.log("");

    console.log("Connecting to MongoDB...");

    /*
      ----------------------------------------------------------
      CONNECT TO MONGODB
      ----------------------------------------------------------
    */

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 20000,
      }
    );

    console.log(
      "MongoDB connected successfully."
    );

    console.log(
      "Database:",
      mongoose.connection.name
    );

    console.log("");

    /*
      ----------------------------------------------------------
      COURSE TITLES
      ----------------------------------------------------------

      These are the six courses controlled by this seed file.

      We only delete these exact courses.

      IMPORTANT:
      Other courses created through your Admin Panel
      will NOT be deleted.
    */

    const courseTitles = courses.map(
      (course) => course.title
    );

    /*
      ----------------------------------------------------------
      DELETE OLD SEEDED COURSES
      ----------------------------------------------------------
    */

    console.log(
      "Removing previous copies of seeded courses..."
    );

    const deleteResult =
      await Course.deleteMany({
        title: {
          $in: courseTitles,
        },
      });

    console.log(
      `${deleteResult.deletedCount} existing seeded course(s) removed.`
    );

    console.log("");

    /*
      ----------------------------------------------------------
      INSERT UPDATED COURSES
      ----------------------------------------------------------
    */

    console.log(
      "Adding courses to MongoDB..."
    );

    const insertedCourses =
      await Course.insertMany(courses);

    console.log("");

    console.log(
      "============================================"
    );

    console.log(
      `${insertedCourses.length} DVOC courses inserted successfully.`
    );

    console.log(
      "============================================"
    );

    console.log("");

    /*
      ----------------------------------------------------------
      DISPLAY INSERTED COURSES
      ----------------------------------------------------------
    */

    insertedCourses.forEach(
      (course, index) => {
        console.log(
          `${index + 1}. ${course.title}`
        );

        console.log(
          `   ID: ${course._id}`
        );

        console.log(
          `   Category: ${course.category}`
        );

        console.log(
          `   Level: ${course.level}`
        );

        console.log(
          `   Price: ₹${course.price}`
        );

        console.log(
          `   Original Price: ₹${course.originalPrice}`
        );

        console.log(
          `   Duration: ${course.duration}`
        );

        console.log(
          `   Lessons: ${course.lessons}`
        );

        console.log(
          `   Image: ${course.image}`
        );

        console.log(
          `   Featured: ${course.featured}`
        );

        console.log("");
      }
    );

    /*
      ----------------------------------------------------------
      SUMMARY
      ----------------------------------------------------------
    */

    console.log(
      "============================================"
    );

    console.log("COURSE CATEGORIES");

    console.log(
      "============================================"
    );

    console.log(
      "Development: 2"
    );

    console.log(
      "Data & AI: 2"
    );

    console.log(
      "Business: 1"
    );

    console.log(
      "Digital Skills: 1"
    );

    console.log("");

    console.log(
      "All Home page courses are now available in MongoDB."
    );

    console.log("");
  } catch (error) {
    /*
      ----------------------------------------------------------
      ERROR HANDLING
      ----------------------------------------------------------
    */

    console.error("");

    console.error(
      "============================================"
    );

    console.error(
      "COURSE SEED ERROR"
    );

    console.error(
      "============================================"
    );

    console.error(
      error.message
    );

    /*
      MongoDB Atlas DNS error
    */

    if (
      error.code === "ECONNREFUSED" ||
      String(error.message).includes(
        "querySrv"
      ) ||
      String(error.message).includes(
        "ENOTFOUND"
      )
    ) {
      console.error("");

      console.error(
        "MongoDB Atlas DNS lookup failed."
      );

      console.error(
        "This seed file is configured to use Google and Cloudflare DNS."
      );

      console.error(
        "Check your internet connection."
      );

      console.error(
        "Check MongoDB Atlas Network Access."
      );

      console.error(
        "Check your MONGO_URI in the .env file."
      );

      console.error(
        "Then run the seed file again."
      );
    }

    process.exitCode = 1;
  } finally {
    /*
      ----------------------------------------------------------
      CLOSE DATABASE CONNECTION
      ----------------------------------------------------------
    */

    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed."
      );
    }
  }
};

/*
  ============================================================
  START SEED
  ============================================================
*/

seedCourses();