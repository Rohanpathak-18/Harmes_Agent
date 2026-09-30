import { useState } from "react";
import { ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../api/auth";

const authHeroImage = "https://images.unsplash.com/photo-1695014192203-291edf9e4842?auto=format&fit=crop&w=1600&q=85";

const initialForm = { name: "", email: "", organization: "", password: "", confirmPassword: "" };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const organizationName = form.organization.trim();
    if (!name || !email || !organizationName) return setFormError("Fill in each field to create your workspace.");
    if (form.password.length < 8) return setFormError("Use a password with at least 8 characters.");
    if (form.password !== form.confirmPassword) return setFormError("Those passwords don't match yet.");

    setLoading(true);
    setFormError("");
    try {
      await register({ name, email, organizationName, password: form.password });
      toast.success("Your verification code is on its way.");
      navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "We couldn't create your workspace. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-visual register-visual">
        <div className="auth-visual-content">
          <Link to="/login" className="auth-brand"><span className="brand-mark">H</span><span>HERMES</span></Link>
          <div className="auth-hero">
            <span className="eyebrow">YOUR CONTENT, IN GOOD COMPANY</span>
            <h1>Make your next<br />idea <em>happen.</em></h1>
            <p>Bring research, creation, approvals and publishing together in one calm, capable workspace.</p>
          </div>
          <div className="register-art-card">
            <img src={authHeroImage} alt="A creative team collaborating around a camera on set" />
            <div className="register-art-caption"><span className="register-live-dot" /><div><strong>One workspace. Clear momentum.</strong><small>From first signal to published work.</small></div></div>
          </div>
          <div className="register-steps" aria-label="Three steps to get started"><span><b>01</b> Create workspace</span><i /><span><b>02</b> Verify email</span><i /><span><b>03</b> Start creating</span></div>
        </div>
      </section>

      <section className="auth-form-side register-form-side">
        <div className="auth-form-wrapper register-form-wrapper">
          <div className="mobile-auth-logo"><span className="brand-mark">H</span><span>HERMES</span></div>
          <header className="register-heading"><span className="eyebrow">START WITH A FRESH PAGE</span><h2>Create your workspace</h2><p>Set up your account. We'll email you a code to verify your address.</p></header>
          <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
            <div className="register-fields">
              <div className="register-field"><label htmlFor="register-name">Your name</label><div className="register-input"><UserRound size={17} /><input id="register-name" name="name" value={form.name} onChange={update} placeholder="Alex Morgan" autoComplete="name" required minLength={2} maxLength={100} disabled={loading} /></div></div>
              <div className="register-field"><label htmlFor="register-organization">Workspace name</label><div className="register-input"><Building2 size={17} /><input id="register-organization" name="organization" value={form.organization} onChange={update} placeholder="Studio North" autoComplete="organization" required maxLength={150} disabled={loading} /></div></div>
              <div className="register-field register-field-wide"><label htmlFor="register-email">Work email</label><div className="register-input"><Mail size={17} /><input id="register-email" name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" autoComplete="email" required disabled={loading} /></div></div>
              <div className="register-field"><label htmlFor="register-password">Password</label><div className="register-input"><LockKeyhole size={17} /><input id="register-password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required disabled={loading} /><button type="button" className="register-password-toggle" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              <div className="register-field"><label htmlFor="register-confirm-password">Confirm password</label><div className="register-input"><LockKeyhole size={17} /><input id="register-confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={update} placeholder="Enter it again" autoComplete="new-password" required disabled={loading} /></div></div>
            </div>

            {formError && <div className="register-error" role="alert">{formError}</div>}
            <button className="register-submit" type="submit" disabled={loading}>{loading ? <><span className="register-spinner" /> Creating your workspace…</> : <>Create account <ArrowRight size={17} /></>}</button>
            <p className="register-terms">We'll send a one-time code to verify your email address.</p>
          </form>
          <p className="auth-footer register-footer">Already have a workspace? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
