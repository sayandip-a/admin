import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

// Diagonal geometric lines for left panel background
function GeometricLines() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.18,
      }}
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large diagonal rectangles (outlines) */}
      <rect
        x="60"
        y="-80"
        width="320"
        height="420"
        rx="18"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        transform="rotate(-15 200 200)"
      />
      <rect
        x="180"
        y="80"
        width="280"
        height="380"
        rx="18"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
        transform="rotate(-15 300 280)"
      />
      <rect
        x="-40"
        y="300"
        width="260"
        height="340"
        rx="18"
        fill="none"
        stroke="white"
        strokeWidth="1"
        transform="rotate(-15 100 450)"
      />
      <rect
        x="300"
        y="400"
        width="240"
        height="320"
        rx="18"
        fill="none"
        stroke="white"
        strokeWidth="0.9"
        transform="rotate(-15 420 560)"
      />
      {/* Extra subtle lines */}
      <rect
        x="120"
        y="500"
        width="300"
        height="360"
        rx="18"
        fill="none"
        stroke="white"
        strokeWidth="0.7"
        transform="rotate(-15 270 680)"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@accelia.in");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (admin) navigate("/dashboard", { replace: true });
  }, [admin, navigate]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.ok === false) {
        setError(result.error || "Invalid credentials.");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        #root { min-height: 100%; }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes waveHand {
          0%,100% { transform: rotate(0deg); transform-origin: 70% 70%; }
          15%      { transform: rotate(14deg); transform-origin: 70% 70%; }
          30%      { transform: rotate(-8deg); transform-origin: 70% 70%; }
          45%      { transform: rotate(14deg); transform-origin: 70% 70%; }
          60%      { transform: rotate(-4deg); transform-origin: 70% 70%; }
          75%      { transform: rotate(10deg); transform-origin: 70% 70%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-10px) rotate(3deg); }
          66%      { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes rotateLines {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmerBtn {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes inputSlideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes underlineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.7) translateY(10px); }
          70%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,72,212,0.0); }
          50%      { box-shadow: 0 0 24px 6px rgba(59,72,212,0.18); }
        }

        .wave-emoji { display: inline-block; animation: waveHand 2.2s ease-in-out 0.8s 2; }

        .login-input {
          width: 100%;
          padding: 14px 16px 14px 0;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          border-radius: 0;
          background: transparent;
          color: #111827;
          outline: none;
          transition: border-color 0.25s ease;
        }
        .login-input::placeholder { color: #c4c8d4; }

        .input-wrap { position: relative; }
        .input-underline {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 100%;
          background: #3b48d4;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .input-focused .input-underline { transform: scaleX(1); }

        .login-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg, #111827 0%, #1a2ab8 50%, #111827 100%);
          background-size: 200% auto;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          letter-spacing: 0.02em;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(59,72,212,0.35);
          animation: shimmerBtn 1.4s linear infinite, glowPulse 3s ease-in-out infinite;
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; animation: none; }

        .left-panel { animation: fadeInLeft 0.8s cubic-bezier(.22,1,.36,1) both; }
        .right-panel { animation: fadeInRight 0.8s cubic-bezier(.22,1,.36,1) 0.1s both; }

        .logo-anim  { animation: fadeInDown 0.6s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .hero-anim  { animation: fadeInUp   0.7s cubic-bezier(.22,1,.36,1) 0.35s both; }
        .desc-anim  { animation: fadeInUp   0.7s cubic-bezier(.22,1,.36,1) 0.5s both; }
        .foot-anim  { animation: fadeInUp   0.6s cubic-bezier(.22,1,.36,1) 0.65s both; }

        .brand-anim   { animation: fadeInDown 0.5s ease 0.2s both; }
        .title-anim   { animation: scaleIn   0.55s cubic-bezier(.22,1,.36,1) 0.3s both; }
        .sub-anim     { animation: fadeInUp  0.5s ease 0.42s both; }
        .field1-anim  { animation: inputSlideIn 0.5s cubic-bezier(.22,1,.36,1) 0.52s both; }
        .field2-anim  { animation: inputSlideIn 0.5s cubic-bezier(.22,1,.36,1) 0.62s both; }
        .btn-anim     { animation: fadeInUp  0.5s cubic-bezier(.22,1,.36,1) 0.72s both; }
        .foot2-anim   { animation: badgePop  0.5s cubic-bezier(.22,1,.36,1) 0.85s both; }

        .asterisk-icon { animation: float 4s ease-in-out infinite; }

        .trust-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(59,72,212,0.08);
          border: 1px solid rgba(59,72,212,0.15);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11px;
          color: #3b48d4;
          font-weight: 600;
          letter-spacing: 0.04em;
          animation: badgePop 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        .trust-badge:nth-child(2) { animation-delay: 0.95s; }
        .trust-badge:nth-child(3) { animation-delay: 1.05s; }

        .forgot-link {
          color: #3b48d4; font-size: 13px; font-weight: 500;
          text-decoration: underline; background: none; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .forgot-link:hover { color: #2130a8; }
        .create-link { color: #3b48d4; font-size: 13px; text-decoration: underline; cursor: pointer; transition: color 0.15s; }
        .create-link:hover { color: #2130a8; }
      `}</style>

      {/* Outer wrapper: scrollable on mobile, fixed row on desktop */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "100vh",
          width: "100%",
          fontFamily: "'DM Sans', sans-serif",
          background: "#fff",
          /* KEY FIX: let the page scroll naturally on mobile */
          overflowY: isMobile ? "auto" : "hidden",
          overflowX: "hidden",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          className="left-panel"
          style={{
            flex: isMobile ? "none" : "0 0 58%",
            background:
              "linear-gradient(150deg, #4756e8 0%, #3040d8 35%, #1a2ab8 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: isMobile ? "40px 28px 36px" : "56px 64px",
            position: "relative",
            overflow: "hidden",
            /* On mobile, let it shrink to content; no fixed minHeight that fights scroll */
            minHeight: isMobile ? "auto" : "100vh",
            height: isMobile ? "auto" : "100vh",
          }}
        >
          <GeometricLines />

          {/* Logo */}
          <div
            className="logo-anim"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="asterisk-icon" style={{ display: "inline-block" }}>
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <line
                  x1="21"
                  y1="4"
                  x2="21"
                  y2="38"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="4"
                  y1="21"
                  x2="38"
                  y2="21"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="8"
                  x2="34"
                  y2="34"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="34"
                  y1="8"
                  x2="8"
                  y2="34"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              className="hero-anim"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1.08,
                margin: 0,
                fontSize: isMobile ? 46 : 72,
                letterSpacing: "-1.5px",
              }}
            >
              Hello
              <br />
              <span>
                Accelia! <span className="wave-emoji">👋</span>
              </span>
            </h1>
            <p
              className="desc-anim"
              style={{
                marginTop: 20,
                color: "rgba(255,255,255,0.72)",
                fontSize: isMobile ? 14 : 15,
                lineHeight: 1.8,
                maxWidth: 380,
                fontWeight: 400,
              }}
            >
              Secure, centralized control for clinical operations, trial
              management, and advanced analytics — all in one place.
            </p>
          </div>

          {/* Footer */}
          <div
            className="foot-anim"
            style={{ position: "relative", zIndex: 1 }}
          >
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>
              © 2026 Accelia Clinical Solutions. All rights reserved.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL — LOGIN FORM ── */}
        <div
          className="right-panel"
          style={{
            flex: 1,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? "44px 28px 52px" : "52px 64px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
            }}
          >
            {/* Brand name top */}
            <p
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: "#111827",
                marginBottom: 48,
                letterSpacing: "-0.5px",
              }}
            >
              Accelia Clinical Solutions
            </p>

            {/* Heading */}
            <div className="form-field">
              <h2
                style={{
                  fontSize: isMobile ? 30 : 36,
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-1px",
                  marginBottom: 8,
                  lineHeight: 1.1,
                }}
              >
                Welcome Back!
              </h2>
              <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 36 }}>
                Don't have an account?{" "}
                <span className="create-link">Create a new account now.</span>{" "}
                It's FREE! Takes less than a minute.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginBottom: 20,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  animation: "fadeInUp 0.3s ease both",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* EMAIL */}
              <div className="form-field" style={{ marginBottom: 28 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="hisalim.ux@gmail.com"
                  autoComplete="email"
                  className="login-input"
                  style={{
                    borderBottomColor:
                      focusedField === "email" ? "#3b48d4" : "#e5e7eb",
                  }}
                />
              </div>

              {/* PASSWORD */}
              <div className="form-field" style={{ marginBottom: 8 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="login-input"
                    style={{
                      paddingRight: 44,
                      borderBottomColor:
                        focusedField === "password" ? "#3b48d4" : "#e5e7eb",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: 2,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      lineHeight: 0,
                      padding: 6,
                    }}
                  >
                    {showPw ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 5C7 5 2.7 8.1 1 12.5 2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="form-field" style={{ marginTop: 32 }}>
                <button type="submit" disabled={loading} className="login-btn">
                  {loading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Login Now"
                  )}
                </button>
              </div>
            </form>

            {/* Forgot password */}
            <div
              className="form-field"
              style={{ marginTop: 20, textAlign: "center" }}
            >
              <span style={{ color: "#6b7280", fontSize: 13 }}>
                Forget password{" "}
              </span>
              <button type="button" className="forgot-link">
                Click here
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
