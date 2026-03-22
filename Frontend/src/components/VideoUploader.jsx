// VideoUploader.jsx
import { useState, useRef } from "react";

const inputCls = (hasErr = false) =>
  `w-full rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
    hasErr
      ? "border-[#e85d2f]/60"
      : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
  }`;

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-[#9999aa]">
      {label}
      {required && <span className="text-[#e85d2f] ml-0.5">*</span>}
    </label>
    {children}
    {error && <span className="text-[11px] text-[#e85d2f]">{error}</span>}
  </div>
);

const VideoUploader = ({ onSubmit, loading }) => {
  const [data, setData] = useState({ title: "", description: "" });
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDragOver, setVideoDragOver] = useState(false);
  const videoRef = useRef();
  const thumbRef = useRef();

  const handleVideo = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    setVideo(file);
  };

  const handleThumbnail = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!video) errs.video = "Video file is required";
    if (!data.title.trim()) errs.title = "Title is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    const fd = new FormData();
    fd.append("videoFile", video);
    fd.append("title", data.title);
    fd.append("description", data.description);
    if (thumbnail) fd.append("thumbnail", thumbnail);
    onSubmit?.(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Video file" required error={errors.video}>
        <div
          onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
          onDragLeave={() => setVideoDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setVideoDragOver(false); handleVideo(e.dataTransfer.files[0]); }}
          onClick={() => videoRef.current.click()}
          className={`w-full h-36 rounded-xl border border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all duration-150 ${
            errors.video
              ? "border-[#e85d2f]/60 bg-[#e85d2f]/5"
              : videoDragOver
              ? "border-orange-500/50 bg-orange-500/5"
              : video
              ? "border-orange-500/30 bg-[#13131a]"
              : "border-white/[0.08] bg-[#13131a] hover:border-white/20"
          }`}
        >
          {video ? (
            <>
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <span className="text-[13px] text-[#c8c8d4] font-medium">{video.name}</span>
              <span className="text-[11px] text-[#5a5a6e]">{(video.size / 1024 / 1024).toFixed(1)} MB</span>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-[#3d3d50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
              </svg>
              <span className="text-[13px] text-[#5a5a6e]">Drag & drop or <span className="text-[#c8c8d4]">browse</span></span>
              <span className="text-[11px] text-[#3d3d50]">MP4, MOV, AVI, MKV</span>
            </>
          )}
        </div>
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleVideo(e.target.files[0])} />
      </Field>

      <Field label="Thumbnail" error={errors.thumbnail}>
        <div className="flex gap-3 items-center">
          <div
            onClick={() => thumbRef.current.click()}
            className="w-32 h-20 rounded-lg border border-dashed border-white/[0.08] bg-[#13131a] hover:border-white/20 cursor-pointer flex items-center justify-center overflow-hidden relative transition-all duration-150 flex-shrink-0"
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
            <span className="text-[12px] text-[#9999aa]">{thumbnail ? thumbnail.name : "No thumbnail selected"}</span>
            <span className="text-[11px] text-[#3d3d50]">JPG, PNG, WEBP — 16:9 recommended</span>
            <button type="button" onClick={() => thumbRef.current.click()}
              className="text-[11px] text-orange-400 hover:text-orange-300 text-left transition-colors w-fit">
              {thumbnail ? "Change image" : "Upload image"}
            </button>
          </div>
        </div>
        <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnail(e.target.files[0])} />
      </Field>

      <Field label="Title" required error={errors.title}>
        <input
          type="text"
          placeholder="Give your video a title…"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className={`${inputCls(errors.title)} h-10`}
        />
      </Field>

      <Field label="Description">
        <textarea
          placeholder="Describe your video…"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={4}
          className={`${inputCls()} py-2.5 resize-none`}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Uploading…" : "Upload video"}
      </button>
    </form>
  );
};

export default VideoUploader;