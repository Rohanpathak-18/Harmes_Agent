import { useState } from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Topbar = ({ onMenuClick, theme, onToggleTheme }) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const displayName = user?.name || user?.fullName || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/jobs?search=${encodeURIComponent(value)}`);
  };
  return <header className="topbar">
    <div className="topbar-left">
      <button className="mobile-menu" onClick={onMenuClick} aria-label="Open navigation"><Menu size={21} /></button>
      <form className="global-search" onSubmit={submitSearch}><Search size={17} /><input type="search" placeholder="Search Hermes..." aria-label="Search Hermes" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="search-submit" type="submit">Search</button></form>
    </div>
    <div className="topbar-right">
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>
      <div className="user-profile"><div className="avatar">{initial}</div><div className="user-profile-text"><span>{displayName}</span><small>Workspace</small></div></div>
    </div>
  </header>;
};

export default Topbar;
