import { useState } from "react";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const handleLogout = async () => {
    setBusy(true);
    try { await logout(); navigate("/login", { replace: true }); toast.success("You have been signed out"); }
    catch { toast.error("Could not sign out. Please try again."); }
    finally { setBusy(false); }
  };
  return <div className="page-shell">
    <div className="page-header"><div><div className="eyebrow">WORKSPACE</div><h1>Settings</h1><p>Manage your account access and session.</p></div></div>
    <div className="settings-grid">
      <Card className="settings-card"><div className="settings-card-title"><UserRound size={18} /><h2>Account</h2></div><dl className="settings-fields"><div><dt>Name</dt><dd>{user?.name || "—"}</dd></div><div><dt>Email</dt><dd>{user?.email || "—"}</dd></div><div><dt>Email verification</dt><dd>{user?.isEmailVerified ? "Verified" : "Not verified"}</dd></div></dl></Card>
      <Card className="settings-card"><div className="settings-card-title"><ShieldCheck size={18} /><h2>Session</h2></div><p className="settings-description">Your sign-in session is protected by an HTTP-only cookie. Signing out revokes this session on the server.</p><Button variant="danger" onClick={handleLogout} loading={busy}><LogOut size={16} /> Sign out</Button></Card>
    </div>
  </div>;
}
