import { useState, useEffect, useRef } from "react";

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
  Research: "#8b5cf6",
  "Company News": "#4f7cff",
  Education: "#22c55e",
  Partnership: "#f59e0b",
  Regulatory: "#f43f5e",
  "Clinical Trial": "#14b8a6",
  General: "#64748b",
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
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}${path}`;
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

// ── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  bg: "#0D1117", // page & card background
  bg2: "#010409", // input & tab-switcher background
  bg3: "#0D1117", // panel background
  border: "#21262d", // card / panel border
  border2: "#30363d", // hover border
  text1: "#e6edf3", // primary text
  text2: "#8b949e", // secondary / muted text
  text3: "#6e7681", // very muted (labels, sub)
  head: "#f0f6fc", // headings
  accent: "#4f7cff", // blue accent
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
  @keyframes spin      { to { transform:rotate(360deg) } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pulse     { 0%,100% { opacity:1 } 50% { opacity:.4 } }

  .ne-page { width:100%; min-width:0; overflow-x:hidden; background:#0D1117; }

  /* ── Cards ── */
  .ne-card { transition: border-color .2s, transform .2s, box-shadow .2s; }
  .ne-card:hover {
    border-color: #30363d !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,.6) !important;
  }

  /* ── Buttons ── */
  .ne-btn { transition: opacity .15s, transform .1s; }
  .ne-btn:hover:not(:disabled) { opacity: .85; transform: translateY(-1px); }
  .ne-btn:active:not(:disabled) { transform: translateY(0); }
  .ne-btn:disabled { opacity: .5; cursor: not-allowed; }

  .ne-icon-btn { transition: background .15s, color .15s, border-color .15s; }
  .ne-icon-btn:hover { background: rgba(79,124,255,.10) !important; border-color: #4f7cff !important; color: #4f7cff !important; }
  .ne-del-btn:hover  { background: rgba(244,63,94,.10) !important;  border-color: #f43f5e !important; color: #f43f5e !important; }

  .ne-tab-btn { transition: all .2s; }
  .ne-tab-btn:hover { border-color: #30363d !important; color: #e6edf3 !important; }

  .ne-filter-btn { transition: all .2s; }
  .ne-filter-btn:hover { border-color: #4f7cff !important; color: #4f7cff !important; }

  .ne-status-btn { transition: all .2s; }

  /* ── Inputs ── */
  .ne-input:focus {
    border-color: #4f7cff !important;
    box-shadow: 0 0 0 3px rgba(79,124,255,.12) !important;
    outline: none;
  }
  .ne-input::placeholder { color: #484f58; }
  select.ne-input option { background: #0D1117; color: #e6edf3; }
  input[type=date].ne-input::-webkit-calendar-picker-indicator,
  input[type=time].ne-input::-webkit-calendar-picker-indicator { filter: invert(.4); cursor: pointer; }

  /* ── Misc ── */
  .ne-skeleton  { animation: pulse 1.5s ease infinite; }
  .ne-overlay   { animation: fadeIn .2s ease; }
  .ne-modal     { animation: scaleIn .2s cubic-bezier(.34,1.4,.64,1); }
  .ne-panel     { animation: slideDown .25s ease; }
  .ne-img-zoom  { transition: transform .4s ease; }
  .ne-img-zoom:hover { transform: scale(1.07); }
  .ne-tag-badge { transition: background .15s; }
  .ne-tag-badge:hover { background: rgba(79,124,255,.18) !important; }
  .ne-read-more { transition: color .15s; }
  .ne-read-more:hover { color: #7aa3ff !important; }

  /* ── Grids ── */
  .ne-stats-grid-news   { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
  .ne-stats-grid-events { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:28px; }
  .ne-cards-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
  .ne-header-row  { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
  .ne-toolbar     { display:flex; gap:10px; margin-bottom:14px; align-items:center; }
  .ne-tab-row     { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .ne-form-2col   { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

  /* ── Tablet ≤ 900px ── */
  @media (max-width:900px) {
    .ne-stats-grid-news   { grid-template-columns:repeat(2,1fr) !important; }
    .ne-stats-grid-events { grid-template-columns:repeat(3,1fr) !important; }
  }

  /* ── Mobile ≤ 640px ── */
  @media (max-width:640px) {
    .ne-page { padding:16px 14px 90px !important; }
    .ne-stats-grid-news   { grid-template-columns:repeat(2,1fr) !important; gap:8px !important; margin-bottom:18px !important; }
    .ne-stats-grid-events { grid-template-columns:repeat(3,1fr) !important; gap:8px !important; margin-bottom:18px !important; }
    .ne-cards-grid  { grid-template-columns:1fr !important; }
    .ne-form-2col   { grid-template-columns:1fr !important; }
    .ne-header-row  { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; margin-bottom:20px !important; }
    .ne-tab-row { width:100% !important; }
    .ne-tab-row > div:first-child { flex:1 !important; }
    .ne-tab-row > div:first-child button { flex:1 !important; }
    .ne-new-btn { width:100% !important; justify-content:center !important; }
    .ne-toolbar { flex-direction:column !important; }
    .ne-toolbar > * { width:100% !important; }
    .ne-stat-card  { padding:14px 12px !important; }
    .ne-stat-val   { font-size:24px !important; }
    .ne-stat-label { font-size:9px !important; }
    .ne-stat-sub   { font-size:10px !important; margin-top:4px !important; }
    .ne-filter-row { overflow-x:auto; padding-bottom:4px; flex-wrap:nowrap !important; }
    .ne-filter-row::-webkit-scrollbar { display:none; }
  }

  /* ── Very small ≤ 360px ── */
  @media (max-width:360px) {
    .ne-stats-grid-events { grid-template-columns:repeat(2,1fr) !important; }
    .ne-page { padding:12px 10px 90px !important; }
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ label, color = "#4f7cff" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".03em",
        background: `${color}18`,
        color,
        border: `1px solid ${color}28`,
        whiteSpace: "nowrap",
      }}
    >
      {str(label)}
    </span>
  );
}

function Spinner({ size = 13 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        border: "2px solid rgba(255,255,255,.2)",
        borderTopColor: "#fff",
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
  const c = data.type === "error" ? "#f43f5e" : "#22c55e";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 9999,
        background: "#161b22",
        border: `1.5px solid ${c}40`,
        borderRadius: 12,
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: T.text1,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 12px 40px rgba(0,0,0,.8)",
        animation: "fadeUp .3s ease",
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: c,
          flexShrink: 0,
        }}
      />
      {str(data.msg)}
    </div>
  );
}

function ConfirmModal({ item, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div
      className="ne-overlay"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.80)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        className="ne-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#161b22",
          border: `1.5px solid ${T.border}`,
          borderRadius: 16,
          padding: 28,
          maxWidth: 360,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 14 }}>🗑️</div>
        <h3
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: T.head,
            marginBottom: 8,
          }}
        >
          Confirm Delete
        </h3>
        <p
          style={{
            fontSize: 13,
            color: T.text3,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: T.text1 }}>{str(item.title)}</strong> will be
          permanently removed. This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="ne-btn" style={ghostBtn()}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="ne-btn"
            style={solidBtn("#f43f5e")}
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
        border: `2px dashed ${drag ? "#4f7cff" : preview ? "#22c55e40" : T.border}`,
        borderRadius: 10,
        cursor: "pointer",
        overflow: "hidden",
        background: drag ? "rgba(79,124,255,.04)" : T.bg2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color .2s, background .2s",
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
              background: "#22c55e",
              borderRadius: 999,
              padding: "2px 9px",
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
              background: "rgba(0,0,0,.65)",
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
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>
            {drag ? "📂" : "🖼️"}
          </div>
          <p style={{ color: T.text3, fontSize: 13, margin: 0 }}>
            Drop image or{" "}
            <span style={{ color: "#4f7cff", fontWeight: 600 }}>browse</span>
          </p>
          <p style={{ color: "#484f58", fontSize: 11, marginTop: 4 }}>
            PNG, JPG, WebP
          </p>
        </div>
      )}
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
function solidBtn(bg = "#4f7cff", extra = {}) {
  return {
    padding: "9px 20px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    ...extra,
  };
}

function ghostBtn(extra = {}) {
  return {
    padding: "9px 20px",
    borderRadius: 8,
    border: `1.5px solid ${T.border}`,
    background: "transparent",
    color: T.text2,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transition: "border-color .2s, color .2s",
    ...extra,
  };
}

function inputStyle(extra = {}) {
  return {
    background: T.bg2,
    border: `1.5px solid ${T.border}`,
    borderRadius: 8,
    color: T.text1,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    padding: "10px 14px",
    width: "100%",
    transition: "border-color .2s, box-shadow .2s",
    ...extra,
  };
}

function labelStyle() {
  return {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".07em",
    textTransform: "uppercase",
    color: T.text3,
    display: "block",
    marginBottom: 6,
  };
}

function FieldLabel({ label, required }) {
  return (
    <label style={labelStyle()}>
      {label}
      {required && <span style={{ color: "#f43f5e", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function StatCard({ label, val, color, sub, delay = 0 }) {
  return (
    <div
      className="ne-card ne-stat-card"
      style={{
        background: "#161b22",
        border: `1.5px solid ${T.border}`,
        borderRadius: 12,
        padding: "18px 16px",
        animation: `fadeUp .4s ease ${delay}ms both`,
      }}
    >
      <div
        className="ne-stat-label"
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: T.text3,
          marginBottom: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        className="ne-stat-val"
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}
      >
        {val}
      </div>
      <div
        className="ne-stat-sub"
        style={{ fontSize: 11, color: "#484f58", marginTop: 6 }}
      >
        {sub}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════
export default function News() {
  const token = localStorage.getItem("token") || "";
  const [tab, setTab] = useState("news");

  // News state
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

  // Events state
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
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchNews() {
    setNewsLoading(true);
    try {
      const r = await fetch(getAPI("/api/news?limit=100&page=1"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      const list = Array.isArray(d)
        ? d
        : Array.isArray(d.news)
          ? d.news
          : Array.isArray(d.data)
            ? d.data
            : [];
      setPosts(list);
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
      const list = Array.isArray(d)
        ? d
        : Array.isArray(d.events)
          ? d.events
          : Array.isArray(d.data)
            ? d.data
            : [];
      setEvents(list);
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

  // ── News handlers ──────────────────────────────────────────────────────────
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
          .getElementById("ne-panel-top")
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

  // ── Events handlers ────────────────────────────────────────────────────────
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
          .getElementById("ne-event-panel-top")
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

  // ── Filtered data ──────────────────────────────────────────────────────────
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

  // ── Shared card background (slightly lighter than page for contrast) ───────
  const CARD_BG = "#161b22";
  const PANEL_BG = "#161b22";

  return (
    <>
      <style>{CSS}</style>
      <div
        className="ne-page"
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "28px 24px 80px",
          fontFamily: "'DM Sans', sans-serif",
          color: T.text1,
          background: T.bg,
          overflowX: "hidden",
          overflowY: "visible",
        }}
      >
        {/* ── Page header ── */}
        <div
          className="ne-header-row"
          style={{ animation: "fadeUp .4s ease both" }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(20px,4vw,28px)",
                fontWeight: 800,
                letterSpacing: "-.5px",
                color: T.head,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Manage News &amp; <span style={{ color: T.accent }}>Events</span>
            </h1>
            <p
              style={{
                fontSize: 13,
                color: T.text3,
                marginTop: 5,
                marginBottom: 0,
              }}
            >
              Manage publications, announcements and upcoming events
            </p>
          </div>

          {/* Tab row + New button */}
          <div
            className="ne-tab-row"
            style={{ animation: "fadeUp .4s ease .05s both" }}
          >
            <div
              style={{
                display: "flex",
                background: T.bg2,
                border: `1.5px solid ${T.border}`,
                borderRadius: 10,
                padding: 3,
              }}
            >
              {["news", "events"].map((t) => (
                <button
                  key={t}
                  className="ne-tab-btn"
                  onClick={() => setTab(t)}
                  style={{
                    padding: "7px 18px",
                    borderRadius: 7,
                    border: "none",
                    background: tab === t ? T.accent : "transparent",
                    color: tab === t ? "#fff" : T.text2,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "all .2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t === "news" ? "📰 News" : "📅 Events"}
                </button>
              ))}
            </div>
            <button
              className="ne-btn ne-new-btn"
              onClick={() => {
                if (tab === "news") {
                  if (newsPanel && !editNewsId) {
                    closeNewsPanel();
                  } else {
                    setEditNewsId(null);
                    setNewsForm({ ...EMPTY_NEWS });
                    setNewsPanel(true);
                  }
                } else {
                  if (eventPanel && !editEventId) {
                    closeEventPanel();
                  } else {
                    setEditEventId(null);
                    setEventForm({ ...EMPTY_EVENT });
                    setEventPanel(true);
                  }
                }
              }}
              style={solidBtn(tab === "news" ? T.accent : "#22c55e", {
                whiteSpace: "nowrap",
              })}
            >
              {tab === "news"
                ? newsPanel && !editNewsId
                  ? "✕ Close"
                  : "+ Post a News"
                : eventPanel && !editEventId
                  ? "✕ Close"
                  : "+ Post an Event"}
            </button>
          </div>
        </div>

        {/* ══════════ NEWS TAB ══════════ */}
        {tab === "news" && (
          <div style={{ animation: "fadeIn .25s ease" }}>
            {/* Stats */}
            <div className="ne-stats-grid-news">
              <StatCard
                label="Total Posts"
                val={nStats.total}
                color={T.accent}
                sub="All articles"
                delay={0}
              />
              <StatCard
                label="Published"
                val={nStats.pub}
                color="#22c55e"
                sub="Live now"
                delay={50}
              />
              <StatCard
                label="Drafts"
                val={nStats.draft}
                color="#f59e0b"
                sub="Unpublished"
                delay={100}
              />
              <StatCard
                label="Categories"
                val={nStats.cats}
                color="#8b5cf6"
                sub="Topic areas"
                delay={150}
              />
            </div>

            {/* Search */}
            <div
              className="ne-toolbar"
              style={{ animation: "fadeUp .4s ease .2s both" }}
            >
              <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.text3,
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="ne-input"
                  style={inputStyle({ paddingLeft: 38 })}
                  placeholder="Search posts…"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div
              className="ne-filter-row"
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 22,
                flexWrap: "wrap",
                animation: "fadeUp .4s ease .25s both",
              }}
            >
              {[
                { k: "All", l: "All", c: posts.length },
                { k: "Published", l: "Published", c: nStats.pub },
                { k: "Draft", l: "Drafts", c: nStats.draft },
              ].map((f) => (
                <button
                  key={f.k}
                  className="ne-filter-btn"
                  onClick={() => setNewsFilter(f.k)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${newsFilter === f.k ? T.accent : T.border}`,
                    background:
                      newsFilter === f.k
                        ? "rgba(79,124,255,.10)"
                        : "transparent",
                    color: newsFilter === f.k ? T.accent : T.text2,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "all .2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {f.l}
                  <span
                    style={{
                      background: T.border,
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 10,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* News form panel */}
            {newsPanel && (
              <div
                id="ne-panel-top"
                className="ne-panel"
                style={{
                  background: PANEL_BG,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 14,
                  padding: "24px 20px 28px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 22,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.head,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      margin: 0,
                    }}
                  >
                    {editNewsId ? "✏️ Edit Post" : "📝 New Post"}
                    <Badge
                      label={editNewsId ? "Editing" : "New"}
                      color={editNewsId ? "#8b5cf6" : T.accent}
                    />
                  </h2>
                  <button
                    className="ne-btn"
                    onClick={closeNewsPanel}
                    style={ghostBtn({ padding: "7px 14px", fontSize: 12 })}
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="ne-form-2col">
                  {/* Title */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Title" required />
                    <input
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                          className="ne-status-btn"
                          onClick={() =>
                            setNewsForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            padding: "7px 20px",
                            borderRadius: 8,
                            border: "1.5px solid",
                            borderColor:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#22c55e"
                                  : "#f59e0b"
                                : T.border,
                            background:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "rgba(34,197,94,.10)"
                                  : "rgba(245,158,11,.10)"
                                : "transparent",
                            color:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#22c55e"
                                  : "#f59e0b"
                                : T.text2,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                            transition: "all .2s",
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
                      className="ne-input"
                      style={inputStyle({ minHeight: 80, resize: "vertical" })}
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
                      className="ne-input"
                      style={inputStyle({ minHeight: 140, resize: "vertical" })}
                      placeholder="Write the full article…"
                      value={newsForm.body}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, body: e.target.value }))
                      }
                    />
                    <div
                      style={{
                        fontSize: 11,
                        color: T.text3,
                        textAlign: "right",
                        marginTop: 4,
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
                    className="ne-btn"
                    onClick={closeNewsPanel}
                    style={ghostBtn()}
                  >
                    Cancel
                  </button>
                  <button
                    className="ne-btn"
                    onClick={saveNews}
                    disabled={newsSaving}
                    style={solidBtn(editNewsId ? "#8b5cf6" : T.accent, {
                      minWidth: 140,
                    })}
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
            <p style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>
              News Posts —{" "}
              <strong style={{ color: T.text1 }}>
                {visibleNews.length} of {posts.length}
              </strong>
            </p>

            {/* Grid */}
            {newsLoading ? (
              <div className="ne-cards-grid">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="ne-skeleton"
                    style={{
                      height: 170,
                      borderRadius: 12,
                      background: CARD_BG,
                      border: `1.5px solid ${T.border}`,
                    }}
                  />
                ))}
              </div>
            ) : visibleNews.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 20px",
                  color: T.text2,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>
                  📰
                </div>
                <p style={{ fontSize: 14 }}>
                  No posts found. Create one above!
                </p>
              </div>
            ) : (
              <div className="ne-cards-grid">
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
                      className="ne-card"
                      style={{
                        background: CARD_BG,
                        border: `1.5px solid ${T.border}`,
                        borderRadius: 12,
                        padding: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        animation: `fadeUp .35s ease ${i * 40}ms both`,
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
                          <Badge
                            label={category || "General"}
                            color={CAT_COLOR[category] || "#64748b"}
                          />
                          <Badge
                            label={post.isActive ? "Active" : "Draft"}
                            color={post.isActive ? "#22c55e" : "#f59e0b"}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            className="ne-btn ne-icon-btn"
                            onClick={() => openEditNews(post)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 7,
                              border: `1.5px solid ${T.border}`,
                              background: "transparent",
                              color: T.text2,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'DM Sans',sans-serif",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="ne-btn ne-del-btn"
                            onClick={() => setDeleteNewsItem(post)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 7,
                              border: `1.5px solid ${T.border}`,
                              background: "transparent",
                              color: T.text2,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: T.head,
                          lineHeight: 1.4,
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
                          gap: 10,
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
                            }}
                          >
                            👤 {author}
                          </span>
                        )}
                        {tag && (
                          <span
                            className="ne-tag-badge"
                            style={{
                              fontSize: 11,
                              color: T.accent,
                              background: "rgba(79,124,255,.08)",
                              border: "1px solid rgba(79,124,255,.18)",
                              borderRadius: 999,
                              padding: "2px 9px",
                              fontWeight: 600,
                            }}
                          >
                            # {tag}
                          </span>
                        )}
                        {post.date && (
                          <span style={{ fontSize: 11, color: T.text3 }}>
                            {fmtDate(post.date)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {description && (
                        <>
                          <p
                            style={{
                              fontSize: 13,
                              color: T.text2,
                              lineHeight: 1.6,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? 100 : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              transition: "all .3s",
                            }}
                          >
                            {description}
                          </p>
                          {isLong && (
                            <button
                              className="ne-read-more"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : post._id)
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: T.accent,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: 0,
                                fontFamily: "'DM Sans',sans-serif",
                                textAlign: "left",
                              }}
                            >
                              {isExpanded ? "Show less ▲" : "Read more ▼"}
                            </button>
                          )}
                        </>
                      )}
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
            <div className="ne-stats-grid-events">
              <StatCard
                label="Total Events"
                val={eStats.total}
                color={T.accent}
                sub="All events"
                delay={0}
              />
              <StatCard
                label="Upcoming"
                val={eStats.upcoming}
                color="#22c55e"
                sub="Scheduled"
                delay={50}
              />
              <StatCard
                label="Past"
                val={eStats.past}
                color="#6b7280"
                sub="Completed"
                delay={100}
              />
            </div>

            {/* Search */}
            <div
              className="ne-toolbar"
              style={{ animation: "fadeUp .4s ease .2s both" }}
            >
              <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.text3,
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="ne-input"
                  style={inputStyle({ paddingLeft: 38 })}
                  placeholder="Search events…"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div
              className="ne-filter-row"
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 22,
                flexWrap: "wrap",
                animation: "fadeUp .4s ease .25s both",
              }}
            >
              {[
                { k: "All", l: "All", c: events.length },
                { k: "Upcoming", l: "Upcoming", c: eStats.upcoming },
                { k: "Past", l: "Past", c: eStats.past },
              ].map((f) => (
                <button
                  key={f.k}
                  className="ne-filter-btn"
                  onClick={() => setEventFilter(f.k)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${eventFilter === f.k ? T.accent : T.border}`,
                    background:
                      eventFilter === f.k
                        ? "rgba(79,124,255,.10)"
                        : "transparent",
                    color: eventFilter === f.k ? T.accent : T.text2,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "all .2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {f.l}
                  <span
                    style={{
                      background: T.border,
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 10,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* Event form panel */}
            {eventPanel && (
              <div
                id="ne-event-panel-top"
                className="ne-panel"
                style={{
                  background: PANEL_BG,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 14,
                  padding: "24px 20px 28px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 22,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.head,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      margin: 0,
                    }}
                  >
                    {editEventId ? "✏️ Edit Event" : "📅 New Event"}
                    <Badge
                      label={editEventId ? "Editing" : "New"}
                      color={editEventId ? "#8b5cf6" : "#22c55e"}
                    />
                  </h2>
                  <button
                    className="ne-btn"
                    onClick={closeEventPanel}
                    style={ghostBtn({ padding: "7px 14px", fontSize: 12 })}
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="ne-form-2col">
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Event Title" required />
                    <input
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                      className="ne-input"
                      style={inputStyle()}
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
                          className="ne-status-btn"
                          onClick={() =>
                            setEventForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            padding: "7px 20px",
                            borderRadius: 8,
                            border: "1.5px solid",
                            borderColor:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#22c55e"
                                  : "#6b7280"
                                : T.border,
                            background:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "rgba(34,197,94,.10)"
                                  : "rgba(107,114,128,.10)"
                                : "transparent",
                            color:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#22c55e"
                                  : "#9ca3af"
                                : T.text2,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                            transition: "all .2s",
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
                      className="ne-input"
                      style={inputStyle({ minHeight: 90, resize: "vertical" })}
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
                          fontSize: 11,
                          color: "#f59e0b",
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        ⚠️ Preview only — paste a hosted URL below to save
                        permanently.
                      </p>
                    )}
                    <input
                      className="ne-input"
                      style={inputStyle({ marginTop: 8 })}
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
                    className="ne-btn"
                    onClick={closeEventPanel}
                    style={ghostBtn()}
                  >
                    Cancel
                  </button>
                  <button
                    className="ne-btn"
                    onClick={saveEvent}
                    disabled={eventSaving}
                    style={solidBtn(editEventId ? "#8b5cf6" : "#22c55e", {
                      minWidth: 140,
                    })}
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
            <p style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>
              Events —{" "}
              <strong style={{ color: T.text1 }}>
                {visibleEvents.length} of {events.length}
              </strong>
            </p>

            {/* Grid */}
            {eventsLoading ? (
              <div className="ne-cards-grid">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="ne-skeleton"
                    style={{
                      height: 220,
                      borderRadius: 12,
                      background: CARD_BG,
                      border: `1.5px solid ${T.border}`,
                    }}
                  />
                ))}
              </div>
            ) : visibleEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 20px",
                  color: T.text2,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>
                  📅
                </div>
                <p style={{ fontSize: 14 }}>
                  No events found. Create one above!
                </p>
              </div>
            ) : (
              <div className="ne-cards-grid">
                {visibleEvents.map((ev, i) => {
                  const evTitle = str(ev.title);
                  const evType = str(ev.type);
                  const evLocation = str(ev.location);
                  const evDescription = str(ev.description);
                  const evImageUrl = str(ev.imageUrl);

                  return (
                    <div
                      key={ev._id}
                      className="ne-card"
                      style={{
                        background: CARD_BG,
                        border: `1.5px solid ${T.border}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        animation: `fadeUp .35s ease ${i * 40}ms both`,
                      }}
                    >
                      {/* Banner image */}
                      {evImageUrl && (
                        <div
                          style={{
                            height: 160,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={evImageUrl}
                            alt={evTitle}
                            className="ne-img-zoom"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to top, rgba(13,17,23,.75) 0%, transparent 60%)",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 12,
                              display: "flex",
                              gap: 6,
                            }}
                          >
                            <Badge label={evType || "Event"} color={T.accent} />
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          padding: "16px 18px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {/* Badges + actions */}
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
                            {!evImageUrl && (
                              <Badge
                                label={evType || "Event"}
                                color={T.accent}
                              />
                            )}
                            <Badge
                              label={ev.isActive ? "Upcoming" : "Past"}
                              color={ev.isActive ? "#22c55e" : "#6b7280"}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              className="ne-btn ne-icon-btn"
                              onClick={() => openEditEvent(ev)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: 7,
                                border: `1.5px solid ${T.border}`,
                                background: "transparent",
                                color: T.text2,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="ne-btn ne-del-btn"
                              onClick={() => setDeleteEventItem(ev)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: 7,
                                border: `1.5px solid ${T.border}`,
                                background: "transparent",
                                color: T.text2,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          style={{
                            fontFamily: "'Sora',sans-serif",
                            fontSize: 15,
                            fontWeight: 700,
                            color: T.head,
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {evTitle}
                        </h3>

                        {/* Meta */}
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
                        >
                          {ev.date && (
                            <span
                              style={{
                                fontSize: 12,
                                color: T.text2,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              📅 {fmtDate(ev.date)}
                              {ev.time ? ` · ${str(ev.time)}` : ""}
                            </span>
                          )}
                          {evLocation && (
                            <span
                              style={{
                                fontSize: 12,
                                color: T.text2,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              📍 {evLocation}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {evDescription && (
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
                            {evDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals & Toast */}
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
