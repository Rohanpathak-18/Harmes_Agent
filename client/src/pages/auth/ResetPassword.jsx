import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import {
  resetPassword,
} from "../../api/auth";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const emailFromUrl =
    searchParams.get("email") || "";

  const [form, setForm] =
    useState({
      email: emailFromUrl,
      otp: "",
      password: "",
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.email ||
      !form.otp ||
      !form.password
    ) {
      toast.error(
        "Please complete all fields."
      );

      return;
    }

    if (form.password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );

      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email: form.email,
        otp: form.otp,
        password: form.password,
      });

      toast.success(
        "Password updated successfully."
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to reset your password.";

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
              ACCOUNT RECOVERY
            </span>

            <h1>
              Secure access,
              <br />
              <em>restored.</em>
            </h1>

            <p>
              Verify your account and create a
              new password to continue.
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
              <CheckCircle2 size={20} />
            </div>

            <h2>
              Reset password
            </h2>

            <p>
              Enter the OTP sent to your
              email and choose a new password.
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
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
              />
            </label>

            <label>
              Verification code

              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                inputMode="numeric"
                maxLength={6}
              />
            </label>

            <label>
              New password

              <div className="password-input">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              loading={loading}
              className="auth-submit"
            >
              Update password
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;