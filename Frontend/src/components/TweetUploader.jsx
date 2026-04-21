// TweetUploader.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";

const MAX_CHARS = 280;

const TweetUploader = ({ onSubmit, loading }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return setError("Write something before posting.");
    setError("");
    onSubmit?.({ content });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Avatar src={user.avatar} alt={user.fullName} size={38} />

        <div className="flex-1 flex flex-col gap-3">
          <textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(""); }}
            rows={5}
            className={"w-full bg-transparent text-[15px] text-[#e2e2ec] placeholder:text-[#3d3d50] outline-none resize-none leading-relaxed border-b pb-3 transition-colors duration-150 border-white/[0.06] focus:border-white/[0.14]" }
          />

          <div className="flex items-center justify-end">
            <button
            type="submit"
            disabled={loading || !content.trim()}
            className="h-8 px-5 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {loading ? "Posting…" : "Post"}
            </button>
          </div>

          {error && <span className="text-[11px] text-[#e85d2f]">{error}</span>}
        </div>
      </div>
    </form>
  );
};

export default TweetUploader;