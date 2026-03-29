import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="w-[200px] flex-shrink-0 bg-[#14141a] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.02] rounded-2xl p-3 flex flex-col gap-3 cursor-pointer transition-all duration-200"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Icon */}
      <div className="w-full aspect-video rounded-xl bg-[#1a1a22] border border-white/[0.06] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#3d3d47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3
          className="text-[13px] font-bold text-[#f2f2f4] truncate tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {playlist.name}
        </h3>
        <span className="text-[11px] text-[#3d3d47]">{formatDate(playlist.createdAt)}</span>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Avatar src={playlist.owner?.avatar} alt={playlist.owner?.fullName} size={18} />
        <span className="text-[11px] font-bold text-[#9999aa] truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
          {playlist.owner?.fullName}
        </span>
        <span className="text-[10px] text-[#3d3d47] truncate flex-shrink-0">@{playlist.owner?.username}</span>
      </div>
    </div>
  );
};

export default PlaylistCard;