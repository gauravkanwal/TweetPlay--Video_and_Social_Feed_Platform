// Uploader.jsx
import { useState } from "react";
import { API } from "../api/axios";
import VideoUploader from "../components/VideoUploader";
import TweetUploader from "../components/TweetUploader";
import { useNavigate } from "react-router-dom";
const Uploader = () => {
  const [tab, setTab] = useState("video");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate=useNavigate();
  const tabs = [
    {
      id: "video",
      label: "Video",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      ),
    },
    {
      id: "tweet",
      label: "Tweet",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  const handleVideoSubmit = async (formData) => {
    setLoading(true);
    setSuccessMsg("");
    try {
        console.log(formData);
        await API.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Video uploaded successfully!");
      navigate("/");
    } catch (err) {
      setSuccessMsg(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetSubmit = async ({ content }) => {
    setLoading(true);
    setSuccessMsg("");
    try {
      await API.post("/tweets", { content });
      setSuccessMsg("Tweet posted successfully!");
      navigate("/");
    } catch (err) {
      setSuccessMsg(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0b0b10] flex items-start justify-center p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-[520px]">
        <div className="mb-6">
          <h1
            className="text-[22px] font-extrabold text-[#f2f2f4] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Create
          </h1>
          <p className="text-[13px] text-[#5a5a6e] mt-0.5">Share a video or post a tweet</p>
        </div>

        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-[#13131a] rounded-xl">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSuccessMsg(""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  tab === t.id
                    ? "bg-[#0f0f14] text-[#f2f2f4] border border-white/[0.06]"
                    : "text-[#5a5a6e] hover:text-[#9999aa]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {successMsg && (
            <div className={`mb-5 text-[12px] px-3 py-2 rounded-lg border ${
              successMsg.startsWith("Error")
                ? "text-[#e85d2f] bg-[#e85d2f]/10 border-[#e85d2f]/20"
                : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            }`}>
              {successMsg}
            </div>
          )}

          {tab === "video" && <VideoUploader onSubmit={handleVideoSubmit} loading={loading} />}
          {tab === "tweet" && <TweetUploader onSubmit={handleTweetSubmit} loading={loading} />}
        </div>
      </div>
    </div>
  );
};

export default Uploader;