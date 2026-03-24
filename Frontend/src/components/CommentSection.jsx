import { useState, useEffect } from "react";
import { API } from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import CommentCard from "./CommentCard";

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${videoId}`);
      setComments(res.data.data.docs);
      // console.log(comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await API.post(`/comments/${videoId}`, { content });
      fetchComments();
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleUpdate = (commentId, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: newContent } : c))
    );
  };

  return (
    <div className="flex flex-col gap-5 pt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2
        className="text-[15px] font-extrabold text-[#f2f2f4]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </h2>

      {/* Add comment */}
      <div className="flex gap-3 items-start">
        <Avatar src={user.avatar} alt={user.fullName} size={36} />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
            placeholder="Add a comment…"
            rows={2}
            className="w-full bg-[#13131a] border border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)] rounded-xl px-3 py-2.5 text-[13px] text-[#e2e2ec] placeholder:text-[#3d3d50] outline-none resize-none transition-all duration-150"
          />
          {error && <span className="text-[11px] text-[#e85d2f]">{error}</span>}
          {content.trim() && (
            <div className="flex justify-end">
              <button
                onClick={handlePost}
                disabled={posting}
                className="h-8 px-4 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[12px] font-bold transition-all duration-150 disabled:opacity-50"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="flex items-center gap-2 py-4">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <span className="text-[13px] text-[#3d3d47]">Loading comments…</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-[13px] text-[#3d3d47]">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;