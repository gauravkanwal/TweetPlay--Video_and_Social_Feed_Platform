import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import VideoCard from "../components/VideoCard";

const ShowPlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/playlists/${playlistId}`);
        setPlaylist(res.data.data);
      } catch (err) {
        setError("Failed to load playlist.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [playlistId]);

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
      <p className="text-[13px] text-[#e85d2f]">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-7 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5a5a6e] hover:text-[#f2f2f4] transition-colors duration-150 mb-6 text-[13px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8 pb-6 border-b border-white/[0.06]">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a22] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-[#3d3d47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-[22px] font-extrabold text-[#f2f2f4] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-[13px] text-[#5a5a6e] mt-1">{playlist.description}</p>
            )}
            <p className="text-[12px] text-[#3d3d47] mt-1.5">
              {playlist.videos?.length ?? 0} video{playlist.videos?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Videos grid */}
        {!playlist.videos?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="w-12 h-12 text-[#2a2a35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            <p className="text-[14px] font-bold text-[#f2f2f4]" style={{ fontFamily: "'Syne', sans-serif" }}>No videos in this playlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {playlist.videos.map((video, i) => (
              <div key={video._id} className="animate-[fadeUp_0.4s_ease_both]" style={{ animationDelay: `${i * 60}ms` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ShowPlaylist;