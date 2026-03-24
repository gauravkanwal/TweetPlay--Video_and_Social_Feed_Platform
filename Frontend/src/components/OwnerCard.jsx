import { useState } from "react";
import { API } from "../api/axios";
import Avatar from "./Avatar";

const OwnerCard = ({ owner }) => {
  const [isSubscribed, setIsSubscribed] = useState(owner.isSubscribed);
  const [subCount, setSubCount] = useState(owner.subscribersCount);
  const [loading, setLoading] = useState(false);

  const toggleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await API.post(`/subscriptions/toggle/${owner._id}`);
      setIsSubscribed((prev) => !prev);
      setSubCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-3 py-4 border-t border-b border-white/[0.06]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Left — avatar + name */}
      <div className="flex items-center gap-3">
        <Avatar src={owner.avatar} alt={owner.fullName} size={44} />
        <div className="flex flex-col">
          <span
            className="text-[14px] font-bold text-[#f2f2f4] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {owner.fullName}
          </span>
          <span className="text-[12px] text-[#5a5a6e]">
            @{owner.username} · {subCount} subscriber{subCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Subscribe button */}
      <button
        onClick={toggleSubscribe}
        disabled={loading}
        className={`h-9 px-5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-150 flex-shrink-0
          ${isSubscribed
            ? "bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] hover:border-red-500/40 hover:text-red-400"
            : "bg-[#e85d2f] hover:bg-[#d4512a] text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {loading ? "..." : isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
};

export default OwnerCard;