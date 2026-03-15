import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <nav
      className="w-full h-[60px] bg-[#0f0f14] border-b border-white/[0.06] flex items-center justify-between px-7 gap-5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        <span
          className="text-[19px] font-extrabold tracking-tight text-[#f2f2f4]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          TweetPlay
        </span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-[420px] relative flex items-center">
        <div className="absolute left-3 pointer-events-none">
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
          className={`w-full h-9 rounded-full pl-9 pr-16 text-[13px] text-[#c8c8d4] placeholder:text-[#3d3d50] outline-none transition-all duration-200
            ${focused
              ? "bg-[#1e1e28] border border-orange-500/40"
              : "bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.12]"
            }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />

      </div>

      {/* Profile pill */}
      <div className="flex-shrink-0 flex items-center gap-2 bg-[#1a1a22] border border-white/[0.07] hover:border-white/[0.14] hover:bg-[#1e1e28] rounded-full pl-1 pr-3 py-1 cursor-pointer transition-all duration-200">
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          GD
        </div>
        <span
          className="text-[12px] font-bold text-[#c8c8d4] tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          gaurav_dev
        </span>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#4a4a57" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;