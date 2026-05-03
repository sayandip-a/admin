import { useState, useEffect } from "react";

// ─── Modern Icon Components ───────────────────────────────────────────────────
const Icon = ({ d, size = 16, strokeWidth = 1.8 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size, flexShrink: 0 }}
  >
    {Array.isArray(d) ? (
      d.map((path, i) => <path key={i} d={path} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const Icons = {
  dashboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  ),
  trials: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M8 3v5.5L4.5 14A4 4 0 008 20h8a4 4 0 003.5-6L16 8.5V3" />
      <line x1="6" y1="3" x2="18" y2="3" />
      <path d="M10 13h4" />
    </svg>
  ),
  analytics: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-5 4 3 4-6" />
    </svg>
  ),
  news: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </svg>
  ),
  jobs: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
    </svg>
  ),
  solutions: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  contacts: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  locations: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  about: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  team: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  settings: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 15, height: 15 }}
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  chevronLeft: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 14, height: 14 }}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
};

const navSections = [
  {
    label: "Main Menu",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
      { id: "trials", label: "Clinical Trials", icon: Icons.trials },
      { id: "analytics", label: "Analytics", icon: Icons.analytics },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "news", label: "News & Events", icon: Icons.news },
      { id: "jobs", label: "Jobs", icon: Icons.jobs },
      { id: "solutions", label: "Solutions", icon: Icons.solutions },
      { id: "contacts", label: "Contacts", icon: Icons.contacts },
      { id: "locations", label: "Locations", icon: Icons.locations },
      { id: "aboutadmin", label: "About Us", icon: Icons.about },
    ],
  },
  {
    label: "Admin",
    items: [
      { id: "team", label: "Team", icon: Icons.team },
      { id: "settings", label: "Settings", icon: Icons.settings },
    ],
  },
];

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  sbBg: "#f0f1f7",
  sbBgDeep: "#e8eaf2",
  sbBorder: "#e0e2ef",
  activeBg: "#ffffff",
  activeBorder: "#d4d8f5",
  activeText: "#2B3AE7",
  activeBar: "#2B3AE7",
  hoverBg: "rgba(43,58,231,0.05)",
  text1: "#1a1b2e",
  text2: "#6b7090",
  text3: "#a8adcb",
  accent: "#2B3AE7",
  accentLight: "#eef0fd",
  danger: "#e53e3e",
  dangerBg: "rgba(229,62,62,0.08)",
  dangerBorder: "rgba(229,62,62,0.25)",
  headerBg: "#f0f1f7",
  footerBg: "#e8eaf2",
  avatarBg: "#2B3AE7",
  online: "#22c55e",
};

// ─── CSS & Animations ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap');

  :root {
    --sb-bg: ${T.sbBg};
    --sb-border: ${T.sbBorder};
    --sb-active: ${T.activeText};
  }

  nav::-webkit-scrollbar { display: none; }

  @keyframes fadeSlideIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes barSlide     { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }
  @keyframes logoFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
  @keyframes iconSpin     { from{transform:rotate(0)} to{transform:rotate(90deg)} }
  @keyframes onlinePulse  { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 60%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
  @keyframes logoutSlide  { 0%{transform:translateX(0);opacity:1} 45%{transform:translateX(6px);opacity:0} 50%{transform:translateX(-4px);opacity:0} 100%{transform:translateX(0);opacity:1} }
  @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }

  /* hamburger */
  @keyframes bar1ToX  { from{transform:translateY(0) rotate(0)} to{transform:translateY(6px) rotate(45deg)} }
  @keyframes bar2Fade { from{opacity:1;transform:scaleX(1)} to{opacity:0;transform:scaleX(0)} }
  @keyframes bar3ToX  { from{transform:translateY(0) rotate(0)} to{transform:translateY(-6px) rotate(-45deg)} }
  @keyframes bar1Back { from{transform:translateY(6px) rotate(45deg)} to{transform:translateY(0) rotate(0)} }
  @keyframes bar2Show { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }
  @keyframes bar3Back { from{transform:translateY(-6px) rotate(-45deg)} to{transform:translateY(0) rotate(0)} }

  .sb-item {
    transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease, transform 0.14s ease !important;
  }
  .sb-item:hover { transform: translateX(2px); }
  .sb-item:hover .sb-icon { transform: scale(1.12); transition: transform 0.2s ease; }
  .sb-item[data-id="settings"]:hover .sb-icon { animation: iconSpin 0.4s ease both !important; }
  .sb-item:active { transform: translateX(1px) scale(0.98); }

  .sb-logout { transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.14s !important; }
  .sb-logout:hover { transform: translateX(2px); }
  .sb-logout:hover .logout-icon { animation: logoutSlide 0.44s ease both; }

  .nav-section { animation: fadeSlideIn 0.3s ease both; }

  .collapse-btn { transition: background 0.18s, transform 0.32s cubic-bezier(0.4,0,0.2,1) !important; }
  .collapse-btn:hover { background: ${T.activeBg} !important; box-shadow: 0 1px 6px rgba(43,58,231,0.15) !important; }

  .hb-bar { transform-origin: center; display: block; }
  .hb-open .hb-bar1  { animation: bar1ToX 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
  .hb-open .hb-bar2  { animation: bar2Fade 0.18s ease forwards; }
  .hb-open .hb-bar3  { animation: bar3ToX 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
  .hb-close .hb-bar1 { animation: bar1Back 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
  .hb-close .hb-bar2 { animation: bar2Show 0.2s ease 0.04s forwards; }
  .hb-close .hb-bar3 { animation: bar3Back 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function AcceliaLogo({ collapsed }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        overflow: "hidden",
      }}
    >
      {/* Icon mark */}
      <div
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          background: T.accent,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(43,58,231,0.3)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12,3 22,21 2,21" />
          <line
            x1="6.5"
            y1="15"
            x2="17.5"
            y2="15"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
      {/* Wordmark */}
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : 160,
          transition: collapsed
            ? "opacity 0.1s, max-width 0.32s cubic-bezier(0.4,0,0.2,1)"
            : "opacity 0.2s ease 0.06s, max-width 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: T.text1,
            fontFamily: "'Manrope', sans-serif",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
          }}
        >
          ACCELIA
        </div>
        <div
          style={{
            fontSize: 9,
            color: T.text3,
            marginTop: 2,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Clinical Solutions
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function OnlineDot() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: T.online,
        border: `2px solid ${T.sbBg}`,
        animation: "onlinePulse 2.5s ease-in-out infinite",
      }}
    />
  );
}

function HamburgerIcon({ isOpen, size = 20 }) {
  const [prev, setPrev] = useState(null);
  useEffect(() => {
    if (prev === null) setPrev(isOpen);
  }, []);
  useEffect(() => {
    setPrev(isOpen);
  }, [isOpen]);
  const cls = prev === null ? "" : isOpen ? "hb-open" : "hb-close";
  return (
    <svg
      viewBox="0 0 22 22"
      width={size}
      height={size}
      style={{ display: "block", overflow: "visible" }}
    >
      {["hb-bar1 5", "hb-bar2 11", "hb-bar3 17"].map((s) => {
        const [c, y] = s.split(" ");
        return (
          <line
            key={y}
            className={`hb-bar ${c} ${cls}`}
            x1="3"
            y1={y}
            x2="19"
            y2={y}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// ─── Mobile Bottom Nav Icons ──────────────────────────────────────────────────
const MobIcons = {
  dashboard: ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 22, height: 22 }}
      stroke={active ? T.accent : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="2.5"
        fill={active ? T.accentLight : "none"}
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="2.5"
        fill={active ? T.accentLight : "none"}
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="2.5"
        fill={active ? T.accentLight : "none"}
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        rx="2.5"
        fill={active ? T.accentLight : "none"}
      />
    </svg>
  ),
  trials: ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 22, height: 22 }}
      stroke={active ? T.accent : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M8 3v5.5L4.5 14A4 4 0 008 20h8a4 4 0 003.5-6L16 8.5V3"
        fill={active ? T.accentLight : "none"}
      />
      <line x1="6" y1="3" x2="18" y2="3" />
    </svg>
  ),
  analytics: ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 22, height: 22 }}
      stroke={active ? T.accent : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-5 4 3 4-6" />
    </svg>
  ),
  news: ({ active }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: 22, height: 22 }}
      stroke={active ? T.accent : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        fill={active ? T.accentLight : "none"}
      />
      <path d="M7 8h10M7 12h7M7 16h5" />
    </svg>
  ),
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

// ─── Shared Nav Item ──────────────────────────────────────────────────────────
function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isHovered,
}) {
  return (
    <div
      key={item.id}
      data-id={item.id}
      className="sb-item"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: collapsed ? "9px 0" : "8px 10px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9,
        cursor: "pointer",
        marginBottom: 1,
        position: "relative",
        overflow: "hidden",
        color: isActive ? T.activeText : isHovered ? T.text1 : T.text2,
        background: isActive
          ? T.activeBg
          : isHovered
            ? T.hoverBg
            : "transparent",
        border: isActive
          ? `0.5px solid ${T.activeBorder}`
          : "0.5px solid transparent",
        boxShadow: isActive ? "0 1px 6px rgba(43,58,231,0.08)" : "none",
        userSelect: "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Active bar */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "18%",
            bottom: "18%",
            width: 3,
            background: T.activeBar,
            borderRadius: "0 3px 3px 0",
            animation: "barSlide 0.22s ease both",
            transformOrigin: "center",
          }}
        />
      )}
      {/* Shimmer */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(43,58,231,0.04) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease infinite",
          }}
        />
      )}

      <span
        className="sb-icon"
        style={{
          display: "flex",
          alignItems: "center",
          transition: "transform 0.2s ease",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>

      <span
        style={{
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          whiteSpace: "nowrap",
          flex: 1,
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : "auto",
          overflow: "hidden",
          transition: collapsed ? "opacity 0.1s" : "opacity 0.15s ease 0.04s",
        }}
      >
        {item.label}
      </span>

      {isActive && !collapsed && (
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: T.accent,
            flexShrink: 0,
            opacity: 0.7,
          }}
        />
      )}
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
function DesktopSidebar({ activePage, setActivePage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [searchVal, setSearchVal] = useState("");
  const [logoutHov, setLogoutHov] = useState(false);

  const W = collapsed ? 66 : 258;
  const allItems = navSections.flatMap((s) => s.items);
  const filteredIds = searchVal
    ? new Set(
        allItems
          .filter((i) =>
            i.label.toLowerCase().includes(searchVal.toLowerCase()),
          )
          .map((i) => i.id),
      )
    : null;

  const handleMouseEnter = (id, e) => {
    setHovered(id);
    if (collapsed) {
      const r = e.currentTarget.getBoundingClientRect();
      setTooltipPos({ top: r.top + r.height / 2, left: r.right + 8 });
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* Tooltip */}
      {collapsed && hovered && (
        <div
          style={{
            position: "fixed",
            top: tooltipPos.top - 14,
            left: tooltipPos.left,
            background: T.text1,
            color: "#fff",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 7,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {allItems.find((i) => i.id === hovered)?.label}
          <div
            style={{
              position: "absolute",
              left: -4,
              top: "50%",
              width: 7,
              height: 7,
              background: T.text1,
              borderRadius: 1,
              transform: "translateY(-50%) rotate(45deg)",
            }}
          />
        </div>
      )}

      <aside
        style={{
          width: W,
          minWidth: W,
          height: "100vh",
          background: T.sbBg,
          borderRight: `1px solid ${T.sbBorder}`,
          display: "flex",
          flexDirection: "column",
          transition:
            "width 0.32s cubic-bezier(0.4,0,0.2,1), min-width 0.32s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          flexShrink: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: collapsed ? "16px 0 14px" : "16px 14px 14px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderBottom: `1px solid ${T.sbBorder}`,
            flexShrink: 0,
            minHeight: 68,
            position: "relative",
            transition: "padding 0.32s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div style={{ animation: "logoFloat 4s ease-in-out infinite" }}>
            <AcceliaLogo collapsed={collapsed} />
          </div>

          {/* Collapse btn */}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: "absolute",
              right: collapsed ? "50%" : 10,
              top: "50%",
              transform: collapsed
                ? "translateY(-50%) translateX(50%) rotate(180deg)"
                : "translateY(-50%)",
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: T.activeBg,
              border: `0.5px solid ${T.activeBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.text2,
              padding: 0,
              zIndex: 2,
            }}
          >
            {Icons.chevronLeft}
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            padding: collapsed ? 0 : "10px 10px 4px",
            flexShrink: 0,
            overflow: "hidden",
            opacity: collapsed ? 0 : 1,
            maxHeight: collapsed ? 0 : 56,
            transition: "opacity 0.18s, max-height 0.28s, padding 0.28s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.activeBg,
              border: `0.5px solid ${searchVal ? T.accent : T.sbBorder}`,
              borderRadius: 9,
              padding: "7px 10px",
              transition: "border-color 0.18s",
            }}
          >
            <span style={{ color: T.text3, display: "flex" }}>
              {Icons.search}
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text1,
                fontSize: 12.5,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                flex: 1,
              }}
            />
            {searchVal && (
              <span
                onClick={() => setSearchVal("")}
                style={{ cursor: "pointer", color: T.text3, fontSize: 11 }}
              >
                ✕
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: collapsed ? "8px 5px" : "4px 8px",
            scrollbarWidth: "none",
          }}
        >
          {navSections.map((section, si) => (
            <div
              key={si}
              className="nav-section"
              style={{ animationDelay: `${si * 0.04}s` }}
            >
              {si > 0 && (
                <div
                  style={{
                    height: 1,
                    background: T.sbBorder,
                    margin: "5px 4px",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: T.text3,
                  padding: collapsed ? 0 : "10px 6px 4px",
                  opacity: collapsed ? 0 : 1,
                  maxHeight: collapsed ? 0 : 28,
                  overflow: "hidden",
                  transition: "opacity 0.14s, max-height 0.28s, padding 0.28s",
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                if (filteredIds && !filteredIds.has(item.id)) return null;
                return (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activePage === item.id}
                    collapsed={collapsed}
                    isHovered={hovered === item.id}
                    onClick={() => setActivePage(item.id)}
                    onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </div>
          ))}
          {filteredIds && filteredIds.size === 0 && (
            <div style={{ padding: "14px 8px", color: T.text3, fontSize: 12 }}>
              No results found
            </div>
          )}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: collapsed ? "10px 6px" : "10px 10px",
            borderTop: `1px solid ${T.sbBorder}`,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            background: T.footerBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: T.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                position: "relative",
                fontFamily: "'Manrope', sans-serif",
                boxShadow: "0 2px 6px rgba(43,58,231,0.3)",
              }}
            >
              AD
              <OnlineDot />
            </div>
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                transition: "opacity 0.14s",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: T.text1,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Admin User
              </div>
              <div style={{ fontSize: 10.5, color: T.text3, marginTop: 1 }}>
                Administrator
              </div>
            </div>
          </div>

          <button
            className="sb-logout"
            onClick={onLogout}
            onMouseEnter={() => setLogoutHov(true)}
            onMouseLeave={() => setLogoutHov(false)}
            title={collapsed ? "Sign Out" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 8,
              width: "100%",
              padding: collapsed ? "8px 0" : "8px 10px",
              borderRadius: 9,
              background: logoutHov ? T.dangerBg : T.activeBg,
              border: `0.5px solid ${logoutHov ? T.dangerBorder : T.sbBorder}`,
              color: logoutHov ? T.danger : T.text2,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            <span
              className="logout-icon"
              style={{ display: "flex", alignItems: "center" }}
            >
              {Icons.logout}
            </span>
            <span
              style={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                overflow: "hidden",
                whiteSpace: "nowrap",
                transition: collapsed
                  ? "opacity 0.1s"
                  : "opacity 0.15s ease 0.04s",
              }}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ activePage, setActivePage, open, onClose, onLogout }) {
  const [searchVal, setSearchVal] = useState("");
  const [logoutHov, setLogoutHov] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const allItems = navSections.flatMap((s) => s.items);
  const filteredIds = searchVal
    ? new Set(
        allItems
          .filter((i) =>
            i.label.toLowerCase().includes(searchVal.toLowerCase()),
          )
          .map((i) => i.id),
      )
    : null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(15,17,40,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 282,
          zIndex: 50,
          background: T.sbBg,
          borderRight: `1px solid ${T.sbBorder}`,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.12)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 14px",
            borderBottom: `1px solid ${T.sbBorder}`,
            flexShrink: 0,
          }}
        >
          <AcceliaLogo collapsed={false} />
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.activeBg,
              border: `0.5px solid ${T.sbBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.text2,
              padding: 0,
            }}
          >
            {Icons.close}
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 12px 4px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.activeBg,
              border: `0.5px solid ${searchVal ? T.accent : T.sbBorder}`,
              borderRadius: 9,
              padding: "8px 11px",
              transition: "border-color 0.18s",
            }}
          >
            <span style={{ color: T.text3, display: "flex" }}>
              {Icons.search}
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text1,
                fontSize: 13,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                flex: 1,
              }}
            />
            {searchVal && (
              <span
                onClick={() => setSearchVal("")}
                style={{ cursor: "pointer", color: T.text3, fontSize: 11 }}
              >
                ✕
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "4px 10px",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {navSections.map((section, si) => (
            <div key={si}>
              {si > 0 && (
                <div
                  style={{
                    height: 1,
                    background: T.sbBorder,
                    margin: "5px 2px",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: T.text3,
                  padding: "10px 6px 4px",
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                if (filteredIds && !filteredIds.has(item.id)) return null;
                const isActive = activePage === item.id;
                return (
                  <div
                    key={item.id}
                    data-id={item.id}
                    className="sb-item"
                    onClick={() => {
                      setActivePage(item.id);
                      onClose();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: "10px 10px",
                      borderRadius: 9,
                      cursor: "pointer",
                      marginBottom: 1,
                      position: "relative",
                      overflow: "hidden",
                      color: isActive ? T.activeText : T.text2,
                      background: isActive ? T.activeBg : "transparent",
                      border: `0.5px solid ${isActive ? T.activeBorder : "transparent"}`,
                      boxShadow: isActive
                        ? "0 1px 6px rgba(43,58,231,0.08)"
                        : "none",
                      minHeight: 42,
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "18%",
                          bottom: "18%",
                          width: 3,
                          background: T.activeBar,
                          borderRadius: "0 3px 3px 0",
                        }}
                      />
                    )}
                    <span
                      className="sb-icon"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: isActive ? 600 : 500,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {filteredIds && filteredIds.size === 0 && (
            <div style={{ padding: "14px 8px", color: T.text3, fontSize: 13 }}>
              No results found
            </div>
          )}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "12px 14px 16px",
            borderTop: `1px solid ${T.sbBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 9,
            flexShrink: 0,
            background: T.footerBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: T.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                position: "relative",
                fontFamily: "'Manrope', sans-serif",
                boxShadow: "0 2px 6px rgba(43,58,231,0.3)",
              }}
            >
              AD <OnlineDot />
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.text1,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Admin User
              </div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>
                Administrator
              </div>
            </div>
          </div>
          <button
            className="sb-logout"
            onClick={() => {
              onClose();
              setTimeout(onLogout, 180);
            }}
            onMouseEnter={() => setLogoutHov(true)}
            onMouseLeave={() => setLogoutHov(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "10px 14px",
              borderRadius: 9,
              background: logoutHov ? T.dangerBg : T.activeBg,
              border: `0.5px solid ${logoutHov ? T.dangerBorder : T.sbBorder}`,
              color: logoutHov ? T.danger : T.text2,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <span className="logout-icon" style={{ display: "flex" }}>
              {Icons.logout}
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileBottomNav({
  activePage,
  setActivePage,
  onMenuOpen,
  drawerOpen,
}) {
  const mobileItems = [
    { id: "dashboard", label: "Home", IconComp: MobIcons.dashboard },
    { id: "trials", label: "Trials", IconComp: MobIcons.trials },
    { id: "analytics", label: "Stats", IconComp: MobIcons.analytics },
    { id: "news", label: "News", IconComp: MobIcons.news },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 62,
          background: T.sbBg,
          borderTop: `1px solid ${T.sbBorder}`,
          zIndex: 30,
          display: "flex",
          alignItems: "stretch",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {mobileItems.map(({ id, label, IconComp }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "5px 2px",
                outline: "none",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 32,
                    height: 2,
                    background: T.accent,
                    borderRadius: "0 0 3px 3px",
                  }}
                />
              )}
              <IconComp active={isActive} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? T.accent : "#9ca3af",
                  transition: "color 0.18s",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}

        {/* More */}
        <button
          onClick={onMenuOpen}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: drawerOpen ? T.accent : "#9ca3af",
            transition: "color 0.18s",
            outline: "none",
            padding: "5px 2px",
          }}
        >
          <HamburgerIcon isOpen={drawerOpen} size={20} />
          <span style={{ fontSize: 10, fontWeight: 400, color: "inherit" }}>
            {drawerOpen ? "Close" : "More"}
          </span>
        </button>
      </div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Sidebar({ activePage, setActivePage }) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {!isMobile && (
        <DesktopSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />
      )}
      {isMobile && (
        <>
          <MobileDrawer
            activePage={activePage}
            setActivePage={setActivePage}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onLogout={handleLogout}
          />
          <MobileBottomNav
            activePage={activePage}
            setActivePage={setActivePage}
            onMenuOpen={() => setDrawerOpen((v) => !v)}
            drawerOpen={drawerOpen}
          />
        </>
      )}
    </>
  );
}
