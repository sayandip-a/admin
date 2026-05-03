/**
 * Dashboard.jsx — Accelia Clinical Solutions
 * Full dark/light theme toggle integrated into the top bar.
 * All existing logic (useAuth, useNavigate, countUp, clock) unchanged.
 */

import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

/* ══════════════════════════════════════════════════════
   THEME CONTEXT — drop ThemeProvider in your App.jsx
   <ThemeProvider><App /></ThemeProvider>
   Then useTheme() anywhere for { dark, toggle }
══════════════════════════════════════════════════════ */
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("accelia-theme") === "dark";
    } catch {
      return false;
    }
  });
  const toggle = () =>
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem("accelia-theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── data ─────────────────────────────────────────────────────── */
const STATS = [
  {
    label: "Total Patients",
    value: 1284,
    change: "+24 this week",
    up: true,
    color: "#3b82f6",
    bg: "#dbeafe",
    darkBg: "rgba(59,130,246,0.15)",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z",
  },
  {
    label: "Active Trials",
    value: 12,
    change: "+3 new",
    up: true,
    color: "#f59e0b",
    bg: "#fef3c7",
    darkBg: "rgba(245,158,11,0.15)",
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18",
  },
  {
    label: "Open Jobs",
    value: 8,
    change: "+2 new today",
    up: true,
    color: "#10b981",
    bg: "#d1fae5",
    darkBg: "rgba(16,185,129,0.15)",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  },
  {
    label: "Pending Alerts",
    value: 5,
    change: "2 urgent",
    up: false,
    color: "#f43f5e",
    bg: "#fee2e2",
    darkBg: "rgba(244,63,94,0.15)",
    icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  },
  {
    label: "Team Members",
    value: 34,
    change: "+6 joined",
    up: true,
    color: "#8b5cf6",
    bg: "#ede9fe",
    darkBg: "rgba(139,92,246,0.15)",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "News Posts",
    value: 23,
    change: "+5 published",
    up: true,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    darkBg: "rgba(14,165,233,0.15)",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
];

const TRIALS = [
  {
    name: "Neurological Disorder Study",
    phase: "Phase I",
    status: "Completed",
    pi: "Dr. A. Shah",
    enrolled: 48,
    color: "#10b981",
    statusBg: "#d1fae5",
    statusDarkBg: "rgba(16,185,129,0.2)",
    statusText: "#065f46",
    statusDarkText: "#6ee7b7",
  },
  {
    name: "Immunotherapy Research",
    phase: "Phase II",
    status: "Active",
    pi: "Dr. R. Patel",
    enrolled: 112,
    color: "#3b82f6",
    statusBg: "#dbeafe",
    statusDarkBg: "rgba(59,130,246,0.2)",
    statusText: "#1e40af",
    statusDarkText: "#93c5fd",
  },
  {
    name: "Diabetes Management Protocol",
    phase: "Phase III",
    status: "Pending",
    pi: "Dr. M. Verma",
    enrolled: 230,
    color: "#f59e0b",
    statusBg: "#fef3c7",
    statusDarkBg: "rgba(245,158,11,0.2)",
    statusText: "#92400e",
    statusDarkText: "#fcd34d",
  },
  {
    name: "Cardiovascular Prevention Trial",
    phase: "Phase II",
    status: "Active",
    pi: "Dr. L. Chen",
    enrolled: 89,
    color: "#8b5cf6",
    statusBg: "#ede9fe",
    statusDarkBg: "rgba(139,92,246,0.2)",
    statusText: "#5b21b6",
    statusDarkText: "#c4b5fd",
  },
  {
    name: "Oncology Biomarker Study",
    phase: "Phase I",
    status: "Recruiting",
    pi: "Dr. K. Iyer",
    enrolled: 21,
    color: "#f43f5e",
    statusBg: "#fee2e2",
    statusDarkBg: "rgba(244,63,94,0.2)",
    statusText: "#9f1239",
    statusDarkText: "#fca5a5",
  },
];

const TEAM = [
  {
    name: "Dr. Priya Mehta",
    dept: "Neurology",
    status: "Online",
    color: "#8b5cf6",
  },
  {
    name: "Dr. James Ford",
    dept: "Immunology",
    status: "In Meeting",
    color: "#3b82f6",
  },
  {
    name: "Dr. Emily Ross",
    dept: "Biostatistics",
    status: "Online",
    color: "#10b981",
  },
  {
    name: "Dr. Arjun Sharma",
    dept: "Oncology",
    status: "Away",
    color: "#f59e0b",
  },
];

const JOBS = [
  {
    title: "Senior Clinical Research Associate",
    dept: "Cardiology",
    type: "Full-time",
    apps: 14,
    posted: "2d ago",
    color: "#3b82f6",
  },
  {
    title: "Biostatistician",
    dept: "Data Science",
    type: "Full-time",
    apps: 9,
    posted: "4d ago",
    color: "#10b981",
  },
  {
    title: "Regulatory Affairs Specialist",
    dept: "Compliance",
    type: "Contract",
    apps: 6,
    posted: "1w ago",
    color: "#f59e0b",
  },
  {
    title: "Clinical Data Manager",
    dept: "IT / Data",
    type: "Full-time",
    apps: 11,
    posted: "3d ago",
    color: "#8b5cf6",
  },
];

const STATUS_COLOR = {
  Online: "#10b981",
  "In Meeting": "#f59e0b",
  Away: "#94a3b8",
};

/* ─── Theme tokens ───────────────────────────────────────────────── */
function getTokens(dark) {
  return dark
    ? {
        pageBg: "#0d1117",
        cardBg: "#161b22",
        topBar: "#161b22",
        border: "rgba(255,255,255,0.08)",
        text1: "#e6edf3",
        text2: "#8b949e",
        text3: "#6e7681",
        head: "#e6edf3",
        accent: "#7c9ef8",
        shadow: "0 1px 3px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.25)",
        shadowH: "0 4px 12px rgba(0,0,0,.4), 0 16px 40px rgba(0,0,0,.3)",
        bannerBg:
          "linear-gradient(135deg,rgba(124,158,248,0.08) 0%,rgba(139,92,246,0.08) 100%)",
        bannerBorder: "rgba(124,158,248,0.2)",
        rowBorder: "rgba(255,255,255,0.05)",
        inputBg: "rgba(255,255,255,0.06)",
        blobOpacity: 0.12,
      }
    : {
        pageBg: "#f4f4f8",
        cardBg: "#ffffff",
        topBar: "#ffffff",
        border: "#e8e8f0",
        text1: "#0f0f23",
        text2: "#52526e",
        text3: "#9494b0",
        head: "#0f0f23",
        accent: "#4f7cff",
        shadow: "0 1px 3px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.06)",
        shadowH: "0 4px 12px rgba(0,0,0,.08), 0 16px 40px rgba(0,0,0,.10)",
        bannerBg: "linear-gradient(135deg,#f0f4ff 0%,#faf0ff 100%)",
        bannerBorder: "#dde4ff",
        rowBorder: "#f0f0f6",
        inputBg: "#ffffff",
        blobOpacity: 0.55,
      };
}

/* ─── Global CSS ─────────────────────────────────────────────────── */
function buildCSS(T) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap');
  html,body,#root { margin:0!important;padding:0!important;height:100%!important;width:100%!important;overflow:hidden!important; }
  *,*::before,*::after { box-sizing:border-box; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(79,124,255,.18);border-radius:4px; }

  @keyframes dashFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
  @keyframes pulseDot   { 0%,100%{box-shadow:0 0 0 0 currentColor} 60%{box-shadow:0 0 0 5px transparent} }
  @keyframes logoutPop  { 0%{transform:scale(1)} 40%{transform:scale(.82) rotate(12deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes countUp    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  @keyframes themeToggle { 0%{transform:scale(1)} 50%{transform:scale(0.85)} 100%{transform:scale(1)} }
  @keyframes sunRise    { from{transform:rotate(-30deg) scale(0.7);opacity:0} to{transform:rotate(0) scale(1);opacity:1} }
  @keyframes moonRise   { from{transform:rotate(30deg) scale(0.7);opacity:0} to{transform:rotate(0) scale(1);opacity:1} }

  .d-card {
    background:${T.cardBg};border:1.5px solid ${T.border};border-radius:16px;
    box-shadow:${T.shadow};transition:border-color .22s,transform .22s,box-shadow .22s,background .3s;
  }
  .d-card:hover { border-color:${T.accent}30;transform:translateY(-3px);box-shadow:${T.shadowH}; }

  .d-stat-card {
    background:${T.cardBg};border:1.5px solid ${T.border};border-radius:16px;
    padding:20px 18px 16px;box-shadow:${T.shadow};
    transition:all .26s cubic-bezier(.34,1.56,.64,1),background .3s,border-color .3s;
    cursor:default;position:relative;overflow:hidden;
  }
  .d-stat-card:hover { transform:translateY(-4px) scale(1.02);box-shadow:${T.shadowH}; }

  .d-topbar-btn {
    width:36px;height:36px;border-radius:9px;border:1.5px solid ${T.border};
    background:${T.inputBg};display:flex;align-items:center;justify-content:center;
    cursor:pointer;color:${T.text3};transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.06);
  }
  .d-topbar-btn:hover { border-color:${T.accent};color:${T.accent}; }

  /* ── Theme toggle button ── */
  .theme-toggle-btn {
    display:flex;align-items:center;gap:8px;
    padding:7px 14px 7px 10px;
    border-radius:10px;
    border:1.5px solid ${T.border};
    background:${T.inputBg};
    cursor:pointer;
    transition:all .25s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 1px 3px rgba(0,0,0,.06);
    user-select:none;
    position:relative;
    overflow:hidden;
  }
  .theme-toggle-btn:hover {
    border-color:${T.accent};
    box-shadow:0 0 0 3px ${T.accent}20, 0 2px 8px rgba(0,0,0,.1);
    transform:translateY(-1px);
  }
  .theme-toggle-btn:active { transform:scale(0.96); }

  /* pill track */
  .tt-track {
    width:32px;height:18px;border-radius:9px;
    background:${T.border};position:relative;
    transition:background .3s;
    flex-shrink:0;
  }
  .tt-track.on { background:${T.accent}; }
  .tt-knob {
    position:absolute;top:2px;left:2px;
    width:14px;height:14px;border-radius:7px;
    background:#fff;
    box-shadow:0 1px 4px rgba(0,0,0,.25);
    transition:transform .3s cubic-bezier(.34,1.56,.64,1);
  }
  .tt-track.on .tt-knob { transform:translateX(14px); }

  .d-logout-btn {
    width:36px;height:36px;border-radius:9px;border:1.5px solid ${T.border};
    background:${T.inputBg};display:flex;align-items:center;justify-content:center;
    cursor:pointer;color:${T.text3};transition:all .22s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  }
  .d-logout-btn:hover { border-color:#fca5a5;color:#f43f5e;background:${T.cardBg};transform:scale(1.08); }

  .d-view-all {
    font-size:11px;font-weight:700;color:${T.accent};letter-spacing:.04em;
    cursor:pointer;font-family:'Instrument Sans',sans-serif;
    transition:color .15s;text-decoration:none;background:none;border:none;
  }
  .d-view-all:hover { opacity:0.75; }

  .d-row-item {
    display:flex;align-items:center;gap:10px;padding:10px 0;
    transition:background .15s;
  }
  .d-row-item:not(:last-child) { border-bottom:1px solid ${T.rowBorder}; }

  @media(max-width:700px) {
    .d-stats  { grid-template-columns:repeat(2,1fr)!important; }
    .d-panels { grid-template-columns:1fr!important; }
    .d-clock-wrap { display:none!important; }
    .theme-label { display:none!important; }
  }
  @media(max-width:440px) {
    .d-stats { grid-template-columns:repeat(2,1fr)!important;gap:10px!important; }
  }
`;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
function Icon({ d, size = 15 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function useCountUp(target, go) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let raf;
    const t0 = performance.now(),
      dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, go]);
  return n;
}

/* ─── Sun icon ───────────────────────────────────────────────────── */
function SunIcon({ size = 15, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      style={{ animation: "sunRise .3s ease both", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/* ─── Moon icon ──────────────────────────────────────────────────── */
function MoonIcon({ size = 15, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      style={{ animation: "moonRise .3s ease both", flexShrink: 0 }}
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

/* ─── Theme Toggle Button ────────────────────────────────────────── */
function ThemeToggleButton() {
  const { dark, toggle } = useTheme();
  const T = getTokens(dark);

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{ fontFamily: "'Instrument Sans',sans-serif" }}
    >
      {/* Icon */}
      <div
        style={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dark ? (
          <SunIcon size={16} color={T.accent} />
        ) : (
          <MoonIcon size={16} color={T.text2} />
        )}
      </div>
      {/* Label */}
      <span
        className="theme-label"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: T.text2,
          transition: "color .3s",
          whiteSpace: "nowrap",
        }}
      >
        {dark ? "Light" : "Dark"}
      </span>
      {/* Toggle pill */}
      <div className={`tt-track${dark ? " on" : ""}`}>
        <div className="tt-knob" />
      </div>
    </button>
  );
}

/* ─── AnalogClock ────────────────────────────────────────────────── */
function AnalogClock({ t, T }) {
  const h = t.getHours(),
    m = t.getMinutes(),
    s = t.getSeconds();
  const hDeg = (h % 12) * 30 + m * 0.5,
    mDeg = m * 6 + s * 0.1,
    sDeg = s * 6;
  const arm = (deg, len) => ({
    x: 20 + len * Math.cos(((deg - 90) * Math.PI) / 180),
    y: 20 + len * Math.sin(((deg - 90) * Math.PI) / 180),
  });
  return (
    <svg width="42" height="42" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
      <circle
        cx="20"
        cy="20"
        r="18"
        fill={T.inputBg}
        stroke={T.border}
        strokeWidth="1.2"
      />
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180,
          r1 = i % 3 === 0 ? 12 : 13.5;
        return (
          <line
            key={i}
            x1={20 + r1 * Math.cos(a)}
            y1={20 + r1 * Math.sin(a)}
            x2={20 + 15 * Math.cos(a)}
            y2={20 + 15 * Math.sin(a)}
            stroke={i % 3 === 0 ? T.accent : "#c8c8e8"}
            strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
          />
        );
      })}
      <line
        x1="20"
        y1="20"
        x2={arm(hDeg, 7).x}
        y2={arm(hDeg, 7).y}
        stroke={T.head}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2={arm(mDeg, 11).x}
        y2={arm(mDeg, 11).y}
        stroke={T.accent}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2={arm(sDeg, 12).x}
        y2={arm(sDeg, 12).y}
        stroke="#f43f5e"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="2.2" fill={T.accent} />
    </svg>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────── */
function StatCard({ s, idx, go }) {
  const { dark } = useTheme();
  const T = getTokens(dark);
  const num = useCountUp(s.value, go);
  const iconBg = dark ? s.darkBg : s.bg;
  return (
    <div
      className="d-stat-card"
      style={{ animation: `dashFadeUp .5s ease ${idx * 70}ms both` }}
    >
      <div
        style={{
          position: "absolute",
          top: -18,
          right: -18,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: dark ? s.darkBg : s.bg,
          opacity: T.blobOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: iconBg,
          color: s.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Icon d={s.icon} size={17} />
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 30,
          fontWeight: 800,
          color: T.head,
          lineHeight: 1,
          letterSpacing: "-.5px",
          animation: go ? "countUp .4s ease both" : "none",
        }}
      >
        {num.toLocaleString()}
      </div>
      <div
        style={{
          fontSize: 11,
          color: T.text3,
          marginTop: 6,
          fontWeight: 700,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          fontFamily: "'Instrument Sans',sans-serif",
        }}
      >
        {s.label}
      </div>
      <div
        style={{
          fontSize: 11.5,
          marginTop: 9,
          color: s.up ? "#15803d" : "#b91c1c",
          background: dark
            ? s.up
              ? "rgba(21,128,61,0.2)"
              : "rgba(185,28,28,0.2)"
            : s.up
              ? "#dcfce7"
              : "#fee2e2",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 9px",
          borderRadius: 999,
          fontWeight: 600,
          fontFamily: "'Instrument Sans',sans-serif",
          color: s.up
            ? dark
              ? "#86efac"
              : "#15803d"
            : dark
              ? "#fca5a5"
              : "#b91c1c",
        }}
      >
        {s.up ? "↑" : "↓"} {s.change}
      </div>
    </div>
  );
}

/* ─── SectionCard ────────────────────────────────────────────────── */
function SectionCard({ title, action, actionLabel, delay = 0, children }) {
  const { dark } = useTheme();
  const T = getTokens(dark);
  return (
    <div
      className="d-card"
      style={{
        padding: "20px 20px 14px",
        animation: `dashFadeUp .5s ease ${delay}ms both`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: T.head,
          }}
        >
          {title}
        </span>
        {action && (
          <button className="d-view-all" onClick={action}>
            {actionLabel || "VIEW ALL →"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name, color, size = 32 }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: color + "20",
        border: `1.5px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 800,
        color,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────── */
export default function Dashboard() {
  const { admin, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const T = getTokens(dark);

  const [time, setTime] = useState(new Date());
  const [go, setGo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoutAnim, setLogoutAnim] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMounted(true);
    const id = setTimeout(() => setGo(true), 300);
    return () => clearTimeout(id);
  }, []);

  const handleLogout = () => {
    setLogoutAnim(true);
    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 650);
  };

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const firstName = admin?.name?.split(" ")[0] || "Admin";

  return (
    <>
      <style>{buildCSS(T)}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          fontFamily: "'Instrument Sans',sans-serif",
          background: T.pageBg,
          color: T.text1,
          overflow: "hidden",
          transition: "background .3s, color .3s",
        }}
      >
        {/* ── TOP BAR ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: 62,
            flexShrink: 0,
            background: T.topBar,
            borderBottom: `1.5px solid ${T.border}`,
            boxShadow: "0 1px 8px rgba(0,0,0,.06)",
            gap: 12,
            zIndex: 10,
            transition: "background .3s, border-color .3s",
          }}
        >
          {/* Left — title */}
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: T.head,
                lineHeight: 1,
                letterSpacing: "-.3px",
                transition: "color .3s",
              }}
            >
              Dashboard
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: T.text3,
                marginTop: 3,
                fontWeight: 500,
                transition: "color .3s",
              }}
            >
              {dateStr}
            </div>
          </div>

          {/* Centre — analog clock */}
          <div
            className="d-clock-wrap"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <AnalogClock t={time} T={T} />
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 17,
                  fontWeight: 800,
                  color: T.accent,
                  letterSpacing: 0.4,
                  fontVariantNumeric: "tabular-nums",
                  transition: "color .3s",
                }}
              >
                {timeStr}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: T.text3,
                  marginTop: 1,
                  transition: "color .3s",
                }}
              >
                {dateStr}
              </div>
            </div>
          </div>

          {/* Right — actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* ── THEME TOGGLE BUTTON ── */}
            <ThemeToggleButton />

            {/* Bell */}
            <div className="d-topbar-btn" style={{ position: "relative" }}>
              <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#f43f5e",
                  border: "1.5px solid #fff",
                }}
              />
            </div>

            {/* Admin pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "5px 12px 5px 6px",
                borderRadius: 10,
                border: `1.5px solid ${T.border}`,
                background: T.inputBg,
                boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                transition: "background .3s, border-color .3s",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#4f7cff,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                {(admin?.name || "AD").slice(0, 2).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: T.text1,
                  fontWeight: 600,
                  transition: "color .3s",
                }}
              >
                {admin?.name || "Admin"}
              </span>
            </div>

            {/* Logout */}
            <div
              className="d-logout-btn"
              onClick={handleLogout}
              title="Logout"
              style={{
                animation: logoutAnim ? "logoutPop .65s ease forwards" : "none",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 15, height: 15 }}
              >
                <path
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ───────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            padding: "22px 24px 36px",
            transition: "background .3s",
          }}
        >
          {/* Welcome banner */}
          <div
            style={{
              marginBottom: 22,
              padding: "18px 22px",
              background: T.bannerBg,
              border: `1.5px solid ${T.bannerBorder}`,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              animation: mounted ? "dashFadeUp .5s ease both" : "none",
              boxShadow: `0 2px 12px ${T.accent}12`,
              transition: "background .3s, border-color .3s",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: T.head,
                  letterSpacing: "-.2px",
                  transition: "color .3s",
                }}
              >
                Welcome back, {firstName} 👋
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: T.text2,
                  marginTop: 4,
                  fontWeight: 500,
                  transition: "color .3s",
                }}
              >
                Here's what's happening across your clinical network today.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 16px",
                borderRadius: 999,
                background: dark ? "rgba(16,185,129,0.15)" : "#dcfce7",
                border: dark
                  ? "1.5px solid rgba(16,185,129,0.3)"
                  : "1.5px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: "pulseDot 2s infinite",
                  color: "#22c55e",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: dark ? "#86efac" : "#15803d",
                  fontWeight: 700,
                }}
              >
                All systems operational
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div
            className="d-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 14,
              marginBottom: 20,
              width: "100%",
            }}
          >
            {STATS.map((s, i) => (
              <StatCard key={s.label} s={s} idx={i} go={go} />
            ))}
          </div>

          {/* Bottom panels */}
          <div
            className="d-panels"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              width: "100%",
              minWidth: 0,
            }}
          >
            {/* Recent Trials */}
            <SectionCard
              title="Recent Trials"
              actionLabel="VIEW ALL →"
              action={() => {}}
              delay={350}
            >
              {TRIALS.map((t, i) => (
                <div key={i} className="d-row-item">
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: t.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: T.head,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        transition: "color .3s",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: T.text3,
                        marginTop: 2,
                        fontWeight: 500,
                        transition: "color .3s",
                      }}
                    >
                      {t.phase} · {t.pi} · {t.enrolled} enrolled
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                      flexShrink: 0,
                      color: dark ? t.statusDarkText : t.statusText,
                      background: dark ? t.statusDarkBg : t.statusBg,
                      fontFamily: "'Instrument Sans',sans-serif",
                      transition: "all .3s",
                    }}
                  >
                    {t.status}
                  </div>
                </div>
              ))}
            </SectionCard>

            {/* Right column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minWidth: 0,
              }}
            >
              {/* Team Members */}
              <SectionCard
                title="Team Members"
                actionLabel="VIEW ALL →"
                action={() => {}}
                delay={450}
              >
                {TEAM.map((m, i) => (
                  <div key={i} className="d-row-item">
                    <Avatar name={m.name} color={m.color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: T.head,
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          transition: "color .3s",
                        }}
                      >
                        {m.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.text3,
                          fontWeight: 500,
                          transition: "color .3s",
                        }}
                      >
                        {m.dept}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: STATUS_COLOR[m.status] || T.text3,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: STATUS_COLOR[m.status] || T.text3,
                          fontFamily: "'Instrument Sans',sans-serif",
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* Open Jobs */}
              <SectionCard
                title="Open Job Posts"
                actionLabel="POST JOB →"
                action={() => {}}
                delay={540}
              >
                {JOBS.map((j, i) => (
                  <div key={i} className="d-row-item">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        flexShrink: 0,
                        background: j.color + "18",
                        border: `1.5px solid ${j.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: j.color,
                      }}
                    >
                      <Icon
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                        size={13}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: T.head,
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          transition: "color .3s",
                        }}
                      >
                        {j.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.text3,
                          fontWeight: 500,
                          transition: "color .3s",
                        }}
                      >
                        {j.dept} · {j.type} · {j.posted}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: T.text3,
                        flexShrink: 0,
                        textAlign: "right",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          color: j.color,
                          fontWeight: 800,
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 13,
                        }}
                      >
                        {j.apps}
                      </span>
                      <span style={{ fontSize: 10.5, marginLeft: 2 }}>
                        apps
                      </span>
                    </div>
                  </div>
                ))}
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
