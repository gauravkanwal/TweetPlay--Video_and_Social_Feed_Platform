import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios";

const inputCls = (err = false) =>
  `w-full rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
    err
      ? "border-[#e85d2f]/60"
      : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
  }`;

const CreatePlaylist = ({ onCreated, onClose, inline = false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Playlist name is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setApiError("");
    setSubmitting(true);
    try {
      const res = await API.post("/playlists/", form);
      const created = res.data.data;
      if (onCreated) {
        onCreated(created);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create playlist.");
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#9999aa]">
          Name <span className="text-[#e85d2f]">*</span>
        </label>
        <input
          type="text"
          placeholder="My awesome playlist"
          value={form.name}
          onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}); }}
          className={`${inputCls(!!errors.name)} h-10`}
        />
        {errors.name && <span className="text-[11px] text-[#e85d2f]">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#9999aa]">Description</label>
        <textarea
          placeholder="What's this playlist about?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={`${inputCls()} py-2.5 resize-none`}
        />
      </div>

      {apiError && (
        <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onClose ? onClose : () => navigate(-1)}
          className="flex-1 h-10 rounded-lg bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[13px] font-semibold hover:text-[#f2f2f4] hover:border-white/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating…" : "Create playlist"}
        </button>
      </div>
    </form>
  );

  // inline mode — used inside the playlist picker modal
  if (inline) return content;

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] flex items-start justify-center p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-[480px]">
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
              New playlist
            </h1>
            <p className="text-[12px] text-[#5a5a6e] mt-0.5">Create a playlist to organise your videos</p>
          </div>
        </div>

        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl p-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;