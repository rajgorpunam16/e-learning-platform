import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../css/User.css";

function Login({
  setIsLoggedIn,
}) {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !form.email.trim() ||
      !form.password
    ) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: form.email
              .trim()
              .toLowerCase(),

            password:
              form.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      setIsLoggedIn(true);

      if (
        data.user.role === "admin"
      ) {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (requestError) {
      console.error(
        "Login error:",
        requestError
      );

      setError(
        requestError.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="auth-left">
        <img
          src="/dvoc.png"
          alt="DVOC Institute"
          className="auth-logo"
        />

        <h1>
          Welcome Back
        </h1>

        <p>
          Sign in to continue your
          DVOC learning journey.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <h2>Student Login</h2>

          <p>
            Access your courses and
            learning dashboard
          </p>

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="login-options">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            New to DVOC?{" "}

            <Link to="/register">
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;