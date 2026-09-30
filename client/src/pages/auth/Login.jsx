import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const authHeroImage = "https://images.unsplash.com/photo-1695014192203-291edf9e4842?auto=format&fit=crop&w=1600&q=85";

import Button from "../../components/ui/Button";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      toast.success("Welcome back.");

      navigate("/");
    } catch (error) {
      const data = error.response?.data;

      if (error.response?.status === 403 && data?.requiresEmailVerification) {
        toast.success("Verify your email to continue.");

        navigate(
          `/verify-email?email=${encodeURIComponent(
            data.email || form.email.trim().toLowerCase(),
          )}`,
        );

        return;
      }

      toast.error(
        error.code === "ECONNABORTED"
          ? "The server took too long to respond. Check the server and try again."
          : data?.message || "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <section className="auth-visual login-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <div className="brand-mark">H</div>

            <span>HERMES</span>
          </div>

          <div className="auth-hero">
            <span className="eyebrow">AI CONTENT OPERATING SYSTEM</span>

            <h1>
              From signal
              <br />
              to <em>published.</em>
            </h1>

            <p>
              Research, plan, create, validate, approve and learn from your
              content through one controlled operating system.
            </p>
          </div>

          <div className="auth-image-card">
            <img
              src={authHeroImage}
              alt="A creative team collaborating around a camera on set"
            />

            <div className="auth-image-overlay">
              <span>HERMES WORKFLOW</span>
              <strong>Discover → Research → Create → Approve → Publish</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-side login-form-side">
        <div className="auth-form-wrapper login-form-wrapper">
          <div className="mobile-auth-logo">
            <div className="brand-mark">H</div>

            <span>HERMES</span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">WORKSPACE ACCESS</span>

            <h2>Sign in to Hermes</h2>

            <p>Continue managing your content operations.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <div className="auth-options">
              <span />

              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <Button type="submit" loading={loading} className="auth-submit">
              Sign in
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
