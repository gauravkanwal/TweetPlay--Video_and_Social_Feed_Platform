import { useState } from "react";

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

  return (
    <div
      className="group w-full bg-[#14141a] border border-white/6 hover:border-white/11 hover:bg-white/[0.02] rounded-2xl px-5 py-[18px] flex gap-3 cursor-pointer transition-all duration-200"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Avatar */}
      <img
        src={tweet.avatar}
        alt={tweet.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-[#1e1e28] transition-colors duration-250 group-hover:border-orange-500 mt-0.5"
      />

      {/* Body */}
      <div className="flex-1 min-w-0">

        {/* Top row */}
        <div className="flex items-baseline gap-1.5 mb-1.5 flex-wrap">
          <span
            className="text-[14px] font-bold text-[#f0f0f2] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {tweet.username}
          </span>

          <span className="text-[12px] text-[#4a4a57]">{tweet.handle}</span>
          <div className="w-0.5 h-0.5 rounded-full bg-[#2e2e3a] mb-0.5" />
          <span className="text-[12px] text-[#4a4a57]">{tweet.time}</span>
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
            <span>{formatLikes(likeCount)}</span>
          </button>

          {/* Comment */}
          <button className="flex items-center gap-1.5 text-[12px] text-[#4a4a57] hover:text-[#9b9ba8] transition-colors duration-200 group/btn">
            <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{tweet.numberOfComments ?? 0}</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default TweetCard;