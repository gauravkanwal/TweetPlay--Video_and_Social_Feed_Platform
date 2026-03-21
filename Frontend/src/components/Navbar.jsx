import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {

  const {user}=useAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <nav
      className="w-full h-[60px] bg-[#0f0f14] border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-7 gap-3 sm:gap-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Logo */}
      <Link
        to="/"
        className={`flex h-full items-center justify-center flex-shrink-0 no-underline transition-opacity duration-200 ${
          mobileSearchOpen ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search videos, tweets, people…"
          className={`w-full h-9 rounded-full pl-9 pr-4 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none transition-all duration-200
            ${
              focused
                ? "bg-[#1e1e28] border border-orange-500/40 shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
                : "bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14]"
            }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
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
            autoFocus={mobileSearchOpen}
            onBlur={() => setMobileSearchOpen(false)}
            placeholder="Search…"
            className="w-full h-9 rounded-full pl-9 pr-4 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none bg-[#1e1e28] border border-orange-500/40 shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
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

        {/* Profile pill */}
        {user && (
          <div className="flex items-center gap-2 bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14] hover:bg-[#1e1e28] rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer transition-all duration-200">
            <div
              className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.username?.substring(0, 2).toUpperCase()
              )}
            </div>
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;