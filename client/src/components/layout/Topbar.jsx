import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Topbar = ({ onMenuClick }) => {
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
    <div className="topbar-right"><div className="user-profile"><div className="avatar">{initial}</div><div className="user-profile-text"><span>{displayName}</span><small>Workspace</small></div></div></div>
  </header>;
};

export default Topbar;
