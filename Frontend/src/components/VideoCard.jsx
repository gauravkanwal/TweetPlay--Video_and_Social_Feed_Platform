import { useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

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

function formatDuration(seconds) {
  seconds = Math.floor(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

const VideoCard = ({ video }) => {
  const [hovered, setHovered] = useState(false);

  return (
      <div
        className="w-full group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Thumbnail */}
        <Link to={`/watch/${video._id}`} className="no-underline">
        <div className="relative w-full aspect-video rounded-xl cursor-pointer overflow-hidden bg-neutral-900">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-105 brightness-90"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300"
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                className="w-0 h-0 ml-1"
                style={{
                  borderStyle: "solid",
                  borderWidth: "8px 0 8px 14px",
                  borderColor: "transparent transparent transparent white",
                }}
              />
            </div>
          </div>

          {/* Duration badge */}
          {video.duration && <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium tracking-wide px-2 py-0.5 rounded border border-white/10">
            {formatDuration(video.duration)}
          </span>
          }
        </div>
        </Link>

        {/* Info */}
        <div className="flex gap-3 mt-3.5">
          {/* Avatar */}
          <Avatar src={video.owner.avatar} username={video.owner.username}/>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-bold leading-snug line-clamp-2 text-neutral-100 group-hover:text-white transition-colors duration-200 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {video.title}
            </h3>

            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11.5px] text-orange-500 font-medium">
                @{video.owner.username}
              </span>
              <div className="w-0.5 h-0.5 rounded-full bg-neutral-600" />
              <span className="text-[11.5px] text-neutral-500">
                {video.views} views · {timeAgo(video.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default VideoCard;
