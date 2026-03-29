import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";

const UpdateVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const thumbRef = useRef();

  // Pre-fill with existing data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${videoId}`);
        const video = res.data.data[0] ?? res.data.data;
        setForm({ title: video.title, description: video.description ?? "" });
        setThumbnailPreview(video.thumbnail);
      } catch (err) {
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleThumbnail = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    setError("");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (thumbnail) fd.append("thumbnail", thumbnail);

    try {
      await API.patch(`/videos/${videoId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/watch/${videoId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (hasErr = false) =>
    `w-full rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
      hasErr
        ? "border-[#e85d2f]/60"
        : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
    }`;

  if (loading) return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-start justify-center p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-[#1a1a22] border border-white/[0.07] flex items-center justify-center text-[#9999aa] hover:text-[#f2f2f4] hover:border-white/20 transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h1 className="text-[20px] font-extrabold text-[#f2f2f4] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Update video
            </h1>
            <p className="text-[12px] text-[#5a5a6e] mt-0.5">Edit title, description or thumbnail</p>
          </div>
        </div>

        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#9999aa]">Thumbnail</label>
              <div className="flex gap-3 items-center">
                <div
                  onClick={() => thumbRef.current.click()}
                  className="w-36 h-20 rounded-xl border border-dashed border-white/[0.08] bg-[#13131a] hover:border-white/20 cursor-pointer flex items-center justify-center overflow-hidden relative transition-all duration-150 flex-shrink-0"
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <svg className="w-6 h-6 text-[#3d3d50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#9999aa]">{thumbnail ? thumbnail.name : "Current thumbnail"}</span>
                  <span className="text-[11px] text-[#3d3d47]">JPG, PNG, WEBP — 16:9 recommended</span>
                  <button type="button" onClick={() => thumbRef.current.click()}
                    className="text-[11px] text-orange-400 hover:text-orange-300 text-left transition-colors w-fit">
                    {thumbnail ? "Change image" : "Upload new"}
                  </button>
                </div>
              </div>
              <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnail(e.target.files[0])} />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#9999aa]">
                Title <span className="text-[#e85d2f]">*</span>
              </label>
              <input
                type="text"
                placeholder="Video title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`${inputCls(!form.title.trim() && error)} h-10`}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#9999aa]">Description</label>
              <textarea
                placeholder="Describe your video…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className={`${inputCls()} py-2.5 resize-none`}
              />
            </div>

            {error && (
              <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 h-10 rounded-lg bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[13px] font-semibold hover:text-[#f2f2f4] hover:border-white/20 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateVideo;