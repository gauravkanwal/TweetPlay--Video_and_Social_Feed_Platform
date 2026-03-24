import { useState, useRef, useEffect } from "react";
import { API } from "../api/axios";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";

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

const CommentCard = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const isOwner = comment.owner?._id === user._id;
  console.log(comment.owner);
  // console.log(user);
  const [liked, setLiked] = useState(comment.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likes ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await API.post(`/likes/toggle/c/${comment._id}`);
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
      await API.delete(`/comments/${comment._id}`);
      onDelete(comment._id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    setEditLoading(true);
    try {
      await API.patch(`/comments/${comment._id}`, { content: editContent });
      onUpdate(comment._id, editContent);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="flex gap-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Avatar
        src={comment.owner?.avatar}
        alt={comment.owner?.fullName}
        size={36}
      />

      <div className="flex-1 flex flex-col gap-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] font-bold text-[#f2f2f4]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {comment.owner?.fullName}
            </span>
            <span className="text-[11px] text-[#3d3d47]">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* 3-dot menu — only for comment owner */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d3d47] hover:text-[#9999aa] hover:bg-white/[0.05] transition-all duration-150"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 w-36 bg-[#1a1a22] border border-white/[0.08] rounded-xl overflow-hidden z-10 shadow-xl">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#c8c8d4] hover:bg-white/[0.05] transition-colors duration-150"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-50"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    {deleteLoading ? "Deleting…" : "Delete"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content or edit mode */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              autoFocus
              className="w-full bg-[#13131a] border border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)] rounded-xl px-3 py-2.5 text-[13px] text-[#e2e2ec] outline-none resize-none transition-all duration-150"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                disabled={editLoading || !editContent.trim()}
                className="h-7 px-3 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[11px] font-bold transition-all duration-150 disabled:opacity-50"
              >
                {editLoading ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditContent(comment.content);
                }}
                className="h-7 px-3 rounded-full bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[11px] font-medium hover:text-[#f2f2f4] transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#9999aa] leading-relaxed">
            {editContent}
          </p>
        )}

        {/* Like */}
        <button
          onClick={toggleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 w-fit mt-0.5 text-[12px] font-medium transition-colors duration-150
            ${liked ? "text-orange-400" : "text-[#3d3d47] hover:text-[#9999aa]"}
            disabled:opacity-50`}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
