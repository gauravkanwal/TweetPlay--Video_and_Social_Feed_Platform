// components/VideoInfo.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import CreatePlaylist from "../pages/CreatePlaylist";

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

// ── Playlist picker modal ─────────────────────────────────────────────────────
const PlaylistPicker = ({ videoId, userId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [added, setAdded] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/playlists/user/${userId}`);
        setPlaylists(res.data.data ?? []);
      } catch (err) {
        setError("Failed to load playlists.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  const addToPlaylist = async (playlistId) => {
    setAdding(playlistId);
    try {
      await API.patch(`/playlists/${playlistId}/${ videoId }`);
      setAdded((p) => ({ ...p, [playlistId]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  const handleCreated = (newPlaylist) => {
    setPlaylists((p) => [newPlaylist, ...p]);
    setShowCreate(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-[#0f0f14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-[15px] font-extrabold text-[#f2f2f4]" style={{ fontFamily: "'Syne', sans-serif" }}>
            {showCreate ? "New playlist" : "Add to playlist"}
          </h2>
          <button
            onClick={showCreate ? () => setShowCreate(false) : onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d3d47] hover:text-[#9999aa] hover:bg-white/[0.05] transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showCreate
                ? <path d="M19 12H5M12 5l-7 7 7 7" />
                : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3 max-h-80 overflow-y-auto">
          {showCreate ? (
            <CreatePlaylist inline onCreated={handleCreated} onClose={() => setShowCreate(false)} />
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
          ) : error ? (
            <p className="text-[13px] text-[#e85d2f] text-center py-4">{error}</p>
          ) : playlists.length === 0 ? (
            <p className="text-[13px] text-[#3d3d47] text-center py-4">No playlists yet.</p>
          ) : (
            playlists.map((pl) => (
              <div
                key={pl._id}
                className="flex items-center justify-between gap-3 p-3 bg-[#14141a] border border-white/[0.06] rounded-xl hover:border-white/[0.11] transition-all duration-150"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#f2f2f4] truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {pl.name}
                  </p>
                  {pl.description && (
                    <p className="text-[11px] text-[#3d3d47] truncate">{pl.description}</p>
                  )}
                </div>
                <button
                  onClick={() => addToPlaylist(pl._id)}
                  disabled={!!adding || added[pl._id]}
                  className={`flex-shrink-0 h-7 px-3 rounded-full text-[11px] font-bold transition-all duration-150
                    ${added[pl._id]
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "bg-[#e85d2f] hover:bg-[#d4512a] text-white"
                    } disabled:opacity-50`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {adding === pl._id ? "Adding…" : added[pl._id] ? "Added ✓" : "Add"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Create new playlist button */}
        {!showCreate && (
          <div className="px-5 pb-4">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full h-9 rounded-xl border border-dashed border-white/[0.1] hover:border-orange-500/40 text-[13px] text-[#5a5a6e] hover:text-orange-400 flex items-center justify-center gap-2 transition-all duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── VideoInfo ─────────────────────────────────────────────────────────────────
const VideoInfo = ({ videoId, ownerId, title, views, createdAt, likes, isLiked }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user._id === ownerId;

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [likeLoading, setLikeLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const handleDelete = async () => {
    setMenuOpen(false);
    setDeleteLoading(true);
    try {
      await API.delete(`/videos/${videoId}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 pt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h1
            className="text-[18px] font-extrabold text-[#f2f2f4] leading-snug tracking-tight flex-1"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {title}
          </h1>

          {/* 3-dot menu */}
          <div className="relative flex-shrink-0 mt-1" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d3d47] hover:text-[#9999aa] hover:bg-white/[0.05] transition-all duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 w-44 bg-[#1a1a22] border border-white/[0.08] rounded-xl overflow-hidden z-20 shadow-xl">
                {/* Add to playlist — always visible */}
                <button
                  onClick={() => { setMenuOpen(false); setPlaylistOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#c8c8d4] hover:bg-white/[0.05] transition-colors duration-150"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Add to playlist
                </button>

                {/* Owner-only options */}
                {isOwner && (
                  <>
                    <div className="border-t border-white/[0.06]" />
                    <button
                      onClick={() => { setMenuOpen(false); navigate(`/update-video/${videoId}`); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#c8c8d4] hover:bg-white/[0.05] transition-colors duration-150"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Update video
                    </button>
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
                      {deleteLoading ? "Deleting…" : "Delete video"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Views · time · like */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-[13px] text-[#5a5a6e]">
            {views} view{views !== 1 ? "s" : ""} · {timeAgo(createdAt)}
          </span>

          <button
            onClick={toggleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 h-8 px-4 rounded-full border text-[13px] font-medium transition-all duration-150
              ${liked
                ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                : "bg-[#1a1a22] border-white/[0.07] text-[#9999aa] hover:border-white/20 hover:text-[#f2f2f4]"
              } disabled:opacity-50`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {likeCount > 0 && <span>{likeCount}</span>}
            <span>{likeCount > 1 ? "Likes" : "Like"}</span>
          </button>
        </div>
      </div>

      {/* Playlist picker modal */}
      {playlistOpen && (
        <PlaylistPicker
          videoId={videoId}
          userId={user._id}
          onClose={() => setPlaylistOpen(false)}
        />
      )}
    </>
  );
};

export default VideoInfo;