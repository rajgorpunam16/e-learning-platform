import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../css/Re.css";

function Register({
  setIsLoggedIn,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: updatedValue,
    }));

    setError("");
  };

  const handleRegister = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        form.email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(
        form.phone
      )
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: `${form.firstName.trim()} ${form.lastName.trim()}`,
            email: form.email
              .trim()
              .toLowerCase(),
            phone: form.phone,
            password: form.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed."
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

      navigate("/dashboard", {
        replace: true,
      });
    } catch (requestError) {
      console.error(
        "Registration error:",
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
    <main className="register-page">
      <section className="auth-left">
        <img
          src="/dvoc.png"
          alt="DVOC Institute"
          className="auth-logo"
        />

        <h1>
          Start Your Learning Journey
        </h1>

        <p>
          Create your DVOC student
          account and access practical,
          career-focused online courses.
        </p>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>

          <p>
            Register as a DVOC student
          </p>

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
          >
            <div className="form-row">
              <div className="form-group">
                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

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
              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                name="phone"
                inputMode="numeric"
                maxLength="10"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}

            <Link to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;