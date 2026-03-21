import { useState } from "react";
import { API } from "../api/axios";

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

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

const inputCls = (hasErr) =>
  `w-full h-10 rounded-lg border text-sm text-[#e2e2ec] placeholder:text-[#3d3d50] bg-[#13131a] px-3 outline-none transition-all duration-150 ${
    hasErr
      ? "border-[#e85d2f]/60"
      : "border-white/[0.07] hover:border-white/[0.14] focus:border-orange-500/40 focus:shadow-[0_0_0_3px_rgba(232,93,47,0.08)]"
  }`;

const AuthForm = () => {
  const [tab, setTab] = useState("register");

  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState("");

  const [showRegPw, setShowRegPw] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatar(file);
      setAvatarPreview(url);
    } else {
      setCoverImage(file);
      setCoverPreview(url);
    }
  };

  const validateRegister = () => {
    const errs = {};
    if (!registerData.fullName.trim()) errs.fullName = "Full name is required";
    if (!registerData.username.trim()) errs.username = "Username is required";
    if (!registerData.email.trim() || !/\S+@\S+\.\S+/.test(registerData.email))
      errs.email = "Valid email is required";
    if (registerData.password.length < 8) errs.password = "Min. 8 characters";
    if (!avatar) errs.avatar = "Avatar is required";
    return errs;
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginData.identifier.trim())
      errs.identifier = "Email or username is required";
    if (!loginData.password) errs.password = "Password is required";
    return errs;
  }
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const errs = validateRegister();
    if (Object.keys(errs).length) {
      setRegisterErrors(errs);
      return;
    }

    setRegisterErrors({});
    setRegisterLoading(true);
    setRegisterSuccess("");

    const fd = new FormData();
    fd.append("fullName", registerData.fullName);
    fd.append("username", registerData.username.toLowerCase());
    fd.append("email", registerData.email);
    fd.append("password", registerData.password);
    fd.append("avatar", avatar);
    if (coverImage) fd.append("coverImage", coverImage);

    try {
      const res = await API.post("/users/register", fd);

      setRegisterSuccess("Account created successfully!");
      setRegisterData({ fullName: "", username: "", email: "", password: "" });
      setAvatar(null);
      setAvatarPreview(null);
      setCoverImage(null);
      setCoverPreview(null);
    } catch (err) {
      setRegisterErrors({
        api:
          err.response?.data?.message || err.message || "Registration failed",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const errs = validateLogin();
    if (Object.keys(errs).length) {
      setLoginErrors(errs);
      return;
    }

    setLoginErrors({});
    setLoginLoading(true);
    setLoginSuccess("");

    const isEmail = /\S+@\S+\.\S+/.test(loginData.identifier);

    const payload = {
      [isEmail ? "email" : "username"]: loginData.identifier,
      password: loginData.password,
    };

    try {
      const res = await API.post("/users/login", payload);

      const user = res.data.data.user;

      setLoginSuccess(`Welcome back, ${user.username}!`);

      // NEXT STEP (IMPORTANT)
      // setUser(user)
      // navigate("/")
    } catch (err) {
      setLoginErrors({
        api: err.response?.data?.message || err.message || "Login failed",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0b0b10] flex items-center justify-center p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-[420px]">
        <div className="bg-[#0f0f14] border border-white/[0.06] rounded-2xl p-7">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] mb-7">
            {["register", "login"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-[13px] font-medium transition-all duration-150 border-b-2 -mb-px ${
                  tab === t
                    ? "text-[#f2f2f4] border-[#e85d2f]"
                    : "text-[#5a5a6e] border-transparent hover:text-[#9999aa]"
                }`}
              >
                {t === "register" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          {/* ── REGISTER ── */}
          {tab === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-4"
            >
              <Field label="Cover image">
                <div
                  onClick={() => document.getElementById("coverInput").click()}
                  className="w-full h-24 rounded-xl border border-dashed border-white/[0.1] bg-[#13131a] hover:border-white/20 cursor-pointer flex items-center justify-center overflow-hidden relative transition-all duration-150"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <span className="text-[11px] text-[#3d3d50]">
                      Click to upload cover image
                    </span>
                  )}
                </div>
                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cover")}
                />
              </Field>

              <div className="flex items-start gap-3">
                <Field label="Avatar" required error={registerErrors.avatar}>
                  <div
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                    className={`w-16 h-16 rounded-full border border-dashed bg-[#13131a] hover:border-white/20 cursor-pointer flex items-center justify-center overflow-hidden relative transition-all duration-150 ${
                      registerErrors.avatar
                        ? "border-[#e85d2f]/60"
                        : "border-white/[0.1]"
                    }`}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full object-cover absolute inset-0 rounded-full"
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-[#3d3d50]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "avatar")}
                  />
                </Field>

                <div className="flex flex-col gap-3 flex-1 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Full name"
                      required
                      error={registerErrors.fullName}
                    >
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={registerData.fullName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            fullName: e.target.value,
                          })
                        }
                        className={inputCls(registerErrors.fullName)}
                      />
                    </Field>
                    <Field
                      label="Username"
                      required
                      error={registerErrors.username}
                    >
                      <input
                        type="text"
                        placeholder="jane_doe"
                        value={registerData.username}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
                          })
                        }
                        className={inputCls(registerErrors.username)}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <Field label="Email" required error={registerErrors.email}>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className={inputCls(registerErrors.email)}
                />
              </Field>

              <Field label="Password" required error={registerErrors.password}>
                <div className="relative">
                  <input
                    type={showRegPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className={`${inputCls(registerErrors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw(!showRegPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a57] hover:text-[#9999aa] transition-colors"
                  >
                    <EyeIcon open={showRegPw} />
                  </button>
                </div>
              </Field>

              {registerErrors.api && (
                <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">
                  {registerErrors.api}
                </p>
              )}
              {registerSuccess && (
                <p className="text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                  {registerSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={registerLoading}
                className="h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold mt-1 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading ? "Creating account…" : "Create account"}
              </button>

              <p className="text-[12px] text-[#5a5a6e] text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-[#c8c8d4] underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <Field
                label="Email or username"
                required
                error={loginErrors.identifier}
              >
                <input
                  type="text"
                  placeholder="jane@example.com or jane_doe"
                  value={loginData.identifier}
                  onChange={(e) =>
                    setLoginData({ ...loginData, identifier: e.target.value })
                  }
                  className={inputCls(loginErrors.identifier)}
                />
              </Field>

              <Field label="Password" required error={loginErrors.password}>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className={`${inputCls(loginErrors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a57] hover:text-[#9999aa] transition-colors"
                  >
                    <EyeIcon open={showLoginPw} />
                  </button>
                </div>
              </Field>

              {loginErrors.api && (
                <p className="text-[12px] text-[#e85d2f] bg-[#e85d2f]/10 border border-[#e85d2f]/20 rounded-lg px-3 py-2">
                  {loginErrors.api}
                </p>
              )}
              {loginSuccess && (
                <p className="text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                  {loginSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="h-10 rounded-lg bg-[#e85d2f] hover:bg-[#d4512a] text-white text-[13px] font-semibold mt-1 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>

              <p className="text-[12px] text-[#5a5a6e] text-center">
                No account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-[#c8c8d4] underline underline-offset-2"
                >
                  Create one
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
