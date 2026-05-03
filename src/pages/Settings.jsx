import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── THEME — matches reference light clinical palette ─────────────── */
const T = {
  pageBg: "#f0f1f7",
  cardBg: "#ffffff",
  footerBg: "#e8eaf2",
  border: "#e0e2ef",
  borderFocus: "#2B3AE7",
  accent: "#2B3AE7",
  accentLight: "#eef0fd",
  accentSoft: "rgba(43,58,231,0.08)",
  text1: "#1a1b2e",
  text2: "#6b7090",
  text3: "#a8adcb",
  green: "#10b981",
  greenSoft: "rgba(16,185,129,0.1)",
  amber: "#f59e0b",
  amberSoft: "rgba(245,158,11,0.1)",
  rose: "#f43f5e",
  roseSoft: "rgba(244,63,94,0.08)",
  sky: "#0ea5e9",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(43,58,231,0.06)",
  shadowHover: "0 4px 20px rgba(43,58,231,0.12), 0 1px 4px rgba(0,0,0,0.06)",
};

const tabs = [
  { id: "profile", label: "Profile", icon: ProfileIcon, color: T.accent },
  {
    id: "notifications",
    label: "Notifications",
    icon: BellIcon,
    color: T.amber,
  },
  { id: "security", label: "Security", icon: ShieldIcon, color: T.sky },
  { id: "portal", label: "Portal", icon: GlobeIcon, color: T.green },
  { id: "danger", label: "Danger Zone", icon: AlertIcon, color: T.rose },
];

/* ─── ICONS ─────────────────────────────────────────────────────────── */
function Ico({ d, size = 16, sw = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {[].concat(d).map((path, i) => (
        <path key={i} d={path} />
      ))}
    </svg>
  );
}
function ProfileIcon({ size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function BellIcon({ size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
function ShieldIcon({ size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function GlobeIcon({ size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}
function AlertIcon({ size = 16, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function CheckIcon({ size = 14 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
function EyeIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 15, height: 15 }}
    >
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
}

/* ─── REUSABLE PRIMITIVES ──────────────────────────────────────────── */

function Toggle({ value, onChange, accent = T.accent }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
        transition: "background 0.28s ease",
        background: value ? accent : "#d1d5e8",
        boxShadow: value ? `0 0 0 3px ${accent}22` : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  accent = T.accent,
  hint,
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          display: "block",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: focused ? accent : T.text3,
          transition: "color 0.2s",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPassword && showPw ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: isPassword ? "10px 38px 10px 12px" : "10px 12px",
            fontSize: 13.5,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            border: `1px solid ${focused ? accent : T.border}`,
            borderRadius: 10,
            background: focused ? "#fff" : "#fafbff",
            color: T.text1,
            outline: "none",
            boxSizing: "border-box",
            boxShadow: focused ? `0 0 0 3px ${accent}14` : "none",
            transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.text3,
              padding: 2,
            }}
          >
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      {hint && (
        <p style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>{hint}</p>
      )}
    </div>
  );
}

function SettingRow({ label, desc, children, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        gap: 16,
        borderBottom: `1px solid ${T.border}`,
        background: hov ? T.accentSoft : "transparent",
        transition: "background 0.18s",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{ fontSize: 13.5, fontWeight: 600, color: T.text1, margin: 0 }}
        >
          {label}
        </p>
        {desc && (
          <p
            style={{
              fontSize: 11.5,
              color: T.text3,
              margin: "3px 0 0",
              lineHeight: 1.5,
            }}
          >
            {desc}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Card({ title, children, accent = T.accent, icon, noPad }) {
  return (
    <div
      className="settings-card"
      style={{
        background: T.cardBg,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        marginBottom: 16,
        overflow: "hidden",
        boxShadow: T.shadow,
        transition: "box-shadow 0.22s",
      }}
    >
      {title && (
        <div
          style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fafbff",
          }}
        >
          {icon && (
            <span style={{ color: accent, display: "flex" }}>{icon}</span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {title}
          </span>
        </div>
      )}
      <div style={noPad ? {} : { padding: "4px 0" }}>{children}</div>
    </div>
  );
}

function DangerBtn({ label, desc, btnLabel, onClick, destructive }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
        gap: 12,
        flexWrap: "wrap",
        borderBottom: `1px solid ${T.roseSoft}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{ fontSize: 13.5, fontWeight: 600, color: T.text1, margin: 0 }}
        >
          {label}
        </p>
        {desc && (
          <p style={{ fontSize: 11.5, color: T.text3, margin: "3px 0 0" }}>
            {desc}
          </p>
        )}
      </div>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flexShrink: 0,
          padding: "8px 16px",
          borderRadius: 9,
          border: `1px solid ${destructive ? T.rose + "55" : T.border}`,
          background: hov
            ? destructive
              ? T.roseSoft
              : T.accentSoft
            : T.cardBg,
          color: destructive ? T.rose : T.text2,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: hov ? T.shadowHover : "none",
          transform: hov ? "translateY(-1px)" : "none",
        }}
      >
        {btnLabel}
      </button>
    </div>
  );
}

function StatBadge({ value, label, color }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.ceil(value / 30);
    const t = setInterval(() => {
      n += step;
      if (n >= value) {
        setCount(value);
        clearInterval(t);
      } else setCount(n);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "14px 18px",
        boxShadow: T.shadow,
        flex: 1,
        minWidth: 100,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          letterSpacing: "-0.03em",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: T.text3,
          marginTop: 2,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */
export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const scrollRef = useRef(null);

  const [profile, setProfile] = useState({
    orgName: "Accelia Clinical Solutions",
    email: "admin@accelia.in",
    phone: "+91 98300 00000",
    website: "https://accelia.in",
    bio: "Leading clinical research organization focused on innovative trial management.",
  });
  const [notifs, setNotifs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    trialAlerts: true,
    jobAlerts: true,
    weeklyDigest: false,
    systemAlerts: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
    apiAccess: false,
    ipRestriction: false,
  });
  const [portal, setPortal] = useState({
    publicPortal: true,
    allowRegistration: true,
    autoPublish: false,
    seoEnabled: true,
    maintenanceMode: false,
    analyticsEnabled: true,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const setN = (k) => (v) => setNotifs((s) => ({ ...s, [k]: v }));
  const setSec = (k) => (v) => setSecurity((s) => ({ ...s, [k]: v }));
  const setP = (k) => (v) => setPortal((s) => ({ ...s, [k]: v }));
  const setProf = (k) => (v) => setProfile((s) => ({ ...s, [k]: v }));
  const setPw = (k) => (v) => setPasswords((s) => ({ ...s, [k]: v }));

  const tab = tabs.find((t) => t.id === activeTab);
  const accent = tab?.color || T.accent;

  const switchTab = (id) => {
    setActiveTab(id);
    setAnimKey((k) => k + 1);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  };

  const TabIcon = tab?.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .s-root {
          display: flex; flex-direction: column; height: 100%;
          background: ${T.pageBg};
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: ${T.text1};
          overflow: hidden;
        }

        /* ── topbar ── */
        .s-topbar {
          display: flex; align-items: center; gap: 12; padding: 0 20px;
          height: 60px; flex-shrink: 0;
          background: ${T.cardBg};
          border-bottom: 1px solid ${T.border};
          box-shadow: 0 1px 0 ${T.border};
        }

        .s-back {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1px solid ${T.border};
          background: ${T.pageBg}; color: ${T.text2};
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; flex-shrink: 0;
        }
        .s-back:hover { background: ${T.accentLight}; color: ${T.accent}; border-color: ${T.accent}44; transform: translateX(-1px); }

        .s-title {
          font-size: 18px; font-weight: 800; color: ${T.text1};
          letter-spacing: -0.02em;
        }

        .s-live {
          margin-left: auto; display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 20px;
          background: ${T.accentSoft}; border: 1px solid ${T.accent}22;
          font-size: 11px; color: ${T.text2}; font-weight: 600;
        }

        /* ── tab strip ── */
        .s-tabstrip {
          display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none;
          border-bottom: 1px solid ${T.border};
          background: ${T.cardBg}; flex-shrink: 0; padding: 0 16px;
        }
        .s-tabstrip::-webkit-scrollbar { display: none; }

        .s-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 14px 14px 12px; border: none; cursor: pointer;
          font-size: 12.5px; font-weight: 600;
          background: transparent; color: ${T.text3};
          transition: color 0.18s; white-space: nowrap;
          border-bottom: 2.5px solid transparent; margin-bottom: -1px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }
        .s-tab:hover { color: ${T.text2}; }
        .s-tab.active { font-weight: 700; }
        .s-tab .tab-ripple {
          position: absolute; inset: 0; border-radius: 6px;
          pointer-events: none; overflow: hidden;
        }

        /* ── scroll area ── */
        .s-scroll {
          flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;
          padding: 24px 20px 120px;
          scroll-behavior: smooth;
        }
        .s-scroll::-webkit-scrollbar { width: 4px; }
        .s-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }

        /* ── page header ── */
        .s-page-header {
          margin-bottom: 24px;
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }

        /* ── save bar ── */
        .s-savebar {
          flex-shrink: 0; padding: 12px 20px;
          background: ${T.cardBg}; border-top: 1px solid ${T.border};
          display: flex; align-items: center; justify-content: flex-end; gap: 12px;
          box-shadow: 0 -2px 12px rgba(43,58,231,0.06);
        }

        .s-save-btn {
          padding: 10px 28px; border-radius: 11px; border: none;
          font-size: 13.5px; font-weight: 700; min-width: 136px;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
          transition: all 0.22s;
          letter-spacing: 0.01em;
        }
        .s-save-btn:not(:disabled):hover { transform: translateY(-1px); }
        .s-save-btn:not(:disabled):active { transform: translateY(0); }

        .settings-card:hover { box-shadow: ${T.shadowHover} !important; }

        .twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

        /* ── animations ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes barFill {
          from { width: 0%; }
          to   { width: var(--w); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%  { opacity: 0.5; }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 200px; }
        }

        .page-enter { animation: fadeSlideUp 0.32s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter { animation: scaleIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .success-enter { animation: successPop 0.36s cubic-bezier(0.34,1.56,0.64,1) both; }
        .slide-down { animation: slideDown 0.28s ease both; overflow: hidden; }

        .stagger-1 { animation-delay: 0.04s; }
        .stagger-2 { animation-delay: 0.08s; }
        .stagger-3 { animation-delay: 0.12s; }
        .stagger-4 { animation-delay: 0.16s; }
        .stagger-5 { animation-delay: 0.20s; }
        .stagger-6 { animation-delay: 0.24s; }

        @media (max-width: 600px) {
          .twocol { grid-template-columns: 1fr !important; }
          .s-page-header { flex-direction: column; }
          .s-topbar { padding: 0 14px; }
          .s-scroll { padding: 16px 14px 120px; }
          .s-savebar { padding: 10px 14px; }
        }
        @media (max-width: 400px) {
          .s-tab { padding: 12px 10px 10px; font-size: 11.5px; }
          .s-title { font-size: 15px; }
        }
      `}</style>

      <div className="s-root">
        {/* ── Top bar ──────────────────────────────────── */}
        <div className="s-topbar" style={{ gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {TabIcon && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `${accent}15`,
                  border: `1px solid ${accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                  transition: "all 0.2s",
                }}
              >
                <TabIcon size={15} color={accent} />
              </div>
            )}
            <span className="s-title">Settings</span>
          </div>

          <div className="s-live">
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: accent,
                display: "inline-block",
                animation: "pulse 2s ease infinite",
                boxShadow: `0 0 6px ${accent}88`,
              }}
            />
            Live
          </div>
        </div>

        {/* ── Tab strip ────────────────────────────────── */}
        <div className="s-tabstrip">
          {tabs.map((t) => {
            const on = activeTab === t.id;
            const TIcon = t.icon;
            return (
              <button
                key={t.id}
                className={`s-tab${on ? " active" : ""}`}
                onClick={() => switchTab(t.id)}
                style={{
                  color: on ? t.color : undefined,
                  borderBottomColor: on ? t.color : "transparent",
                }}
              >
                <TIcon size={14} color={on ? t.color : T.text3} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Scrollable content ───────────────────────── */}
        <div className="s-scroll" ref={scrollRef}>
          <div key={animKey}>
            {/* Page header */}
            <div className="s-page-header page-enter">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: accent,
                      boxShadow: `0 0 0 3px ${accent}28`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10.5,
                      color: T.text3,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    Accelia Admin
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "clamp(22px,5vw,30px)",
                    fontWeight: 800,
                    color: T.text1,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                  }}
                >
                  {tab?.label}
                </h1>
                <p style={{ fontSize: 13, color: T.text3, marginTop: 6 }}>
                  Manage your {tab?.label?.toLowerCase()} settings and
                  preferences
                </p>
              </div>

              {/* Stats for profile tab */}
              {activeTab === "profile" && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <StatBadge
                    value={130}
                    label="Total Trials"
                    color={T.accent}
                  />
                  <StatBadge value={24} label="Locations" color={T.green} />
                  <StatBadge value={31} label="Open Jobs" color={T.amber} />
                </div>
              )}
            </div>

            {/* ── PROFILE ───────────────────────────────── */}
            {activeTab === "profile" && (
              <>
                <div className="card-enter stagger-1">
                  <Card
                    title="Organization Info"
                    accent={accent}
                    icon={<ProfileIcon size={13} />}
                  >
                    <div style={{ padding: "16px 18px" }}>
                      <Field
                        label="Organization Name"
                        value={profile.orgName}
                        onChange={setProf("orgName")}
                        accent={accent}
                      />
                      <div className="twocol">
                        <Field
                          label="Admin Email"
                          value={profile.email}
                          type="email"
                          onChange={setProf("email")}
                          accent={accent}
                        />
                        <Field
                          label="Phone"
                          value={profile.phone}
                          onChange={setProf("phone")}
                          accent={accent}
                        />
                      </div>
                      <Field
                        label="Website"
                        value={profile.website}
                        onChange={setProf("website")}
                        accent={accent}
                      />
                      <div style={{ marginBottom: 0 }}>
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            display: "block",
                            marginBottom: 6,
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            color: T.text3,
                          }}
                        >
                          Bio / Description
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProf("bio")(e.target.value)}
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            fontSize: 13.5,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            background: "#fafbff",
                            color: T.text1,
                            outline: "none",
                            resize: "vertical",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = accent)}
                          onBlur={(e) =>
                            (e.target.style.borderColor = T.border)
                          }
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="card-enter stagger-2">
                  <Card
                    title="Organization Logo"
                    accent={accent}
                    icon={<GlobeIcon size={13} />}
                  >
                    <div
                      style={{
                        padding: "16px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 16,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${T.accent}, ${T.accent}99)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#fff",
                          boxShadow: `0 4px 16px ${T.accent}30`,
                        }}
                      >
                        {profile.orgName?.slice(0, 2).toUpperCase() || "AC"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: T.text1,
                            marginBottom: 4,
                          }}
                        >
                          Upload Logo
                        </p>
                        <p
                          style={{
                            fontSize: 11.5,
                            color: T.text3,
                            marginBottom: 12,
                          }}
                        >
                          PNG or SVG · max 2 MB · recommended 200×200
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            style={{
                              padding: "8px 16px",
                              borderRadius: 9,
                              border: `1px solid ${T.accent}`,
                              background: T.accentLight,
                              color: T.accent,
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              transition: "all 0.18s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = T.accent;
                              e.target.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = T.accentLight;
                              e.target.style.color = T.accent;
                            }}
                          >
                            Choose File
                          </button>
                          <button
                            style={{
                              padding: "8px 14px",
                              borderRadius: 9,
                              border: `1px solid ${T.border}`,
                              background: T.cardBg,
                              color: T.text3,
                              fontSize: 12.5,
                              cursor: "pointer",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}

            {/* ── NOTIFICATIONS ─────────────────────────── */}
            {activeTab === "notifications" && (
              <div className="card-enter stagger-1">
                <Card
                  title="Notification Preferences"
                  accent={accent}
                  icon={<BellIcon size={13} />}
                  noPad
                >
                  {[
                    {
                      key: "emailNotifs",
                      label: "Email Notifications",
                      desc: "Receive updates and alerts via email",
                    },
                    {
                      key: "smsNotifs",
                      label: "SMS Notifications",
                      desc: "Critical alerts sent to your registered phone",
                    },
                    {
                      key: "trialAlerts",
                      label: "Clinical Trial Alerts",
                      desc: "Notify when trial status changes",
                    },
                    {
                      key: "jobAlerts",
                      label: "Job Application Alerts",
                      desc: "New applications submitted",
                    },
                    {
                      key: "systemAlerts",
                      label: "System Alerts",
                      desc: "Platform health and error notifications",
                    },
                    {
                      key: "weeklyDigest",
                      label: "Weekly Digest",
                      desc: "Summary email every Monday morning",
                    },
                  ].map(({ key, label, desc }, i) => (
                    <div
                      key={key}
                      className={`page-enter stagger-${Math.min(i + 1, 6)}`}
                    >
                      <SettingRow label={label} desc={desc} accent={accent}>
                        <Toggle
                          value={notifs[key]}
                          onChange={setN(key)}
                          accent={accent}
                        />
                      </SettingRow>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* ── SECURITY ──────────────────────────────── */}
            {activeTab === "security" && (
              <>
                <div className="card-enter stagger-1">
                  <Card
                    title="Authentication"
                    accent={accent}
                    icon={<ShieldIcon size={13} />}
                    noPad
                  >
                    {[
                      {
                        key: "twoFactor",
                        label: "Two-Factor Authentication",
                        desc: "Require a verification code on every login",
                      },
                      {
                        key: "loginAlerts",
                        label: "Login Alerts",
                        desc: "Email me when a new device logs in",
                      },
                      {
                        key: "sessionTimeout",
                        label: "Session Timeout",
                        desc: "Auto-logout after 30 minutes of inactivity",
                      },
                      {
                        key: "apiAccess",
                        label: "Enable API Access",
                        desc: "Allow external integrations via REST API",
                      },
                      {
                        key: "ipRestriction",
                        label: "IP Restriction",
                        desc: "Limit access to approved IP ranges only",
                      },
                    ].map(({ key, label, desc }, i) => (
                      <div
                        key={key}
                        className={`page-enter stagger-${Math.min(i + 1, 6)}`}
                      >
                        <SettingRow label={label} desc={desc} accent={accent}>
                          <Toggle
                            value={security[key]}
                            onChange={setSec(key)}
                            accent={accent}
                          />
                        </SettingRow>
                      </div>
                    ))}
                  </Card>
                </div>

                <div className="card-enter stagger-2">
                  <Card
                    title="Change Password"
                    accent={accent}
                    icon={<ShieldIcon size={13} />}
                  >
                    <div style={{ padding: "16px 18px" }}>
                      <Field
                        label="Current Password"
                        value={passwords.current}
                        onChange={setPw("current")}
                        type="password"
                        placeholder="••••••••"
                        accent={accent}
                      />
                      <div className="twocol">
                        <Field
                          label="New Password"
                          value={passwords.next}
                          onChange={setPw("next")}
                          type="password"
                          placeholder="••••••••"
                          accent={accent}
                          hint="Min 8 chars, 1 uppercase, 1 number"
                        />
                        <Field
                          label="Confirm Password"
                          value={passwords.confirm}
                          onChange={setPw("confirm")}
                          type="password"
                          placeholder="••••••••"
                          accent={accent}
                        />
                      </div>

                      {/* Password strength bar */}
                      {passwords.next.length > 0 && (
                        <div
                          className="slide-down"
                          style={{ marginBottom: 16 }}
                        >
                          {(() => {
                            const s =
                              passwords.next.length >= 12
                                ? 4
                                : passwords.next.length >= 8
                                  ? 3
                                  : passwords.next.length >= 5
                                    ? 2
                                    : 1;
                            const labels = [
                              "",
                              "Weak",
                              "Fair",
                              "Good",
                              "Strong",
                            ];
                            const colors = [
                              "",
                              T.rose,
                              T.amber,
                              T.sky,
                              T.green,
                            ];
                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 4,
                                    marginBottom: 4,
                                  }}
                                >
                                  {[1, 2, 3, 4].map((n) => (
                                    <div
                                      key={n}
                                      style={{
                                        flex: 1,
                                        height: 4,
                                        borderRadius: 4,
                                        background:
                                          n <= s ? colors[s] : T.border,
                                        transition: "background 0.3s",
                                      }}
                                    />
                                  ))}
                                </div>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: colors[s],
                                    fontWeight: 600,
                                  }}
                                >
                                  {labels[s]}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      <button
                        onClick={() => alert("Password updated")}
                        style={{
                          padding: "10px 22px",
                          borderRadius: 10,
                          border: "none",
                          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          marginBottom: 4,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          boxShadow: `0 4px 14px ${accent}38`,
                          transition: "transform 0.18s, box-shadow 0.18s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow = `0 6px 20px ${accent}50`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "";
                          e.target.style.boxShadow = `0 4px 14px ${accent}38`;
                        }}
                      >
                        Update Password
                      </button>
                    </div>
                  </Card>
                </div>
              </>
            )}

            {/* ── PORTAL ────────────────────────────────── */}
            {activeTab === "portal" && (
              <div className="card-enter stagger-1">
                <Card
                  title="Portal Configuration"
                  accent={accent}
                  icon={<GlobeIcon size={13} />}
                  noPad
                >
                  {[
                    {
                      key: "publicPortal",
                      label: "Public Portal",
                      desc: "Make your research portal publicly accessible",
                      ac: accent,
                    },
                    {
                      key: "allowRegistration",
                      label: "Allow Public Registration",
                      desc: "Let visitors create accounts on the portal",
                      ac: accent,
                    },
                    {
                      key: "autoPublish",
                      label: "Auto-Publish Jobs",
                      desc: "Automatically publish approved job listings",
                      ac: accent,
                    },
                    {
                      key: "seoEnabled",
                      label: "SEO Optimization",
                      desc: "Enable meta tags and structured data",
                      ac: accent,
                    },
                    {
                      key: "analyticsEnabled",
                      label: "Analytics Tracking",
                      desc: "Enable page-view and event analytics",
                      ac: accent,
                    },
                    {
                      key: "maintenanceMode",
                      label: "Maintenance Mode",
                      desc: "Take the portal offline for maintenance",
                      ac: T.rose,
                    },
                  ].map(({ key, label, desc, ac }, i) => (
                    <div
                      key={key}
                      className={`page-enter stagger-${Math.min(i + 1, 6)}`}
                    >
                      <SettingRow label={label} desc={desc} accent={ac}>
                        <Toggle
                          value={portal[key]}
                          onChange={setP(key)}
                          accent={ac}
                        />
                      </SettingRow>
                    </div>
                  ))}
                  {portal.maintenanceMode && (
                    <div
                      className="slide-down"
                      style={{
                        margin: "4px 16px 14px",
                        padding: "12px 16px",
                        borderRadius: 11,
                        background: T.roseSoft,
                        border: `1px solid ${T.rose}33`,
                        fontSize: 13,
                        color: T.rose,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <AlertIcon size={15} color={T.rose} />
                      Maintenance mode active — portal is offline for visitors.
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ── DANGER ────────────────────────────────── */}
            {activeTab === "danger" && (
              <div className="card-enter stagger-1">
                <div
                  style={{
                    background: T.cardBg,
                    borderRadius: 16,
                    border: `1px solid ${T.rose}33`,
                    overflow: "hidden",
                    boxShadow: `0 4px 24px ${T.rose}0a`,
                  }}
                >
                  <div
                    style={{
                      padding: "12px 18px",
                      borderBottom: `1px solid ${T.rose}22`,
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.rose,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: T.roseSoft,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <AlertIcon size={13} color={T.rose} />
                    Danger Zone
                  </div>
                  {[
                    {
                      label: "Clear All Cache",
                      desc: "Flush platform cache and temporary files",
                      btn: "Clear Cache",
                      dest: false,
                      fn: () => alert("Cache cleared"),
                    },
                    {
                      label: "Export All Data",
                      desc: "Download a full JSON export of your platform data",
                      btn: "Export",
                      dest: false,
                      fn: () => alert("Export started"),
                    },
                    {
                      label: "Reset Portal Settings",
                      desc: "Restore all portal settings to factory defaults",
                      btn: "Reset",
                      dest: true,
                      fn: () =>
                        window.confirm("Reset all portal settings?") &&
                        alert("Reset done"),
                    },
                    {
                      label: "Delete Organization",
                      desc: "Permanently delete this org and all data. Cannot be undone.",
                      btn: "Delete Org",
                      dest: true,
                      fn: () =>
                        window.confirm("Permanently delete organization?") &&
                        alert("Deleted"),
                    },
                  ].map(({ label, desc, btn, dest, fn }, i) => (
                    <div key={i} className={`page-enter stagger-${i + 1}`}>
                      <DangerBtn
                        label={label}
                        desc={desc}
                        btnLabel={btn}
                        onClick={fn}
                        destructive={dest}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Save bar ─────────────────────────────────── */}
        {activeTab !== "danger" && (
          <div className="s-savebar">
            {saved && (
              <div
                className="success-enter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: T.green,
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: T.greenSoft,
                    border: `1px solid ${T.green}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.green,
                  }}
                >
                  <CheckIcon size={12} />
                </div>
                Saved successfully
              </div>
            )}

            <button
              className="s-save-btn"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving
                  ? T.pageBg
                  : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: saving ? T.text3 : "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : `0 4px 16px ${accent}38`,
                border: `1px solid ${saving ? T.border : "transparent"}`,
              }}
            >
              {saving ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      width: 14,
                      height: 14,
                      animation: "spin 0.8s linear infinite",
                    }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
