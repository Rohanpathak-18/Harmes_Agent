import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { resendVerification, verifyEmail } from "../../api/auth";
import useAuthStore from "../../store/authStore";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const setUser = useAuthStore((state) => state.setUser);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (!email) {
      toast.error("Verification email is missing.");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) return;
    try {
      setLoading(true);
      const response = await verifyEmail({ email, otp });
      const user = response?.user || response?.data?.user;
      if (user) setUser(user);
      toast.success("Email verified. Welcome to Hermes.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "That code could not be verified. Check it and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || seconds > 0 || resending) return;
    try {
      setResending(true);
      await resendVerification(email);
      setOtp("");
      setSeconds(45);
      toast.success("A new verification code was sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="verify-page">
      <header className="verify-brand" aria-label="Hermes">
        <span className="verify-brand-mark">H</span>
        <span className="verify-brand-copy"><strong>HERMES</strong><small>CONTENT OPERATING SYSTEM</small></span>
      </header>

      <section className="verify-card" aria-labelledby="verify-title">
        <Link to="/register" className="verify-back"><ArrowLeft size={16} /> Back to registration</Link>
        <div className="verify-icon"><Mail size={25} /></div>
        <div className="verify-kicker"><span /> ACCOUNT SECURITY</div>
        <h1 id="verify-title">Check your inbox</h1>
        <p className="verify-description">Enter the six-digit code we sent to the address below to verify your account.</p>

        <div className="verify-recipient">
          <span className="verify-recipient-icon"><Mail size={16} /></span>
          <span className="verify-recipient-copy"><small>CODE SENT TO</small><strong>{email}</strong></span>
          <Check className="verify-recipient-check" size={17} />
        </div>

        <form className="verify-form" onSubmit={handleSubmit}>
          <label htmlFor="verification-code">Verification code</label>
          <input
            id="verification-code"
            className="verify-code-input"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            aria-describedby="verify-code-help"
            autoFocus
          />
          <span id="verify-code-help" className="verify-code-help">The code expires 10 minutes after it was sent.</span>
          <button className="verify-submit" type="submit" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying…" : "Verify email"}<ShieldCheck size={17} />
          </button>
        </form>

        <div className="verify-resend">
          <span>Didn’t receive it?</span>
          {seconds > 0 ? (
            <span className="verify-countdown">Resend in <strong>0:{String(seconds).padStart(2, "0")}</strong></span>
          ) : (
            <button type="button" onClick={handleResend} disabled={resending}>{resending ? "Sending…" : "Resend code"}</button>
          )}
        </div>

        <aside className="verify-inbox-tip">
          <strong>Not in your inbox?</strong>
          <span>Check Spam, Promotions, or All Mail. Make sure you entered the right email address before requesting another code.</span>
        </aside>
        <footer className="verify-footer">Already verified? <Link to="/login">Sign in</Link></footer>
      </section>
      <p className="verify-privacy">Your account stays protected while you verify your email.</p>
    </main>
  );
};

export default VerifyEmail;
