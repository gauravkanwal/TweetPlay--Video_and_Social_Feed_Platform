import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import { API } from "../api/axios";

const Navbar = () => {
  const { user, isLoading, setUser } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setMobileSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await API.post("/users/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/auth");
    } catch (err) {
      console.error(err);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (isLoading) return (
    <nav className="w-full h-[60px] bg-[#0f0f14] border-b border-white/[0.06]" />
  );

  return (
    <nav
      className="w-full h-[60px] bg-[#0f0f14] border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-7 gap-3 sm:gap-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Logo */}
      <Link
        to="/"
        className={`flex h-full items-center justify-center flex-shrink-0 no-underline transition-opacity duration-200 ${
          mobileSearchOpen
            ? "opacity-0 pointer-events-none w-0 overflow-hidden"
            : "opacity-100"
        } sm:opacity-100 sm:pointer-events-auto sm:w-auto sm:overflow-visible`}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-full flex justify-center flex-shrink-0">
          <img
            src="/TweetPlay_logo.png"
            alt="TweetPlay"
            className="w-full h-full rounded-lg object-contain"
          />
        </div>
        <span
          className="hidden sm:block text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#f2f2f4] ml-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          TweetPlay
        </span>
      </Link>

      {/* Search — desktop & tablet */}
      <div className="hidden sm:flex flex-1 max-w-[420px] relative items-center">
        <div className="absolute left-3 pointer-events-none z-10">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke={focused ? "#e85d2f" : "#4a4a57"}
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search videos...."
          className={`w-full h-9 rounded-full pl-9 pr-9 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none transition-all duration-200
            ${
              focused
                ? "bg-[#1e1e28] border border-orange-500/40 shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
                : "bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14]"
            }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {query.trim() && (
          <button
            onClick={handleSearch}
            className="absolute right-3 text-[#4a4a57] hover:text-orange-400 transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Search — mobile toggle */}
      <div
        className={`sm:hidden flex items-center flex-1 transition-all duration-200 ${
          mobileSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none w-0"
        }`}
      >
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 pointer-events-none">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#e85d2f" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={mobileSearchOpen}
            onBlur={() => setMobileSearchOpen(false)}
            placeholder="Search…"
            className="w-full h-9 rounded-full pl-9 pr-9 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none bg-[#1e1e28] border border-orange-500/40 shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          {query.trim() && (
            <button
              onMouseDown={handleSearch}
              className="absolute right-3 text-orange-400"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className={`flex items-center gap-2 flex-shrink-0 ${mobileSearchOpen ? "hidden" : "flex"} sm:flex`}>
        {/* Mobile search icon */}
        <button
          className="sm:hidden w-8 h-8 rounded-full bg-[#1a1a22] border border-white/[0.07] flex items-center justify-center hover:border-white/[0.14] transition-all duration-200"
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Open search"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#4a4a57" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Profile pill + dropdown */}
        <div className="relative" ref={menuRef}>
          <div className="flex items-center gap-2 bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14] hover:bg-[#1e1e28] rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer transition-all duration-200">
            <Avatar src={user.avatar} alt={user.username} username={user.username} size={28} />
            <span
              className="hidden sm:block text-[12px] font-bold text-[#c8c8d4] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {user.username}
            </span>
            {/* Chevron — clicking this opens the menu */}
            <button
              onClick={() => setProfileMenuOpen((p) => !p)}
              className="hidden sm:flex items-center justify-center w-4 h-4 text-[#4a4a57] hover:text-[#9999aa] transition-colors duration-150"
              aria-label="Profile menu"
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {/* Mobile — whole pill opens menu */}
            <button
              onClick={() => setProfileMenuOpen((p) => !p)}
              className="sm:hidden absolute inset-0 rounded-full"
              aria-label="Profile menu"
            />
          </div>

          {/* Dropdown menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 top-11 w-44 bg-[#1a1a22] border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-xl">
              {/* User info header */}
              <div className="px-3 py-2.5 border-b border-white/[0.06]">
                <p className="text-[12px] font-bold text-[#f2f2f4] truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {user.fullName}
                </p>
                <p className="text-[11px] text-[#3d3d47] truncate">@{user.username}</p>
              </div>

              {/* My Profile */}
              <button
                onClick={() => { setProfileMenuOpen(false); navigate(`/profile/${user.username}`); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#c8c8d4] hover:bg-white/[0.05] transition-colors duration-150"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                My profile
              </button>

              <div className="border-t border-white/[0.06]" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {logoutLoading ? "Logging out…" : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;