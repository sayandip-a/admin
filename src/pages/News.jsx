import { useState, useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const NEWS_CATS = [
  "Research",
  "Company News",
  "Education",
  "Partnership",
  "Regulatory",
  "Clinical Trial",
];
const EVENT_TYPES = [
  "Conference",
  "Webinar",
  "Workshop",
  "Symposium",
  "Summit",
  "Training",
];

const CAT_COLOR = {
  Research: { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  "Company News": { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  Education: { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  Partnership: { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" },
  Regulatory: { bg: "#fee2e2", text: "#b91c1c", dot: "#f43f5e" },
  "Clinical Trial": { bg: "#ccfbf1", text: "#0f766e", dot: "#14b8a6" },
  General: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
};

const EMPTY_NEWS = {
  title: "",
  category: "Research",
  status: "Draft",
  author: "",
  content: "",
  tag: "",
  body: "",
  date: new Date().toISOString().split("T")[0],
};

const EMPTY_EVENT = {
  title: "",
  type: "Conference",
  location: "",
  date: new Date().toISOString().split("T")[0],
  time: "",
  description: "",
  status: "Upcoming",
  imagePreview: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function str(val) {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object")
    return val.name || val.title || val.label || val._id?.toString() || "";
  return String(val);
}
function getAPI(path) {
  try {
    return `${import.meta.env.VITE_API_URL || ""}${path}`;
  } catch {
    return path;
  }
}
function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
function safeImageUrl(preview) {
  if (!preview) return "";
  if (typeof preview === "string" && preview.startsWith("data:")) return "";
  return preview;
}

// ── Design Tokens (Light Theme) ───────────────────────────────────────────────
const T = {
  pageBg: "#f4f4f8",
  cardBg: "#ffffff",
  panelBg: "#ffffff",
  border: "#e8e8f0",
  border2: "#d0d0e0",
  inputBg: "#f8f8fc",
  text1: "#1a1a2e",
  text2: "#52526e",
  text3: "#9494b0",
  head: "#0f0f23",
  accent: "#4f7cff",
  accentHov: "#3a63e8",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#f43f5e",
  purple: "#8b5cf6",
  shadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06)",
  shadowHov: "0 4px 12px rgba(0,0,0,.08), 0 12px 32px rgba(0,0,0,.10)",
};

// ── Global CSS ────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
  @keyframes spin      { to { transform:rotate(360deg) } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer   { 0%,100% { opacity:.5 } 50% { opacity:.9 } }
  @keyframes toastIn   { from { opacity:0; transform:translateY(12px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }

  .n-page  { font-family: 'Instrument Sans', sans-serif; color: ${T.text1}; background: ${T.pageBg}; }

  /* Cards */
  .n-card {
    background: ${T.cardBg};
    border: 1.5px solid ${T.border};
    border-radius: 16px;
    box-shadow: ${T.shadow};
    transition: border-color .22s, transform .22s, box-shadow .22s;
  }
  .n-card:hover {
    border-color: #c8c8e0;
    transform: translateY(-3px);
    box-shadow: ${T.shadowHov};
  }

  /* Stat cards */
  .n-stat-card {
    background: #fff;
    border: 1.5px solid ${T.border};
    border-radius: 14px;
    padding: 20px 18px 16px;
    box-shadow: ${T.shadow};
    transition: transform .2s, box-shadow .2s;
    cursor: default;
  }
  .n-stat-card:hover { transform: translateY(-2px); box-shadow: ${T.shadowHov}; }

  /* Buttons */
  .n-btn { transition: all .18s cubic-bezier(.4,0,.2,1); cursor: pointer; }
  .n-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .n-btn:active:not(:disabled) { transform: translateY(0) scale(.98); }
  .n-btn:disabled { opacity: .55; cursor: not-allowed; }

  .n-primary-btn {
    background: ${T.accent};
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px 22px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 2px 8px rgba(79,124,255,.28);
    transition: all .18s;
  }
  .n-primary-btn:hover:not(:disabled) {
    background: ${T.accentHov};
    box-shadow: 0 4px 16px rgba(79,124,255,.38);
    transform: translateY(-1px);
  }
  .n-primary-btn.green { background: ${T.green}; box-shadow: 0 2px 8px rgba(34,197,94,.28); }
  .n-primary-btn.green:hover:not(:disabled) { background: #16a34a; box-shadow: 0 4px 16px rgba(34,197,94,.38); }
  .n-primary-btn.purple { background: ${T.purple}; box-shadow: 0 2px 8px rgba(139,92,246,.28); }
  .n-primary-btn.purple:hover:not(:disabled) { background: #7c3aed; box-shadow: 0 4px 16px rgba(139,92,246,.38); }

  .n-ghost-btn {
    background: #fff;
    color: ${T.text2};
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    padding: 9px 20px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all .18s;
  }
  .n-ghost-btn:hover { border-color: #b0b0cc; color: ${T.text1}; background: #fafafe; }

  .n-icon-btn {
    background: #fff;
    border: 1.5px solid ${T.border};
    border-radius: 8px;
    padding: 6px 13px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: ${T.text2};
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all .18s;
  }
  .n-icon-btn:hover { border-color: ${T.accent}; color: ${T.accent}; background: #f0f4ff; transform: translateY(-1px); }
  .n-del-btn:hover  { border-color: ${T.red};    color: ${T.red};    background: #fff5f7; }

  /* Tab */
  .n-tab-switcher {
    display: flex;
    background: #eeeef6;
    border-radius: 12px;
    padding: 4px;
    gap: 3px;
  }
  .n-tab-btn {
    padding: 8px 20px;
    border-radius: 9px;
    border: none;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
    white-space: nowrap;
    background: transparent;
    color: ${T.text2};
  }
  .n-tab-btn.active { background: #fff; color: ${T.text1}; box-shadow: 0 1px 4px rgba(0,0,0,.10); }
  .n-tab-btn:hover:not(.active) { color: ${T.text1}; }

  /* Filter pills */
  .n-filter-pill {
    padding: 6px 16px;
    border-radius: 999px;
    border: 1.5px solid ${T.border};
    background: #fff;
    color: ${T.text2};
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all .18s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .n-filter-pill:hover { border-color: ${T.accent}; color: ${T.accent}; }
  .n-filter-pill.active { border-color: ${T.accent}; color: ${T.accent}; background: #f0f4ff; }

  /* Inputs */
  .n-input {
    background: ${T.inputBg};
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    color: ${T.text1};
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    width: 100%;
    transition: border-color .2s, box-shadow .2s;
    outline: none;
  }
  .n-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px rgba(79,124,255,.12); }
  .n-input::placeholder { color: #b0b0c8; }
  select.n-input option { background: #fff; color: ${T.text1}; }
  input[type=date].n-input::-webkit-calendar-picker-indicator,
  input[type=time].n-input::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .5; }

  /* Status chips */
  .n-status-chip {
    padding: 7px 18px;
    border-radius: 8px;
    border: 1.5px solid ${T.border};
    background: #fff;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .18s;
    color: ${T.text2};
  }

  /* Skeleton */
  .n-skeleton { animation: shimmer 1.6s ease infinite; background: linear-gradient(90deg, #f0f0f6 25%, #e8e8f2 50%, #f0f0f6 75%); }

  /* Overlays */
  .n-overlay  { animation: fadeIn .2s ease; }
  .n-modal    { animation: scaleIn .25s cubic-bezier(.34,1.4,.64,1); }
  .n-panel    { animation: slideDown .28s cubic-bezier(.4,0,.2,1); }
  .n-toast    { animation: toastIn .3s cubic-bezier(.34,1.4,.64,1); }

  /* Image zoom */
  .n-img-zoom { transition: transform .4s ease; overflow: hidden; }
  .n-img-zoom:hover img { transform: scale(1.06); }
  .n-img-zoom img { transition: transform .4s ease; display: block; }

  /* Read more */
  .n-read-more { transition: color .15s; }
  .n-read-more:hover { color: ${T.accentHov} !important; }

  /* Tag badge */
  .n-tag { transition: background .15s; cursor: default; }
  .n-tag:hover { background: rgba(79,124,255,.14) !important; }

  /* ── Grids ── */
  .n-stats-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
  .n-stats-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
  .n-cards-grid   { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 16px; }
  .n-header-row   { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .n-toolbar      { display: flex; gap: 10px; margin-bottom: 16px; align-items: center; }
  .n-filter-row   { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .n-form-2col    { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .n-tab-area     { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .n-stats-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
    .n-stats-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 640px) {
    .n-page          { padding: 18px 14px 80px !important; }
    .n-stats-grid-4  { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin-bottom: 20px !important; }
    .n-stats-grid-3  { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
    .n-cards-grid    { grid-template-columns: 1fr !important; gap: 12px !important; }
    .n-form-2col     { grid-template-columns: 1fr !important; }
    .n-header-row    { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; margin-bottom: 22px !important; }
    .n-tab-area      { width: 100% !important; }
    .n-new-btn       { width: 100% !important; justify-content: center !important; }
    .n-toolbar       { flex-direction: column !important; }
    .n-toolbar > *   { width: 100% !important; }
    .n-filter-row    { overflow-x: auto; padding-bottom: 4px; flex-wrap: nowrap !important; }
    .n-filter-row::-webkit-scrollbar { display: none; }
    .n-stat-card     { padding: 14px 12px !important; }
  }
  @media (max-width: 360px) {
    .n-stats-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    .n-stats-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryBadge({ label }) {
  const c = CAT_COLOR[label] || CAT_COLOR.General;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: ".01em",
        background: c.bg,
        color: c.text,
        whiteSpace: "nowrap",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        background: active ? "#dcfce7" : "#fef3c7",
        color: active ? "#15803d" : "#b45309",
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: active ? "#22c55e" : "#f59e0b",
          flexShrink: 0,
        }}
      />
      {active ? "Published" : "Draft"}
    </span>
  );
}

function EventTypeBadge({ label }) {
  const colors = {
    Conference: { bg: "#dbeafe", text: "#1d4ed8" },
    Webinar: { bg: "#ede9fe", text: "#7c3aed" },
    Workshop: { bg: "#fce7f3", text: "#be185d" },
    Symposium: { bg: "#ccfbf1", text: "#0f766e" },
    Summit: { bg: "#ffedd5", text: "#c2410c" },
    Training: { bg: "#f0fdf4", text: "#166534" },
  };
  const c = colors[label] || { bg: "#f1f5f9", text: "#475569" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        background: c.bg,
        color: c.text,
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {label}
    </span>
  );
}

function Spinner({ size = 14, dark = false }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        border: `2px solid ${dark ? "rgba(0,0,0,.15)" : "rgba(255,255,255,.3)"}`,
        borderTopColor: dark ? T.accent : "#fff",
        borderRadius: "50%",
        animation: "spin .65s linear infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function Toast({ data }) {
  if (!data) return null;
  const isErr = data.type === "error";
  return (
    <div
      className="n-toast"
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 9999,
        background: "#fff",
        border: `1.5px solid ${isErr ? "#fecdd3" : "#bbf7d0"}`,
        borderRadius: 14,
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: T.text1,
        fontSize: 13.5,
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,.14)",
        fontFamily: "'Instrument Sans', sans-serif",
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: isErr ? "#fee2e2" : "#dcfce7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {isErr ? "✕" : "✓"}
      </span>
      <span style={{ color: isErr ? "#b91c1c" : "#15803d" }}>
        {str(data.msg)}
      </span>
    </div>
  );
}

function ConfirmModal({ item, label = "title", onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div
      className="n-overlay"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,15,35,.45)",
        backdropFilter: "blur(4px)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        className="n-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 28px",
          maxWidth: 380,
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginBottom: 18,
          }}
        >
          🗑️
        </div>
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: T.head,
            marginBottom: 10,
          }}
        >
          Delete Permanently?
        </h3>
        <p
          style={{
            fontSize: 13.5,
            color: T.text2,
            lineHeight: 1.65,
            marginBottom: 26,
          }}
        >
          <strong style={{ color: T.text1 }}>
            {str(item[label] || item.title || item.name)}
          </strong>{" "}
          will be permanently removed and cannot be recovered.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="n-btn n-ghost-btn">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="n-btn n-primary-btn"
            style={{
              background: T.red,
              boxShadow: "0 2px 8px rgba(244,63,94,.28)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUpload({ preview, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  function handle(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files[0]);
      }}
      style={{
        border: `2px dashed ${drag ? T.accent : preview ? "#86efac" : T.border2}`,
        borderRadius: 12,
        cursor: "pointer",
        overflow: "hidden",
        background: drag ? "#f0f4ff" : preview ? "#f0fdf4" : T.inputBg,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .2s",
        position: "relative",
      }}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt=""
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: T.green,
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            ✓ Ready
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,.55)",
              padding: "8px 12px",
              fontSize: 12,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Click to change
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "28px 20px" }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>
            {drag ? "📂" : "🖼️"}
          </div>
          <p style={{ color: T.text3, fontSize: 13, fontWeight: 500 }}>
            Drop image or{" "}
            <span style={{ color: T.accent, fontWeight: 700 }}>browse</span>
          </p>
          <p style={{ color: "#b0b0c8", fontSize: 11, marginTop: 4 }}>
            PNG, JPG, WebP
          </p>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ label, required }) {
  return (
    <label
      style={{
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: T.text3,
        display: "block",
        marginBottom: 7,
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {label}
      {required && <span style={{ color: T.red, marginLeft: 3 }}>*</span>}
    </label>
  );
}

function StatCard({ icon, label, val, color, sub, delay = 0 }) {
  return (
    <div
      className="n-stat-card"
      style={{ animation: `fadeUp .4s ease ${delay}ms both` }}
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
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: T.text3,
            fontFamily: "'Instrument Sans', sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 30,
          fontWeight: 800,
          color,
          lineHeight: 1,
          letterSpacing: "-.5px",
        }}
      >
        {val}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: T.text3,
          marginTop: 7,
          fontWeight: 500,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
      <svg
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: T.text3,
          pointerEvents: "none",
        }}
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        className="n-input"
        style={{ paddingLeft: 42 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════
export default function News() {
  const token = localStorage.getItem("token") || "";
  const [tab, setTab] = useState("news");

  // ── News state ─────────────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsPanel, setNewsPanel] = useState(false);
  const [editNewsId, setEditNewsId] = useState(null);
  const [newsForm, setNewsForm] = useState({ ...EMPTY_NEWS });
  const [newsSaving, setNewsSaving] = useState(false);
  const [deleteNewsItem, setDeleteNewsItem] = useState(null);
  const [newsFilter, setNewsFilter] = useState("All");
  const [newsSearch, setNewsSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // ── Events state ───────────────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventPanel, setEventPanel] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [eventForm, setEventForm] = useState({ ...EMPTY_EVENT });
  const [eventSaving, setEventSaving] = useState(false);
  const [deleteEventItem, setDeleteEventItem] = useState(null);
  const [eventFilter, setEventFilter] = useState("All");
  const [eventSearch, setEventSearch] = useState("");

  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg: str(msg), type });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Fetch ──────────────────────────────────────────────────────────────
  async function fetchNews() {
    setNewsLoading(true);
    try {
      const r = await fetch(getAPI("/api/news?limit=100&page=1"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setPosts(
        Array.isArray(d)
          ? d
          : Array.isArray(d.news)
            ? d.news
            : Array.isArray(d.data)
              ? d.data
              : [],
      );
    } catch {
      setPosts([]);
    } finally {
      setNewsLoading(false);
    }
  }

  async function fetchEvents() {
    setEventsLoading(true);
    try {
      const r = await fetch(getAPI("/api/events?limit=100&page=1"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setEvents(
        Array.isArray(d)
          ? d
          : Array.isArray(d.events)
            ? d.events
            : Array.isArray(d.data)
              ? d.data
              : [],
      );
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  // ── News handlers ──────────────────────────────────────────────────────
  function openEditNews(post) {
    setNewsForm({
      title: str(post.title),
      category: post.category?.name || str(post.category) || "Research",
      status: post.isActive ? "Published" : "Draft",
      author: str(post.author),
      content: str(post.content) || str(post.description),
      tag: str(post.tag),
      body: str(post.body) || str(post.content) || str(post.description),
      date: post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setEditNewsId(post._id);
    setNewsPanel(true);
    setTimeout(
      () =>
        document
          .getElementById("n-panel-top")
          ?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function closeNewsPanel() {
    setNewsPanel(false);
    setEditNewsId(null);
    setNewsForm({ ...EMPTY_NEWS });
  }

  async function saveNews() {
    if (!newsForm.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    setNewsSaving(true);
    try {
      const url = editNewsId
        ? getAPI(`/api/news/${editNewsId}`)
        : getAPI("/api/news");
      const r = await fetch(url, {
        method: editNewsId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newsForm.title,
          category: newsForm.category,
          content: newsForm.content || newsForm.body,
          body: newsForm.body || newsForm.content,
          tag: newsForm.tag,
          date: newsForm.date,
          isActive: newsForm.status === "Published",
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || d.error || "Save failed", "error");
        return;
      }
      showToast(editNewsId ? "Post updated!" : "Post published!");
      closeNewsPanel();
      fetchNews();
    } catch {
      showToast("Network error", "error");
    } finally {
      setNewsSaving(false);
    }
  }

  async function confirmDeleteNews() {
    if (!deleteNewsItem) return;
    try {
      await fetch(getAPI(`/api/news/${deleteNewsItem._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Post deleted");
      fetchNews();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteNewsItem(null);
    }
  }

  // ── Events handlers ────────────────────────────────────────────────────
  function openEditEvent(ev) {
    setEventForm({
      title: str(ev.title),
      type: str(ev.type) || "Conference",
      location: str(ev.location),
      date: ev.date
        ? new Date(ev.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      time: str(ev.time),
      description: str(ev.description),
      status: ev.isActive ? "Upcoming" : "Past",
      imagePreview: str(ev.imageUrl) || null,
    });
    setEditEventId(ev._id);
    setEventPanel(true);
    setTimeout(
      () =>
        document
          .getElementById("n-event-panel-top")
          ?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function closeEventPanel() {
    setEventPanel(false);
    setEditEventId(null);
    setEventForm({ ...EMPTY_EVENT });
  }

  async function saveEvent() {
    if (!eventForm.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!eventForm.date) {
      showToast("Date is required", "error");
      return;
    }
    setEventSaving(true);
    try {
      const url = editEventId
        ? getAPI(`/api/events/${editEventId}`)
        : getAPI("/api/events");
      const payload = {
        title: eventForm.title.trim(),
        type: eventForm.type,
        location: eventForm.location.trim(),
        date: eventForm.date,
        description: eventForm.description.trim(),
        isActive: eventForm.status === "Upcoming",
        imageUrl: safeImageUrl(eventForm.imagePreview),
      };
      if (eventForm.time?.trim()) payload.time = eventForm.time.trim();
      const r = await fetch(url, {
        method: editEventId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || d.error || "Save failed", "error");
        return;
      }
      showToast(editEventId ? "Event updated!" : "Event created!");
      closeEventPanel();
      fetchEvents();
    } catch {
      showToast("Network error", "error");
    } finally {
      setEventSaving(false);
    }
  }

  async function confirmDeleteEvent() {
    if (!deleteEventItem) return;
    try {
      await fetch(getAPI(`/api/events/${deleteEventItem._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Event deleted");
      fetchEvents();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteEventItem(null);
    }
  }

  // ── Filtered data ──────────────────────────────────────────────────────
  const visibleNews = posts.filter((p) => {
    const q = newsSearch.toLowerCase();
    const matchQ =
      !q ||
      str(p.title).toLowerCase().includes(q) ||
      str(p.author).toLowerCase().includes(q);
    const matchF =
      newsFilter === "All" ||
      (newsFilter === "Published" && p.isActive) ||
      (newsFilter === "Draft" && !p.isActive);
    return matchQ && matchF;
  });

  const visibleEvents = events.filter((e) => {
    const q = eventSearch.toLowerCase();
    const matchQ =
      !q ||
      str(e.title).toLowerCase().includes(q) ||
      str(e.location).toLowerCase().includes(q);
    const matchF =
      eventFilter === "All" ||
      (eventFilter === "Upcoming" && e.isActive) ||
      (eventFilter === "Past" && !e.isActive);
    return matchQ && matchF;
  });

  const nStats = {
    total: posts.length,
    pub: posts.filter((p) => p.isActive).length,
    draft: posts.filter((p) => !p.isActive).length,
    cats: new Set(posts.map((p) => str(p.category))).size,
  };
  const eStats = {
    total: events.length,
    upcoming: events.filter((e) => e.isActive).length,
    past: events.filter((e) => !e.isActive).length,
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>

      <div
        className="n-page"
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "30px 28px 88px",
          background: T.pageBg,
          overflowX: "hidden",
        }}
      >
        {/* ── Page Header ── */}
        <div
          className="n-header-row"
          style={{ animation: "fadeUp .4s ease both" }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(22px, 4vw, 30px)",
                fontWeight: 800,
                color: T.head,
                lineHeight: 1.2,
                letterSpacing: "-.4px",
              }}
            >
              Manage News &amp; <span style={{ color: T.accent }}>Events</span>
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: T.text3,
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              Manage publications, announcements and upcoming events
            </p>
          </div>

          <div
            className="n-tab-area"
            style={{ animation: "fadeUp .4s ease .06s both" }}
          >
            <div className="n-tab-switcher">
              {["news", "events"].map((t) => (
                <button
                  key={t}
                  className={`n-tab-btn n-btn ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "news" ? "📰 News" : "📅 Events"}
                </button>
              ))}
            </div>
            <button
              className={`n-btn n-primary-btn n-new-btn ${tab === "events" ? "green" : ""}`}
              onClick={() => {
                if (tab === "news") {
                  if (newsPanel && !editNewsId) closeNewsPanel();
                  else {
                    setEditNewsId(null);
                    setNewsForm({ ...EMPTY_NEWS });
                    setNewsPanel(true);
                  }
                } else {
                  if (eventPanel && !editEventId) closeEventPanel();
                  else {
                    setEditEventId(null);
                    setEventForm({ ...EMPTY_EVENT });
                    setEventPanel(true);
                  }
                }
              }}
            >
              {tab === "news"
                ? newsPanel && !editNewsId
                  ? "✕ Close"
                  : "+ Post News"
                : eventPanel && !editEventId
                  ? "✕ Close"
                  : "+ Post Event"}
            </button>
          </div>
        </div>

        {/* ══════════ NEWS TAB ══════════ */}
        {tab === "news" && (
          <div style={{ animation: "fadeIn .25s ease" }}>
            {/* Stats */}
            <div className="n-stats-grid-4">
              <StatCard
                icon="📄"
                label="Total Posts"
                val={nStats.total}
                color={T.accent}
                sub="All articles"
                delay={0}
              />
              <StatCard
                icon="🟢"
                label="Published"
                val={nStats.pub}
                color={T.green}
                sub="Live now"
                delay={60}
              />
              <StatCard
                icon="✏️"
                label="Drafts"
                val={nStats.draft}
                color={T.amber}
                sub="Unpublished"
                delay={120}
              />
              <StatCard
                icon="🏷️"
                label="Categories"
                val={nStats.cats}
                color={T.purple}
                sub="Topic areas"
                delay={180}
              />
            </div>

            {/* Search + Filter */}
            <div
              className="n-toolbar"
              style={{ animation: "fadeUp .4s ease .2s both" }}
            >
              <SearchInput
                value={newsSearch}
                onChange={setNewsSearch}
                placeholder="Search by title or author…"
              />
            </div>

            <div
              className="n-filter-row"
              style={{ animation: "fadeUp .4s ease .25s both" }}
            >
              {[
                { k: "All", l: "All", c: posts.length },
                { k: "Published", l: "Published", c: nStats.pub },
                { k: "Draft", l: "Drafts", c: nStats.draft },
              ].map((f) => (
                <button
                  key={f.k}
                  className={`n-btn n-filter-pill ${newsFilter === f.k ? "active" : ""}`}
                  onClick={() => setNewsFilter(f.k)}
                >
                  {f.l}
                  <span
                    style={{
                      background: newsFilter === f.k ? "#dbeafe" : "#f0f0f6",
                      color: newsFilter === f.k ? T.accent : T.text3,
                      borderRadius: 999,
                      padding: "1px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* News Form Panel */}
            {newsPanel && (
              <div
                id="n-panel-top"
                className="n-panel"
                style={{
                  background: T.panelBg,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 18,
                  padding: "26px 24px 30px",
                  marginBottom: 28,
                  boxShadow: "0 4px 20px rgba(0,0,0,.07)",
                }}
              >
                {/* Panel header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: editNewsId ? "#ede9fe" : "#dbeafe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      {editNewsId ? "✏️" : "📝"}
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 16,
                          fontWeight: 800,
                          color: T.head,
                          margin: 0,
                        }}
                      >
                        {editNewsId ? "Edit Post" : "New Post"}
                      </h2>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: editNewsId ? T.purple : T.accent,
                          fontWeight: 600,
                          background: editNewsId ? "#ede9fe" : "#dbeafe",
                          padding: "1px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {editNewsId ? "Editing" : "New"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="n-btn n-ghost-btn"
                    onClick={closeNewsPanel}
                    style={{ padding: "7px 14px", fontSize: 12 }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="n-form-2col">
                  {/* Title */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Title" required />
                    <input
                      className="n-input"
                      placeholder="Enter post title…"
                      value={newsForm.title}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <FieldLabel label="Category" />
                    <select
                      className="n-input"
                      value={newsForm.category}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {NEWS_CATS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tag */}
                  <div>
                    <FieldLabel label="Tag" />
                    <input
                      className="n-input"
                      placeholder="e.g. oncology, AI"
                      value={newsForm.tag}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, tag: e.target.value }))
                      }
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <FieldLabel label="Date" />
                    <input
                      className="n-input"
                      type="date"
                      value={newsForm.date}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <FieldLabel label="Status" />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["Draft", "Published"].map((s) => (
                        <button
                          key={s}
                          className="n-btn n-status-chip"
                          onClick={() =>
                            setNewsForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            borderColor:
                              newsForm.status === s
                                ? s === "Published"
                                  ? T.green
                                  : T.amber
                                : T.border,
                            background:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#dcfce7"
                                  : "#fef3c7"
                                : "#fff",
                            color:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#15803d"
                                  : "#b45309"
                                : T.text2,
                          }}
                        >
                          {s === "Published" ? "🟢" : "🟡"} {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Short Description" />
                    <textarea
                      className="n-input"
                      style={{ minHeight: 84, resize: "vertical" }}
                      placeholder="Brief summary…"
                      value={newsForm.content}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, content: e.target.value }))
                      }
                    />
                  </div>

                  {/* Full Body */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Full Body" required />
                    <textarea
                      className="n-input"
                      style={{ minHeight: 148, resize: "vertical" }}
                      placeholder="Write the full article…"
                      value={newsForm.body}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, body: e.target.value }))
                      }
                    />
                    <div
                      style={{
                        fontSize: 11.5,
                        color: T.text3,
                        textAlign: "right",
                        marginTop: 5,
                      }}
                    >
                      {newsForm.body.length} chars
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 22,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="n-btn n-ghost-btn"
                    onClick={closeNewsPanel}
                  >
                    Cancel
                  </button>
                  <button
                    className={`n-btn n-primary-btn ${editNewsId ? "purple" : ""}`}
                    onClick={saveNews}
                    disabled={newsSaving}
                    style={{ minWidth: 148 }}
                  >
                    {newsSaving && <Spinner />}
                    {newsSaving
                      ? "Saving…"
                      : editNewsId
                        ? "Save Changes"
                        : "Publish Post"}
                  </button>
                </div>
              </div>
            )}

            {/* Count */}
            <p
              style={{
                fontSize: 13,
                color: T.text2,
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              Showing{" "}
              <strong style={{ color: T.text1 }}>{visibleNews.length}</strong>{" "}
              of <strong style={{ color: T.text1 }}>{posts.length}</strong>{" "}
              posts
            </p>

            {/* Cards Grid */}
            {newsLoading ? (
              <div className="n-cards-grid">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="n-skeleton"
                    style={{
                      height: 180,
                      borderRadius: 16,
                      background: "#eeeef6",
                    }}
                  />
                ))}
              </div>
            ) : visibleNews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "72px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>
                  📰
                </div>
                <p style={{ fontSize: 14, color: T.text2, fontWeight: 500 }}>
                  No posts found. Create one above!
                </p>
              </div>
            ) : (
              <div className="n-cards-grid">
                {visibleNews.map((post, i) => {
                  const isExpanded = expandedId === post._id;
                  const description =
                    str(post.description) || str(post.content);
                  const isLong = description.length > 160;
                  const category = post.category?.name || str(post.category);
                  const author =
                    post.author?.name ||
                    post.author?.username ||
                    str(post.author);
                  const tag = str(post.tag);

                  return (
                    <div
                      key={post._id}
                      className="n-card"
                      style={{
                        padding: 22,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        animation: `fadeUp .35s ease ${i * 45}ms both`,
                      }}
                    >
                      {/* Top row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <CategoryBadge label={category || "General"} />
                          <StatusBadge active={post.isActive} />
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <button
                            className="n-btn n-icon-btn"
                            onClick={() => openEditNews(post)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="n-btn n-icon-btn n-del-btn"
                            onClick={() => setDeleteNewsItem(post)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 15.5,
                          fontWeight: 700,
                          color: T.head,
                          lineHeight: 1.45,
                          margin: 0,
                        }}
                      >
                        {str(post.title)}
                      </h3>

                      {/* Meta */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        {author && (
                          <span
                            style={{
                              fontSize: 12,
                              color: T.text2,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontWeight: 500,
                            }}
                          >
                            <span
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: T.accent,
                                color: "#fff",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 9,
                                fontWeight: 800,
                              }}
                            >
                              {str(author)[0]?.toUpperCase()}
                            </span>
                            {author}
                          </span>
                        )}
                        {tag && (
                          <span
                            className="n-tag"
                            style={{
                              fontSize: 11.5,
                              color: T.accent,
                              background: "rgba(79,124,255,.09)",
                              borderRadius: 999,
                              padding: "2px 10px",
                              fontWeight: 600,
                            }}
                          >
                            # {tag}
                          </span>
                        )}
                        {post.date && (
                          <span
                            style={{
                              fontSize: 11.5,
                              color: T.text3,
                              fontWeight: 500,
                            }}
                          >
                            {fmtDate(post.date)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {description && (
                        <>
                          <p
                            style={{
                              fontSize: 13.5,
                              color: T.text2,
                              lineHeight: 1.65,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? 100 : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {description}
                          </p>
                          {isLong && (
                            <button
                              className="n-btn n-read-more"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : post._id)
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: T.accent,
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: 0,
                                textAlign: "left",
                                fontFamily: "'Instrument Sans', sans-serif",
                              }}
                            >
                              {isExpanded ? "Show less ▲" : "Read more ▼"}
                            </button>
                          )}
                        </>
                      )}

                      {/* Bottom divider + date */}
                      <div
                        style={{
                          borderTop: `1px solid ${T.border}`,
                          paddingTop: 10,
                          marginTop: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: T.text3,
                            fontWeight: 500,
                          }}
                        >
                          {post.isActive ? "🟢 Live" : "🟡 Draft"}
                        </span>
                        {post.createdAt && (
                          <span style={{ fontSize: 11, color: T.text3 }}>
                            {fmtDate(post.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ EVENTS TAB ══════════ */}
        {tab === "events" && (
          <div style={{ animation: "fadeIn .25s ease" }}>
            {/* Stats */}
            <div className="n-stats-grid-3">
              <StatCard
                icon="📅"
                label="Total Events"
                val={eStats.total}
                color={T.accent}
                sub="All events"
                delay={0}
              />
              <StatCard
                icon="🟢"
                label="Upcoming"
                val={eStats.upcoming}
                color={T.green}
                sub="Scheduled"
                delay={60}
              />
              <StatCard
                icon="⏰"
                label="Past"
                val={eStats.past}
                color={T.text3}
                sub="Completed"
                delay={120}
              />
            </div>

            {/* Search + Filter */}
            <div
              className="n-toolbar"
              style={{ animation: "fadeUp .4s ease .2s both" }}
            >
              <SearchInput
                value={eventSearch}
                onChange={setEventSearch}
                placeholder="Search by title or location…"
              />
            </div>

            <div
              className="n-filter-row"
              style={{ animation: "fadeUp .4s ease .25s both" }}
            >
              {[
                { k: "All", l: "All", c: events.length },
                { k: "Upcoming", l: "Upcoming", c: eStats.upcoming },
                { k: "Past", l: "Past", c: eStats.past },
              ].map((f) => (
                <button
                  key={f.k}
                  className={`n-btn n-filter-pill ${eventFilter === f.k ? "active" : ""}`}
                  onClick={() => setEventFilter(f.k)}
                >
                  {f.l}
                  <span
                    style={{
                      background: eventFilter === f.k ? "#dbeafe" : "#f0f0f6",
                      color: eventFilter === f.k ? T.accent : T.text3,
                      borderRadius: 999,
                      padding: "1px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* Event Form Panel */}
            {eventPanel && (
              <div
                id="n-event-panel-top"
                className="n-panel"
                style={{
                  background: T.panelBg,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 18,
                  padding: "26px 24px 30px",
                  marginBottom: 28,
                  boxShadow: "0 4px 20px rgba(0,0,0,.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: editEventId ? "#ede9fe" : "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      {editEventId ? "✏️" : "📅"}
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 16,
                          fontWeight: 800,
                          color: T.head,
                          margin: 0,
                        }}
                      >
                        {editEventId ? "Edit Event" : "New Event"}
                      </h2>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: editEventId ? T.purple : T.green,
                          background: editEventId ? "#ede9fe" : "#dcfce7",
                          padding: "1px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {editEventId ? "Editing" : "New"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="n-btn n-ghost-btn"
                    onClick={closeEventPanel}
                    style={{ padding: "7px 14px", fontSize: 12 }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="n-form-2col">
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Event Title" required />
                    <input
                      className="n-input"
                      placeholder="e.g. International Oncology Summit 2026"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel label="Event Type" />
                    <select
                      className="n-input"
                      value={eventForm.type}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, type: e.target.value }))
                      }
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Location" />
                    <input
                      className="n-input"
                      placeholder="City, Venue or Online"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel label="Date" required />
                    <input
                      className="n-input"
                      type="date"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel label="Time (optional)" />
                    <input
                      className="n-input"
                      type="time"
                      value={eventForm.time}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, time: e.target.value }))
                      }
                    />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Status" />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["Upcoming", "Past"].map((s) => (
                        <button
                          key={s}
                          className="n-btn n-status-chip"
                          onClick={() =>
                            setEventForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            borderColor:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? T.green
                                  : "#9ca3af"
                                : T.border,
                            background:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#dcfce7"
                                  : "#f3f4f6"
                                : "#fff",
                            color:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#15803d"
                                  : "#6b7280"
                                : T.text2,
                          }}
                        >
                          {s === "Upcoming" ? "🟢" : "⚫"} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Description" />
                    <textarea
                      className="n-input"
                      style={{ minHeight: 96, resize: "vertical" }}
                      placeholder="Describe the event…"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Event Banner Image" />
                    <ImageUpload
                      preview={eventForm.imagePreview}
                      onChange={(p) =>
                        setEventForm((f) => ({ ...f, imagePreview: p }))
                      }
                    />
                    {eventForm.imagePreview?.startsWith("data:") && (
                      <p
                        style={{
                          fontSize: 11.5,
                          color: T.amber,
                          marginTop: 7,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontWeight: 500,
                        }}
                      >
                        ⚠️ Preview only — paste a hosted URL below to save
                        permanently.
                      </p>
                    )}
                    <input
                      className="n-input"
                      style={{ marginTop: 10 }}
                      placeholder="Or paste an image URL (https://…)"
                      value={
                        eventForm.imagePreview?.startsWith("data:")
                          ? ""
                          : eventForm.imagePreview || ""
                      }
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          imagePreview: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 22,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="n-btn n-ghost-btn"
                    onClick={closeEventPanel}
                  >
                    Cancel
                  </button>
                  <button
                    className={`n-btn n-primary-btn ${editEventId ? "purple" : "green"}`}
                    onClick={saveEvent}
                    disabled={eventSaving}
                    style={{ minWidth: 148 }}
                  >
                    {eventSaving && <Spinner />}
                    {eventSaving
                      ? "Saving…"
                      : editEventId
                        ? "Save Changes"
                        : "Create Event"}
                  </button>
                </div>
              </div>
            )}

            {/* Count */}
            <p
              style={{
                fontSize: 13,
                color: T.text2,
                marginBottom: 18,
                fontWeight: 500,
              }}
            >
              Showing{" "}
              <strong style={{ color: T.text1 }}>{visibleEvents.length}</strong>{" "}
              of <strong style={{ color: T.text1 }}>{events.length}</strong>{" "}
              events
            </p>

            {/* Events Grid */}
            {eventsLoading ? (
              <div className="n-cards-grid">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="n-skeleton"
                    style={{
                      height: 200,
                      borderRadius: 16,
                      background: "#eeeef6",
                    }}
                  />
                ))}
              </div>
            ) : visibleEvents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "72px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25 }}>
                  📅
                </div>
                <p style={{ fontSize: 14, color: T.text2, fontWeight: 500 }}>
                  No events found. Create one above!
                </p>
              </div>
            ) : (
              <div className="n-cards-grid">
                {visibleEvents.map((ev, i) => {
                  const imgUrl = str(ev.imageUrl);
                  const location = str(ev.location);
                  const description = str(ev.description);

                  return (
                    <div
                      key={ev._id}
                      className="n-card"
                      style={{
                        padding: 0,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        animation: `fadeUp .35s ease ${i * 45}ms both`,
                      }}
                    >
                      {/* Image banner */}
                      {imgUrl ? (
                        <div
                          className="n-img-zoom"
                          style={{ height: 140, background: "#f0f0f6" }}
                        >
                          <img
                            src={imgUrl}
                            alt={str(ev.title)}
                            style={{
                              width: "100%",
                              height: 140,
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 80,
                            background: `linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            color: T.accent,
                          }}
                        >
                          📅
                        </div>
                      )}

                      <div
                        style={{
                          padding: "18px 20px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          flex: 1,
                        }}
                      >
                        {/* Top row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            <EventTypeBadge
                              label={str(ev.type) || "Conference"}
                            />
                            <span
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                padding: "3px 10px",
                                borderRadius: 999,
                                background: ev.isActive ? "#dcfce7" : "#f3f4f6",
                                color: ev.isActive ? "#15803d" : "#6b7280",
                              }}
                            >
                              {ev.isActive ? "🟢 Upcoming" : "⚫ Past"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              className="n-btn n-icon-btn"
                              onClick={() => openEditEvent(ev)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="n-btn n-icon-btn n-del-btn"
                              onClick={() => setDeleteEventItem(ev)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 15.5,
                            fontWeight: 700,
                            color: T.head,
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {str(ev.title)}
                        </h3>

                        {/* Meta */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {location && (
                            <span
                              style={{
                                fontSize: 12.5,
                                color: T.text2,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontWeight: 500,
                              }}
                            >
                              <span style={{ fontSize: 14 }}>📍</span>
                              {location}
                            </span>
                          )}
                          {ev.date && (
                            <span
                              style={{
                                fontSize: 12.5,
                                color: T.text2,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontWeight: 500,
                              }}
                            >
                              <span style={{ fontSize: 14 }}>🗓️</span>
                              {fmtDate(ev.date)}
                              {ev.time && (
                                <span style={{ color: T.text3 }}>
                                  · {str(ev.time)}
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {description && (
                          <p
                            style={{
                              fontSize: 13,
                              color: T.text2,
                              lineHeight: 1.6,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {description}
                          </p>
                        )}

                        {/* Footer */}
                        <div
                          style={{
                            borderTop: `1px solid ${T.border}`,
                            paddingTop: 10,
                            marginTop: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: T.text3,
                              fontWeight: 500,
                            }}
                          >
                            {ev.isActive ? "Upcoming event" : "Past event"}
                          </span>
                          {ev.createdAt && (
                            <span style={{ fontSize: 11, color: T.text3 }}>
                              {fmtDate(ev.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals & Toast ── */}
      <ConfirmModal
        item={deleteNewsItem}
        onConfirm={confirmDeleteNews}
        onCancel={() => setDeleteNewsItem(null)}
      />
      <ConfirmModal
        item={deleteEventItem}
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteEventItem(null)}
      />
      <Toast data={toast} />
    </>
  );
}
