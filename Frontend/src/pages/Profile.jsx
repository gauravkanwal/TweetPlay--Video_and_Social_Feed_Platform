// pages/Profile.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import Avatar from "../components/Avatar";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import ScrollableCards from "../components/ScrollableCards";

// ─── Sub-components (defined outside to prevent focus loss) ───────────────────

const UserRow = ({ user }) => (
  <div className="flex items-center gap-3 p-3 bg-[#14141a] border border-white/[0.06] rounded-xl hover:border-white/[0.11] hover:bg-white/[0.02] transition-all duration-150">
    <Avatar src={user.avatar} alt={user.fullName} username={user.username} size={38} />
    <div className="min-w-0">
      <p className="text-[13px] font-bold text-[#f2f2f4] truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{user.fullName}</p>
      <p className="text-[11px] text-[#5a5a6e] truncate">@{user.username}</p>
    </div>
  </div>
);

const inputCls = (err = false) =>
  `w-full h-10 rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
    err ? "border-[#e85d2f]/60" : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
  }`;

const SectionLabel = ({ children }) => (
  <h2 className="text-[15px] font-extrabold text-[#f2f2f4]" style={{ fontFamily: "'Syne', sans-serif" }}>{children}</h2>
);

// ─── Profile Page ──────────────────────────────────────────────────────────────

const Profile = () => {
  const { username } = useParams();
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);

  // Sidebar tab
  const [sideTab, setSideTab] = useState("subscribers");

  // Edit info modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", username: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Password modal
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Avatar / cover upload
  const avatarRef = useRef();
  const coverRef = useRef();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const isOwner = authUser?.username === username;

  // ─── Fetch all data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const channelRes = await API.get(`/users/channel/${username}`);
        const ch = channelRes.data.data;
        setChannel(ch);
        setIsSubscribed(ch.isSubscribed ?? false);
        setSubCount(ch.subscribersCount ?? 0);

        const [videosRes, subsRes, subscriptionsRes, playlistsRes] = await Promise.all([
          API.get(`/videos/`, { params: { userId: ch._id } }),
          API.get(`/subscriptions/subscribers/${ch._id}`),
          API.get(`/subscriptions/channels/${ch._id}`),
          API.get(`/playlists/user/${ch._id}`),
        ]);

        setVideos(videosRes.data.data?.docs ?? videosRes.data.data ?? []);
        setSubscribers(subsRes.data.data.docs ?? []);
        setSubscriptions(subscriptionsRes.data.data.docs ?? []);
        setPlaylists(playlistsRes.data.data ?? []);

        if (isOwner) {
          const [historyRes, likedRes] = await Promise.all([
            API.get("/users/watch-history"),
            API.get("/likes/videos"),
          ]);
          
        //   console.log(historyRes);
          setHistory(historyRes.data.data ?? []);
          setLikedVideos(likedRes.data.data.docs ?? []);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [username]);

  // ─── Subscribe toggle ────────────────────────────────────────────────────────
  const toggleSubscribe = async () => {
    if (subLoading) return;
    setSubLoading(true);
    try {
      await API.post(`/subscriptions/toggle/${channel._id}`);
      setIsSubscribed((p) => !p);
      setSubCount((p) => (isSubscribed ? p - 1 : p + 1));
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  // ─── Update account info ─────────────────────────────────────────────────────
  const openEdit = () => {
    setEditForm({ fullName: channel.fullName, username: channel.username });
    setEditError("");
    setEditOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim() || !editForm.username.trim()) return setEditError("All fields required.");
    setEditLoading(true);
    setEditError("");
    try {
      const res = await API.patch("/users/update-account", editForm);
      setChannel((p) => ({ ...p, ...res.data.data }));
      if (isOwner) setUser((p) => ({ ...p, ...res.data.data }));
      setEditOpen(false);
      if (editForm.username !== username) navigate(`/profile/${editForm.username}`);
    } catch (err) {
      setEditError(err.response?.data?.message || "Update failed.");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Change password ─────────────────────────────────────────────────────────
  const submitPassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError("Passwords don't match.");
    if (pwForm.newPassword.length < 8) return setPwError("Min. 8 characters.");
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    try {
      await API.post("/users/change-password", {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  // ─── Avatar / cover upload ───────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await API.patch("/users/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setChannel((p) => ({ ...p, avatar: res.data.data.avatar }));
      setUser((p) => ({ ...p, avatar: res.data.data.avatar }));
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverUploading(true);
    const fd = new FormData();
    fd.append("coverImage", file);
    try {
      const res = await API.patch("/users/cover-image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setChannel((p) => ({ ...p, coverImage: res.data.data.coverImage }));
    } catch (err) {
      console.error(err);
    } finally {
      setCoverUploading(false);
    }
  };

  // ─── Render states ───────────────────────────────────────────────────────────
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

  if (!channel) return null;

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-7 py-6 flex flex-col gap-8">

        {/* ── Top section: profile info + subscribers/subscriptions panel ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left — cover + avatar + info */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Cover image */}
            <div className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden bg-[#1a1a22] border border-white/[0.06]">
              {channel.coverImage ? (
                <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a22] to-[#0f0f14]" />
              )}
              {isOwner && (
                <>
                  <button
                    onClick={() => coverRef.current.click()}
                    disabled={coverUploading}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 h-7 px-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[11px] text-white hover:bg-black/80 transition-all duration-150 disabled:opacity-50"
                  >
                    {coverUploading ? (
                      <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    )}
                    {coverUploading ? "Uploading…" : "Change cover"}
                  </button>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </>
              )}
            </div>

            {/* Avatar + info row */}
            <div className="flex items-start gap-4 -mt-10 px-2">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="ring-4 ring-[#0c0c0f] rounded-full">
                  <Avatar src={channel.avatar} alt={channel.fullName} size={80} />
                </div>
                {isOwner && (
                  <>
                    <button
                      onClick={() => avatarRef.current.click()}
                      disabled={avatarUploading}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#e85d2f] hover:bg-[#d4512a] flex items-center justify-center transition-all duration-150 disabled:opacity-50"
                    >
                      {avatarUploading ? (
                        <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      )}
                    </button>
                    <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </>
                )}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0 pt-8 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-[20px] font-extrabold text-[#f2f2f4] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {channel.fullName}
                    </h1>
                    <p className="text-[13px] text-[#5a5a6e]">@{channel.username}</p>
                    {isOwner && (
                      <>
                        <p className="text-[12px] text-[#3d3d47] mt-0.5">{channel.email}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <button
                            onClick={openEdit}
                            className="text-[12px] text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
                          >
                            Edit profile
                          </button>
                          <button
                            onClick={() => { setPwError(""); setPwSuccess(""); setPwOpen(true); }}
                            className="text-[12px] text-[#5a5a6e] hover:text-[#9999aa] underline underline-offset-2 transition-colors"
                          >
                            Change password
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Subscriber count + subscribe button */}
                  {!isOwner && (
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[13px] text-[#9999aa]">
                        <span className="font-bold text-[#f2f2f4]">{subCount}</span> subscriber{subCount !== 1 ? "s" : ""}
                      </p>
                      <button
                        onClick={toggleSubscribe}
                        disabled={subLoading}
                        className={`h-9 px-5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-150 flex-shrink-0
                          ${isSubscribed
                            ? "bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] hover:border-red-500/40 hover:text-red-400"
                            : "bg-[#e85d2f] hover:bg-[#d4512a] text-white"
                          } disabled:opacity-50`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {subLoading ? "..." : isSubscribed ? "Subscribed" : "Subscribe"}
                      </button>
                    </div>
                  )}
                  {isOwner && (
                    <p className="text-[13px] text-[#9999aa] pt-8">
                      <span className="font-bold text-[#f2f2f4]">{subCount}</span> subscriber{subCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right — subscribers/subscriptions panel (owner only) */}
          {isOwner && (
            <div className="lg:w-72 flex-shrink-0 bg-[#0f0f14] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4">
              {/* Tabs */}
              <div className="flex border-b border-white/[0.06]">
                {["subscribers", "subscriptions"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSideTab(t)}
                    className={`flex-1 pb-2.5 text-[12px] font-bold capitalize border-b-2 -mb-px transition-all duration-150
                      ${sideTab === t ? "text-[#f2f2f4] border-orange-500" : "text-[#3d3d47] border-transparent hover:text-[#9999aa]"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
                {(sideTab === "subscribers" ? subscribers : subscriptions).length === 0 ? (
                  <p className="text-[12px] text-[#3d3d47] text-center py-4">None yet.</p>
                ) : (
                  (sideTab === "subscribers" ? subscribers : subscriptions).map((u) => (
                    <UserRow key={u._id} user={sideTab==="subscriptions"?u.channel:u.subscriber} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable sections ── */}
        <div className="flex flex-col gap-8">
          <ScrollableCards
            title="Videos"
            items={videos}
            renderCard={(v) => <div className="w-[260px]"><VideoCard video={v} /></div>}
          />

          <ScrollableCards
            title="Watch History *"
            items={history}
            ownerOnly
            isOwner={isOwner}
            renderCard={(v) => <div className="w-[260px]"><VideoCard video={v} /></div>}
          />

          <ScrollableCards
            title="Liked Videos *"
            items={likedVideos}
            ownerOnly
            isOwner={isOwner}
            renderCard={(v) => <div className="w-[260px]"><VideoCard video={v} /></div>}
          />

          <ScrollableCards
            title="Playlists"
            items={playlists}
            renderCard={(p) => <PlaylistCard playlist={p} />}
          />
        </div>
      </div>

      {/* ── Edit profile modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f0f14] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold text-[#f2f2f4]" style={{ fontFamily: "'Syne', sans-serif" }}>Edit profile</h2>
              <button onClick={() => setEditOpen(false)} className="text-[#3d3d47] hover:text-[#9999aa] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={submitEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9999aa]">Full name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className={inputCls()}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9999aa]">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className={inputCls()}
                />
              </div>
              {editError && <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">{editError}</p>}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 h-10 rounded-lg bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[13px] font-semibold hover:text-[#f2f2f4] transition-all duration-150">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-1 h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50">
                  {editLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Change password modal ── */}
      {pwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f0f14] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold text-[#f2f2f4]" style={{ fontFamily: "'Syne', sans-serif" }}>Change password</h2>
              <button onClick={() => setPwOpen(false)} className="text-[#3d3d47] hover:text-[#9999aa] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={submitPassword} className="flex flex-col gap-4">
              {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#9999aa] capitalize">
                    {field === "oldPassword" ? "Current password" : field === "newPassword" ? "New password" : "Confirm new password"}
                  </label>
                  <input
                    type="password"
                    value={pwForm[field]}
                    onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                    className={inputCls()}
                    placeholder="••••••••"
                  />
                </div>
              ))}
              {pwError && <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">{pwError}</p>}
              {pwSuccess && <p className="text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">{pwSuccess}</p>}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setPwOpen(false)} className="flex-1 h-10 rounded-lg bg-[#1a1a22] border border-white/[0.07] text-[#9999aa] text-[13px] font-semibold hover:text-[#f2f2f4] transition-all duration-150">Cancel</button>
                <button type="submit" disabled={pwLoading} className="flex-1 h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold transition-all duration-150 disabled:opacity-50">
                  {pwLoading ? "Saving…" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;