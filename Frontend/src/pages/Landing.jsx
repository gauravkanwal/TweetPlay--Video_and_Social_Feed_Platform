// pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
  
const NAV_LINKS = [
  { label: "Get Started", primary: true },
  { label: "Login", primary: false },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    title: "Share What Matters",
    items: [
      "Upload and manage your videos effortlessly",
      "Post quick thoughts like tweets",
      "Build your own content space",
    ],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Be Part of the Conversation",
    items: [
      "Like and interact with both videos and posts",
      "Comment on videos and join discussions",
      "Follow creators you enjoy",
    ],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "Control Your Experience",
    items: [
      "Save videos into custom playlists",
      "Revisit your watch history anytime",
      "Keep everything organized your way",
    ],
  },
];

const STATS = [
  { value: "10K+", label: "Creators" },
  { value: "50K+", label: "Videos" },
  { value: "200K+", label: "Conversations" },
];

export default function Landing() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users straight to home
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home", { replace: true });
    }
  }, [user, isLoading]);

  return (
    <div
      className="min-h-screen bg-[#0b0b10] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Navbar ── */}
      <nav className="w-full h-[60px] border-b border-white/[0.06] flex items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-2">
          <img src="/TweetPlay_logo.png" alt="TweetPlay" className="w-8 h-8 rounded-lg object-contain" />
          <span
            className="text-[20px] font-extrabold tracking-tight text-[#f2f2f4]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            TweetPlay
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth?tab=login")}
            className="h-8 px-4 rounded-full text-[13px] font-medium text-[#9999aa] hover:text-[#f2f2f4] transition-colors duration-150"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth?tab=register")}
            className="h-8 px-4 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-bold transition-all duration-150"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 w-fit">
            <span className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-[12px] font-medium text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Now live — join the community
            </span>
          </div>

          <h1
            className="text-[40px] sm:text-[52px] font-extrabold leading-[1.1] tracking-tight text-[#f2f2f4]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Where videos meet{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #e85d2f, #f59e0b)" }}>
              conversations.
            </span>
          </h1>

          <p className="text-[16px] text-[#5a5a6e] leading-relaxed max-w-md">
            A feed where videos aren't just watched — they're talked about. Upload, share, tweet, and connect with creators you love.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/auth?tab=register")}
              className="h-11 px-6 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[14px] font-bold transition-all duration-150 flex items-center gap-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Register Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/auth?tab=login")}
              className="h-11 px-6 rounded-full bg-[#1a1a22] border border-white/[0.07] hover:border-white/20 text-[#c8c8d4] text-[14px] font-medium transition-all duration-150"
            >
              Sign in
            </button>
          </div>

          {/* Stats */}
          {/* <div className="flex items-center gap-6 pt-2">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-[22px] font-extrabold text-[#f2f2f4]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.value}
                </span>
                <span className="text-[12px] text-[#3d3d47]">{s.label}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right — hero visual */}
        <div className="flex-1 w-full max-w-lg">
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#0f0f14] border border-white/[0.06] overflow-hidden">
            {/* Fake UI mockup */}
            <div className="absolute inset-0 flex flex-col">
              {/* Mock navbar */}
              <div className="h-10 border-b border-white/[0.06] flex items-center px-4 gap-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#e85d2f]/60" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <div className="flex-1 mx-4 h-5 rounded-full bg-white/[0.04] border border-white/[0.06]" />
              </div>

              {/* Mock content */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                {/* Mock tabs */}
                <div className="flex gap-4 border-b border-white/[0.06] pb-2">
                  <div className="h-3 w-12 rounded bg-orange-500/60" />
                  <div className="h-3 w-12 rounded bg-white/[0.06]" />
                </div>

                {/* Mock video grid */}
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-[#1a1a22] border border-white/[0.04] overflow-hidden flex flex-col gap-1.5 p-1.5">
                      <div
                        className="w-full aspect-video rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${
                            ["#e85d2f22","#f59e0b22","#8b5cf622","#06b6d422","#10b98122","#e85d2f22"][i]
                          } 0%, #1a1a22 100%)`
                        }}
                      />
                      <div className="h-2 w-3/4 rounded bg-white/[0.06]" />
                      <div className="h-1.5 w-1/2 rounded bg-white/[0.04]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #e85d2f, transparent)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <span className="text-[12px] font-bold text-orange-500 uppercase tracking-widest">Features</span>
          <h2
            className="text-[30px] sm:text-[36px] font-extrabold text-[#f2f2f4] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            What You Can Do on TweetPlay
          </h2>
          <p className="text-[14px] text-[#5a5a6e] max-w-md mx-auto">
            Everything you need to create, connect, and explore — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-[#0f0f14] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/15 transition-colors duration-200">
                {f.icon}
              </div>

              <div className="flex flex-col gap-3">
                <h3
                  className="text-[16px] font-extrabold text-[#f2f2f4] tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {f.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px] text-[#9999aa]">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
        <div
          className="relative rounded-2xl p-10 sm:p-14 overflow-hidden border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-8"
          style={{ background: "linear-gradient(135deg, #0f0f14 0%, #1a0f0a 100%)" }}
        >
          {/* Glow blob */}
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #e85d2f, transparent)" }}
          />

          <div className="flex flex-col gap-3 relative">
            <h2
              className="text-[26px] sm:text-[32px] font-extrabold text-[#f2f2f4] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to join TweetPlay?
            </h2>
            <p className="text-[14px] text-[#5a5a6e] max-w-sm">
              Start sharing videos and joining conversations today. It's free.
            </p>
          </div>

          <button
            onClick={() => navigate("/auth?tab=register")}
            className="flex-shrink-0 h-12 px-8 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[15px] font-bold transition-all duration-150 flex items-center gap-2 relative"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Get Started Free
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 sm:px-10 py-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <img src="/TweetPlay_logo.png" alt="TweetPlay" className="w-6 h-6 rounded object-contain" />
          <span className="text-[13px] font-bold text-[#3d3d47]" style={{ fontFamily: "'Syne', sans-serif" }}>
            TweetPlay
          </span>
        </div>
        <p className="text-[12px] text-[#3d3d47]">© {new Date().getFullYear()} TweetPlay. All rights reserved.</p>
      </footer>
    </div>
  );
}