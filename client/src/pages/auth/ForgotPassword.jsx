import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Mail,
} from "lucide-react";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import {
  forgotPassword,
} from "../../api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!email) {
      toast.error(
        "Please enter your email."
      );

      return;
    }

    try {
      setLoading(true);

      await forgotPassword({
        email,
      });

      toast.success(
        "If the account exists, a reset code has been sent."
      );

      navigate(
        `/reset-password?email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to process the request.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <div className="brand-mark">
              H
            </div>

            <span>HERMES</span>
          </div>

          <div className="auth-hero">
            <span className="eyebrow">
              SECURE ACCESS
            </span>

            <h1>
              Get back to
              <br />
              <em>your workspace.</em>
            </h1>

            <p>
              Hermes protects your workspace
              through controlled authentication
              and session management.
            </p>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrapper">
          <div className="mobile-auth-logo">
            <div className="brand-mark">
              H
            </div>

            <span>HERMES</span>
          </div>

          <Link
            to="/login"
            className="back-link"
          >
            <ArrowLeft size={15} />
            Back to sign in
          </Link>

          <div
            className="auth-heading"
            style={{
              marginTop: 28,
            }}
          >
            <div className="auth-icon">
              <Mail size={20} />
            </div>

            <h2>
              Forgot your password?
            </h2>

            <p>
              Enter your account email and
              we'll send you a verification
              code to continue.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>

            <Button
              type="submit"
              loading={loading}
              className="auth-submit"
            >
              Send reset code
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="auth-footer">
            Remember your password?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;