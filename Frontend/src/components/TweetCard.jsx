import { useState } from "react";
import Avatar from "./Avatar";
const TweetCard = ({ tweet }) => {
  const [liked, setLiked] = useState(tweet.liked || false);
  const [likeCount, setLikeCount] = useState(tweet.numberOfLikes || 0);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatLikes = (n) =>
    n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();

  function timeAgo(inputTime) {
  console.log(inputTime);
  
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

  return (
    <div
      className="group w-full bg-[#14141a] border border-white/6 hover:border-white/11 hover:bg-white/[0.02] rounded-2xl px-5 py-[18px] flex gap-3 cursor-pointer transition-all duration-200"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Avatar */}
      <Avatar src={tweet.owner.avatar}/>

      {/* Body */}
      <div className="flex-1 min-w-0">

        {/* Top row */}
        <div className="flex items-baseline gap-1.5 mb-1.5 flex-wrap">
          <span
            className="text-[14px] font-bold text-[#f0f0f2] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {tweet.owner.fullName}
          </span>

          <span className="text-[12px] text-[#4a4a57]">{tweet.owner.username}</span>
          <div className="w-0.5 h-0.5 rounded-full bg-[#2e2e3a] mb-0.5" />
          <span className="text-[12px] text-[#4a4a57]">{timeAgo(tweet.createdAt)}</span>
        </div>

        {/* Content */}
        <p className="text-[13.5px] text-[#c8c8d0] leading-relaxed break-words">
          {tweet.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-5 mt-3.5">

          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200 group/like
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
            <span>{formatLikes(tweet.likes)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;