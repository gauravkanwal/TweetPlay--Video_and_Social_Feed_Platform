// components/VideoInfo.jsx
import { useState } from "react";
import { API } from "../api/axios";

function timeAgo(inputTime) {
  const now = new Date();
  const past = new Date(inputTime);
  const diffMs = now - past;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

const VideoInfo = ({ videoId, title, views, createdAt, likes, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [likeLoading, setLikeLoading] = useState(false);

  const toggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await API.post(`/likes/toggle/v/${videoId}`);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Title */}
      <h1
        className="text-[18px] font-extrabold text-[#f2f2f4] leading-snug tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h1>

      {/* Views · time · like */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[13px] text-[#5a5a6e]">
          {views} view{views !== 1 ? "s" : ""} · {timeAgo(createdAt)}
        </span>

        {/* Like button */}
        <button
          onClick={toggleLike}
          disabled={likeLoading}
          className={`flex items-center gap-2 h-8 px-4 rounded-full border text-[13px] font-medium transition-all duration-150
            ${liked
              ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
              : "bg-[#1a1a22] border-white/[0.07] text-[#9999aa] hover:border-white/20 hover:text-[#f2f2f4]"
            } disabled:opacity-50`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {likeCount > 0 && <span>{likeCount}</span>}
          <span>{likeCount>1?"Likes":"Like"}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoInfo;