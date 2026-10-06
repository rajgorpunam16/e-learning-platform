import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "../css/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMsg("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
       `${API_BASE_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMsg(
          data.message ||
            "Password reset link sent successfully."
        );
        setEmail("");
      } else {
        setError(
          data.message ||
            "Unable to send the reset link."
        );
      }
    } catch (requestError) {
      console.error(
        "Forgot password error:",
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
    <main className="forgot-page">
      <section className="forgot-card">
        <img
          src="/dvoc.png"
          alt="DVOC Institute"
          className="forgot-logo"
        />

        <span className="forgot-label">
          DVOC Student Account
        </span>

        <h1>Forgot Password?</h1>

        <p className="forgot-subtitle">
          Enter the email address registered with your
          DVOC learning account. We will send you a secure
          password reset link.
        </p>

        {error && (
          <div className="error-msg" role="alert">
            {error}
          </div>
        )}

        {msg && (
          <div className="success-msg" role="status">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="forgot-email">
              Registered Email Address
            </label>

            <div className="forgot-input">
              <FaEnvelope />

              <input
                id="forgot-email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-loader"></span>
                Sending Reset Link...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <Link to="/login" className="back-login">
          <FaArrowLeft />
          Back to Student Login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;