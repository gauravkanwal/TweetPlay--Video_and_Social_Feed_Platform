import { useState } from "react";
import { API } from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";

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

const TweetCard = ({ tweet, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user._id === tweet.owner._id;

  const [liked, setLiked] = useState(tweet.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(tweet.likes ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatLikes = (n) =>
    n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await API.post(`/likes/toggle/t/${tweet._id}`);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    setDeleteLoading(true);
    try {
      await API.delete(`/tweets/${tweet._id}`);
      onDelete?.(tweet._id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="group w-full bg-[#14141a] border border-white/[0.06] hover:border-white/[0.11] hover:bg-white/[0.02] rounded-2xl px-5 py-[18px] flex gap-3 cursor-pointer transition-all duration-200 relative"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Avatar src={tweet.owner.avatar} alt={tweet.owner.fullName} size={38} />

      <div className="flex-1 min-w-0">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className="text-[14px] font-bold text-[#f0f0f2] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {tweet.owner.fullName}
            </span>
            <span className="text-[12px] text-[#4a4a57]">@{tweet.owner.username}</span>
            <div className="w-0.5 h-0.5 rounded-full bg-[#2e2e3a] mb-0.5" />
            <span className="text-[12px] text-[#4a4a57]">{timeAgo(tweet.createdAt)}</span>
          </div>

          {/* 3-dot menu — owner only */}
          {isOwner && (
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((prev) => !prev); }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d3d47] hover:text-[#9999aa] hover:bg-white/[0.05] transition-all duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  {/* backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                  />
                  <div className="absolute right-0 top-8 w-36 bg-[#1a1a22] border border-white/[0.08] rounded-xl overflow-hidden z-20 shadow-xl">
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-50"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      {deleteLoading ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-[13.5px] text-[#c8c8d0] leading-relaxed break-words">
          {tweet.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-5 mt-3.5">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200 group/like disabled:opacity-50
              ${liked ? "text-orange-500" : "text-[#4a4a57] hover:text-orange-500"}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[15px] h-[15px] transition-transform duration-200 group-hover/like:scale-110"
              fill={liked ? "#f97316" : "none"}
              stroke={liked ? "#f97316" : "currentColor"}
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{formatLikes(likeCount)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;