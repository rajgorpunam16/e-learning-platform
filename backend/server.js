require("dotenv").config();

const dns = require("node:dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/* =====================================
   DNS CONFIGURATION
===================================== */

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
  "1.1.1.1",
]);

/* =====================================
   MODELS
===================================== */

const User = require("./models/User");

/* =====================================
   UTILITIES
===================================== */

const sendEmail = require("./utils/sendEmail");

/* =====================================
   ROUTES
===================================== */

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* =====================================
   CORS
===================================== */

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      /*
        Requests without an origin include:
        Postman, browser address bar and server-to-server requests.
      */
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked request from ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =====================================
   BODY MIDDLEWARE
===================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =====================================
   REQUEST LOGGER
===================================== */

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});

/* =====================================
   BASIC API TEST
===================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DVOC E-Learning API is running.",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/* =====================================
   AUTHENTICATION ROUTES
===================================== */

/*
  POST /api/auth/register
  POST /api/auth/login
*/

app.use("/api/auth", authRoutes);

/*
  Optional legacy endpoints.

  These allow an older Register.jsx or Login.jsx
  still using /register and /login to continue working.
*/

app.use("/", authRoutes);

/* =====================================
   FORGOT PASSWORD
===================================== */

app.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const user = await User.findOne({
      email,
    });

    /*
      Do not reveal whether an email exists.
      This is safer for user accounts.
    */

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message:
          "This account is currently disabled. Please contact support.",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    /*
      Store a hashed version of the reset token.
      The raw token is sent only through email.
    */

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedResetToken;

    user.resetTokenExpiry =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    const resetLink =
      `${frontendUrl}/reset-password/${resetToken}`;

    const displayName =
      user.name ||
      user.fullName ||
      "Student";

    const emailHtml = `
      <div
        style="
          max-width: 620px;
          margin: 0 auto;
          padding: 30px;
          font-family: Arial, sans-serif;
          line-height: 1.7;
          color: #17233d;
          background: #ffffff;
        "
      >
        <div style="text-align:center;margin-bottom:24px;">
          <h1
            style="
              margin:0;
              color:#f58220;
              font-size:28px;
            "
          >
            DVOC Institute
          </h1>

          <p
            style="
              margin:5px 0 0;
              color:#667085;
            "
          >
            E-Learning Platform
          </p>
        </div>

        <h2 style="color:#17233d;">
          Reset Your Password
        </h2>

        <p>Hello ${displayName},</p>

        <p>
          We received a request to reset the password
          for your DVOC student account.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <div style="margin:28px 0;text-align:center;">
          <a
            href="${resetLink}"
            style="
              display:inline-block;
              padding:13px 22px;
              border-radius:8px;
              color:#ffffff;
              background:#f58220;
              text-decoration:none;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This password reset link will expire in
          <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request this password reset,
          you can safely ignore this email.
        </p>

        <hr
          style="
            margin:25px 0;
            border:none;
            border-top:1px solid #e4e7ec;
          "
        />

        <p
          style="
            margin:0;
            color:#667085;
            font-size:12px;
          "
        >
          © ${new Date().getFullYear()} DVOC Institute.
          All rights reserved.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your DVOC account password",
      html: emailHtml,
      text:
        `Reset your DVOC password using this link: ${resetLink}. ` +
        "The link expires in 15 minutes.",
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send the password reset link.",
    });
  }
});

/* =====================================
   RESET PASSWORD
===================================== */

app.post(
  "/reset-password/:token",
  async (req, res) => {
    try {
      const token = String(
        req.params.token || ""
      ).trim();

      const password = String(
        req.body.password || ""
      );

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Reset token is missing.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters.",
        });
      }

      const hashedResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      /*
        First try the secure hashed token.
      */

      let user = await User.findOne({
        resetToken: hashedResetToken,

        resetTokenExpiry: {
          $gt: Date.now(),
        },
      });

      /*
        Compatibility with reset links created
        by the older server.js, where the raw
        token may have been stored.
      */

      if (!user) {
        user = await User.findOne({
          resetToken: token,

          resetTokenExpiry: {
            $gt: Date.now(),
          },
        });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          message:
            "The reset link is invalid or has expired.",
        });
      }

      user.password = await bcrypt.hash(
        password,
        10
      );

      user.resetToken = null;
      user.resetTokenExpiry = null;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully. You can now log in.",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to reset password.",
      });
    }
  }
);

/* =====================================
   COURSE ROUTES
===================================== */

/*
  Admin course management:

  GET    /api/admin/courses
  GET    /api/admin/courses/:id
  POST   /api/admin/courses
  PUT    /api/admin/courses/:id
  DELETE /api/admin/courses/:id
*/

app.use(
  "/api/admin/courses",
  courseRoutes
);

/*
  Public course catalogue:

  GET /api/courses
  GET /api/courses/:id
*/

app.use(
  "/api/courses",
  courseRoutes
);

/* =====================================
   CATEGORY ROUTES
===================================== */

app.use(
  "/api/admin/categories",
  categoryRoutes
);

/*
  Optional public categories endpoint.
*/

app.use(
  "/api/categories",
  categoryRoutes
);

/* =====================================
   CHAPTER ROUTES
===================================== */

app.use(
  "/api/admin/chapters",
  chapterRoutes
);

/*
  This public endpoint lets CourseLearning.jsx
  load course lessons without using an admin URL.
*/

app.use(
  "/api/chapters",
  chapterRoutes
);

/* =====================================
   ADMIN USER ROUTES
===================================== */

app.use(
  "/api/admin/users",
  userRoutes
);

/* =====================================
   404 API HANDLER
===================================== */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message:
      `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =====================================
   GLOBAL ERROR HANDLER
===================================== */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    if (
      error.message?.startsWith(
        "CORS blocked"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "ValidationError") {
      const validationMessages =
        Object.values(error.errors).map(
          (validationError) =>
            validationError.message
        );

      return res.status(400).json({
        success: false,
        message:
          validationMessages.join(" "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A record with this information already exists.",
      });
    }

    return res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });
  }
);

/* =====================================
   DATABASE EVENTS
===================================== */

mongoose.connection.on(
  "connected",
  () => {
    console.log(
      "Mongoose connected to MongoDB."
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.warn(
      "MongoDB connection disconnected."
    );
  }
);

/* =====================================
   DATABASE AND SERVER
===================================== */

const PORT =
  Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file."
      );
    }

    console.log(
      "Connecting to MongoDB..."
    );

    const connection =
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
      `Database: ${connection.connection.name}`
    );

    app.listen(PORT, () => {
      console.log(
        `DVOC server running on http://localhost:${PORT}`
      );

      console.log(
        `Health check: http://localhost:${PORT}/api/health`
      );

      console.log(
        `Register API: http://localhost:${PORT}/api/auth/register`
      );

      console.log(
        `Login API: http://localhost:${PORT}/api/auth/login`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    if (
      error.code === "ECONNREFUSED" ||
      String(error.message).includes(
        "querySrv"
      )
    ) {
      console.error("");

      console.error(
        "MongoDB Atlas DNS lookup failed."
      );

      console.error(
        "Check your internet connection, DNS settings, Atlas IP access and MONGO_URI."
      );
    }

    process.exit(1);
  }
};

/* =====================================
   GRACEFUL SHUTDOWN
===================================== */

const shutdownServer = async (
  signal
) => {
  console.log(
    `\n${signal} received. Closing MongoDB connection...`
  );

  try {
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Shutdown error:",
      error.message
    );

    process.exit(1);
  }
};

process.on("SIGINT", () =>
  shutdownServer("SIGINT")
);

process.on("SIGTERM", () =>
  shutdownServer("SIGTERM")
);

startServer();