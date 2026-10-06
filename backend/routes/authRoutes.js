const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

/* =====================================
   REGISTER
===================================== */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      mobile,
      password,
    } = req.body;

    const fullName =
      name ||
      `${firstName || ""} ${lastName || ""}`.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const userData = {
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      active: true,
    };

    if (User.schema.path("name")) {
      userData.name = fullName;
    }

    if (User.schema.path("fullName")) {
      userData.fullName = fullName;
    }

    if (User.schema.path("phone")) {
      userData.phone = phone || mobile || "";
    }

    if (User.schema.path("mobile")) {
      userData.mobile = mobile || phone || "";
    }

    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",

      user: {
        id: user._id,

        name:
          user.name ||
          user.fullName,

        email: user.email,

        phone:
          user.phone ||
          user.mobile ||
          "",

        role:
          user.role ||
          "student",
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

/* =====================================
   LOGIN
===================================== */

router.post("/login", async (req, res) => {
  try {
    const email = String(
      req.body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body.password || ""
    );

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      user: {
        id: user._id,

        name:
          user.name ||
          user.fullName,

        email: user.email,

        phone:
          user.phone ||
          user.mobile ||
          "",

        role:
          user.role ||
          "student",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
});

module.exports = router;