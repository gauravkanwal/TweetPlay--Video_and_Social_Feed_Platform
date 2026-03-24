import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";

const Navbar = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setMobileSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

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
            className="w-full h-full rounded-lg object-cover"
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
        {/* Search submit button */}
        {query.trim() && (
          <button
            onClick={handleSearch}
            className="absolute right-3 text-[#4a4a57] hover:text-orange-400 transition-colors duration-150"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
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
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e85d2f"
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
            autoFocus={mobileSearchOpen}
            onBlur={() => setMobileSearchOpen(false)}
            placeholder="Search…"
            className="w-full h-9 rounded-full pl-9 pr-9 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none bg-[#1e1e28] border border-orange-500/40 shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          {query.trim() && (
            <button
              onMouseDown={handleSearch} // mousedown fires before input blur
              className="absolute right-3 text-orange-400"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div
        className={`flex items-center gap-2 flex-shrink-0 ${mobileSearchOpen ? "hidden" : "flex"} sm:flex`}
      >
        {/* Mobile search icon */}
        <button
          className="sm:hidden w-8 h-8 rounded-full bg-[#1a1a22] border border-white/[0.07] flex items-center justify-center hover:border-white/[0.14] transition-all duration-200"
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Open search"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a4a57"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Profile pill */}
        <div className="flex items-center gap-2 bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14] hover:bg-[#1e1e28] rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer transition-all duration-200">
          <Avatar src={user.avatar} alt={user.username} size={28} />
          <span
            className="hidden sm:block text-[12px] font-bold text-[#c8c8d4] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {user.username}
          </span>
          <svg
            className="hidden sm:block w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a4a57"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
