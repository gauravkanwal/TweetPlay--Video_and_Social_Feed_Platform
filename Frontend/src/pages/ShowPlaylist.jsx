import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import VideoCard from "../components/VideoCard";

const ShowPlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Per-video remove loading
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/playlists/${playlistId}`);
        const data = res.data.data;
        setPlaylist(data);
        setEditForm({
          name: data.name ?? "",
          description: data.description ?? "",
        });
      } catch (err) {
        setError("Failed to load playlist.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [playlistId]);
  
  const isOwner = playlist && user._id === playlist.owner;
  
  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return setEditError("Name is required.");
    setEditError("");
    setEditLoading(true);
    try {
      const res = await API.patch(`/playlists/${playlistId}`, editForm);
      setPlaylist((p) => ({ ...p, ...res.data.data }));
      setEditOpen(false);
    } catch (err) {
      setEditError(err.response?.data?.message || "Update failed.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete playlist ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Delete this playlist?")) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/playlists/${playlistId}`);
      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Remove video from playlist ────────────────────────────────────────────
  const handleRemoveVideo = async (videoId) => {
    setRemovingId(videoId);
    try {
      await API.delete(`/playlists/${playlistId}/${videoId}`);
      setPlaylist((p) => ({
        ...p,
        videos: p.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const inputCls = (err = false) =>
    `w-full rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
      err
        ? "border-[#e85d2f]/60"
        : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
    }`;

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <p className="text-[13px] text-[#e85d2f]">{error}</p>
      </div>
    );

  if (!playlist) return null;

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-7 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5a5a6e] hover:text-[#f2f2f4] transition-colors duration-150 mb-6 text-[13px]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8 pb-6 border-b border-white/[0.06]">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a22] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-12 h-12 text-[#2a2a35]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </div>

          {/* Info + owner actions */}
          <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1
                className="text-[22px] font-extrabold text-[#f2f2f4] tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-[13px] text-[#5a5a6e] mt-1">
                  {playlist.description}
                </p>
              )}
              <p className="text-[12px] text-[#3d3d47] mt-1.5">
                {playlist.videos?.length ?? 0} video
                {playlist.videos?.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Edit button */}
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#1a1a22] border border-white/[0.07] hover:border-white/20 text-[12px] text-[#9999aa] hover:text-[#f2f2f4] font-medium transition-all duration-150"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span className="hidden sm:block">Edit</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-[12px] text-red-400 hover:text-red-300 font-medium transition-all duration-150 disabled:opacity-50"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  <span className="hidden sm:block">
                    {deleteLoading ? "Deleting…" : "Delete"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Videos grid */}
        {!playlist.videos?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg
              className="w-12 h-12 text-[#2a2a35]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            <p
              className="text-[14px] font-bold text-[#f2f2f4]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              No videos in this playlist
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {playlist.videos.map((video, i) => (
              <div
                key={video._id || i}
                className="relative group/tile animate-[fadeUp_0.4s_ease_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <VideoCard video={video} />

                {/* Remove button — owner only, appears on hover */}
                {isOwner && (
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    disabled={removingId === video._id}
                    className="absolute top-2 right-2 z-10 flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 hover:border-red-500/40 hover:bg-red-500/20 text-[11px] text-[#9999aa] hover:text-red-400 font-medium opacity-0 group-hover/tile:opacity-100 transition-all duration-150 disabled:opacity-50"
                  >
                    {removingId === video._id ? (
                      <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                    ) : (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-[#0f0f14] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-[17px] font-extrabold text-[#f2f2f4]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Edit playlist
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d3d47] hover:text-[#9999aa] hover:bg-white/[0.05] transition-all duration-150"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9999aa]">
                  Name <span className="text-[#e85d2f]">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm({ ...editForm, name: e.target.value });
                    setEditError("");
                  }}
                  className={`${inputCls(!!editError && !editForm.name.trim())} h-10`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9999aa]">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className={`${inputCls()} py-2.5 resize-none`}
                  placeholder="What's this playlist about?"
                />
              </div>

              {editError && (
                <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">
                  {editError}
                </p>
              )}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 h-10 rounded-lg bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[13px] font-semibold hover:text-[#f2f2f4] hover:border-white/20 transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50"
                >
                  {editLoading ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
