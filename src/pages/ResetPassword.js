import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import "../css/Reset.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordRules = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[A-Za-z]/.test(password),
    matches:
      confirmPassword.length > 0 &&
      password === confirmPassword,
  };

  const handleReset = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "The password reset link is invalid or incomplete."
      );
      return;
    }

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      setError(
        "Password must contain at least one letter."
      );
      return;
    }

    if (!/\d/.test(password)) {
      setError(
        "Password must contain at least one number."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            "Password updated successfully. Redirecting to login..."
        );

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 2500);
      } else {
        setError(
          data.message ||
            "Unable to reset your password."
        );
      }
    } catch (requestError) {
      console.error(
        "Reset password error:",
        requestError
      );

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reset-page">
      <section className="reset-card">
        <img
          src="/dvoc.png"
          alt="DVOC Institute"
          className="reset-logo"
        />

        <span className="reset-label">
          DVOC Student Account
        </span>

        <h1>Create New Password</h1>

        <p className="reset-subtitle">
          Create a secure password for your DVOC
          learning account. Use a combination of letters
          and numbers.
        </p>

        {error && (
          <div
            className="reset-error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="reset-success-message"
            role="status"
          >
            <FaCheckCircle />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="reset-form-group">
            <label htmlFor="new-password">
              New Password
            </label>

            <div className="reset-password-wrapper">
              <FaLock className="reset-password-icon" />

              <input
                id="new-password"
                type={
                  showPassword ? "text" : "password"
                }
                placeholder="Enter new password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                className="reset-eye-button"
                onClick={() =>
                  setShowPassword(
                    (previousValue) => !previousValue
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <div className="reset-form-group">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="reset-password-wrapper">
              <FaLock className="reset-password-icon" />

              <input
                id="confirm-password"
                type={
                  showConfirm ? "text" : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                }}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                className="reset-eye-button"
                onClick={() =>
                  setShowConfirm(
                    (previousValue) => !previousValue
                  )
                }
                aria-label={
                  showConfirm
                    ? "Hide confirmed password"
                    : "Show confirmed password"
                }
              >
                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <div className="reset-password-rules">
            <p>Password requirements</p>

            <div
              className={
                passwordRules.minLength
                  ? "reset-rule valid"
                  : "reset-rule"
              }
            >
              <FaCheckCircle />
              At least 6 characters
            </div>

            <div
              className={
                passwordRules.hasLetter
                  ? "reset-rule valid"
                  : "reset-rule"
              }
            >
              <FaCheckCircle />
              At least one letter
            </div>

            <div
              className={
                passwordRules.hasNumber
                  ? "reset-rule valid"
                  : "reset-rule"
              }
            >
              <FaCheckCircle />
              At least one number
            </div>

            <div
              className={
                passwordRules.matches
                  ? "reset-rule valid"
                  : "reset-rule"
              }
            >
              <FaCheckCircle />
              Both passwords match
            </div>
          </div>

          <button
            type="submit"
            className="reset-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="reset-button-loader"></span>
                Updating Password...
              </>
            ) : (
              <>
                <FaShieldAlt />
                Reset Password
              </>
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="reset-back-login"
        >
          <FaArrowLeft />
          Back to Student Login
        </Link>
      </section>
    </main>
  );
}

export default ResetPassword;