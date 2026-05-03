/**
 * AboutAdmin.jsx — Accelia Admin Portal
 * Light theme · matches Jobs page reference aesthetic
 * Blue accent #2B3AE7 · white backgrounds · clean typography
 * FIX: scroll background bleed removed (solid topbar bg, isolated banner)
 */

import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const INITIAL_DATA = {
  hero: {
    badge: "About Accelia",
    heading: "Who We Are",
    subheading:
      "Accelia is a full-service Site Management Organization (SMO) offering tailored support for biotechnology and pharmaceutical companies across all phases of clinical trials.",
  },
  story: {
    badge: "Our Story",
    heading: "Benchmark in Speed, Precision & Site Excellence",
    body1:
      "Accelia Clinical Solutions was founded with a singular mission: to transform clinical trial execution across India through operational excellence, regulatory precision, and unwavering commitment to patient safety.",
    body2:
      "Headquartered in Kolkata, we operate across all regions of West Bengal and have established a strong footprint in Assam, Bhubaneswar, Bihar, and Uttar Pradesh.",
    image: null,
  },
  stats: [
    { _id: "s1", value: "30+", label: "Clinical Trials Completed" },
    { _id: "s2", value: "1.5 Yrs", label: "Company Age" },
    { _id: "s3", value: "250+", label: "Clinician Network" },
    { _id: "s4", value: "6+", label: "States Covered" },
    { _id: "s5", value: "15+", label: "Therapy Areas" },
    { _id: "s6", value: "100%", label: "GCP Compliant" },
  ],
  mission:
    "To accelerate life-saving research by delivering world-class clinical trial management services that empower sponsors, protect patients, and uphold the highest standards of scientific integrity.",
  vision:
    "To be India's most trusted SMO — known for speed, precision, and unwavering commitment to transforming patient outcomes through clinical excellence.",
  values: [
    {
      _id: "v1",
      icon: "🔬",
      title: "Scientific Rigour",
      desc: "Every protocol followed with precision and data integrity at the core.",
    },
    {
      _id: "v2",
      icon: "🤝",
      title: "Patient First",
      desc: "Safety, dignity and well-being of participants guide every decision.",
    },
    {
      _id: "v3",
      icon: "⚡",
      title: "Speed & Efficiency",
      desc: "Faster timelines without compromising quality — that is our edge.",
    },
    {
      _id: "v4",
      icon: "🌐",
      title: "Nationwide Reach",
      desc: "A growing network spanning 6+ states and 250+ clinical investigators.",
    },
    {
      _id: "v5",
      icon: "📋",
      title: "Regulatory Mastery",
      desc: "Deep CDSCO expertise ensures smooth submissions every time.",
    },
    {
      _id: "v6",
      icon: "💡",
      title: "Innovation",
      desc: "Embracing technology and new methodologies to stay ahead of the curve.",
    },
  ],
};

let _sid = 10,
  _vid = 10;

/* ── Icon helper ── */
const Ic = ({ d, size = 16, sw = 1.6, col, fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill={fill}
    stroke={col || "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/* ── Design tokens ── */
const T = {
  blue: "#2B3AE7",
  blueDk: "#1E2BC4",
  blueLt: "#EEF0FD",
  blueMid: "#5B6CF5",
  bg: "#F4F5FA",
  bgCard: "#FFFFFF",
  border: "#E8E9F4",
  borderMd: "#D0D3EE",
  text1: "#0F1035",
  text2: "#4B5280",
  text3: "#9094B8",
  green: "#22C55E",
  greenBg: "#F0FDF4",
  red: "#EF4444",
  redBg: "#FFF1F1",
  shadow: "0 1px 3px rgba(43,58,231,0.06), 0 4px 16px rgba(43,58,231,0.04)",
  shadowMd: "0 4px 24px rgba(43,58,231,0.10), 0 1px 3px rgba(43,58,231,0.06)",
  shadowLg: "0 8px 40px rgba(43,58,231,0.14), 0 2px 8px rgba(43,58,231,0.08)",
};

/* ══ GLOBAL STYLES ══ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F4F5FA !important; }
  html { background: #F4F5FA !important; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:none } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(.94) } to { opacity:1; transform:none } }
  @keyframes popIn     { from { opacity:0; transform:scale(.9) translateY(8px) } to { opacity:1; transform:none } }
  @keyframes toastIn   { from { opacity:0; transform:translateX(20px) scale(.95) } to { opacity:1; transform:none } }
  @keyframes spinDot   { to { transform: rotate(360deg) } }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.borderMd}; border-radius: 10px; }

  input::placeholder, textarea::placeholder { color: ${T.text3} !important; }
  textarea { font-family: 'Plus Jakarta Sans', sans-serif !important; line-height: 1.6; }
  input, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }

  .ab-btn-primary {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px; border-radius:12px; font-size:13px; font-weight:700;
    color:white; background:${T.blue}; border:none; cursor:pointer;
    transition: background .2s, box-shadow .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(43,58,231,0.35);
  }
  .ab-btn-primary:hover { background:${T.blueDk}; box-shadow:0 6px 20px rgba(43,58,231,0.45); transform:translateY(-1px); }

  .ab-btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px; font-size:12px; font-weight:600;
    color:${T.text2}; background:white; border:1px solid ${T.border}; cursor:pointer;
    transition: all .2s; box-shadow: ${T.shadow};
  }
  .ab-btn-ghost:hover { border-color:${T.borderMd}; color:${T.text1}; box-shadow:${T.shadowMd}; transform:translateY(-1px); }

  .ab-btn-danger {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px; font-size:12px; font-weight:600;
    color:${T.red}; background:${T.redBg}; border:1px solid rgba(239,68,68,0.2); cursor:pointer;
    transition: all .2s;
  }
  .ab-btn-danger:hover { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.35); }

  .ab-card {
    background:${T.bgCard}; border:1px solid ${T.border}; border-radius:16px;
    box-shadow:${T.shadow}; transition: box-shadow .25s; animation: fadeUp .5s ease both;
  }

  .ab-input {
    width:100%; padding:9px 13px; border-radius:10px; font-size:13px;
    color:${T.text1}; background:${T.bg}; border:1.5px solid ${T.border};
    outline:none; transition: border-color .2s, box-shadow .2s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ab-input:focus { border-color:${T.blue}; box-shadow:0 0 0 3px rgba(43,58,231,0.10); background:white; }

  .ab-textarea {
    width:100%; padding:10px 13px; border-radius:10px; font-size:13px;
    color:${T.text1}; background:${T.bg}; border:1.5px solid ${T.border};
    outline:none; resize:vertical; min-height:90px; line-height:1.6;
    transition: border-color .2s, box-shadow .2s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ab-textarea:focus { border-color:${T.blue}; box-shadow:0 0 0 3px rgba(43,58,231,0.10); background:white; }

  .stat-card {
    background:white; border:1px solid ${T.border}; border-radius:14px;
    padding:18px 16px; position:relative; overflow:hidden;
    transition: box-shadow .25s, border-color .25s, transform .2s; box-shadow:${T.shadow};
  }
  .stat-card:hover { box-shadow:${T.shadowMd}; border-color:${T.borderMd}; transform:translateY(-2px); }
  .stat-card:hover .stat-actions { opacity:1 !important; }

  .val-card {
    background:white; border:1px solid ${T.border}; border-radius:14px;
    padding:20px; position:relative; overflow:hidden;
    transition: box-shadow .25s, border-color .25s, transform .2s; box-shadow:${T.shadow};
  }
  .val-card:hover { box-shadow:${T.shadowMd}; border-color:rgba(43,58,231,0.2); transform:translateY(-2px); }
  .val-card:hover .val-actions { opacity:1 !important; }

  .edit-btn {
    width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center;
    background:${T.blueLt}; border:1px solid rgba(43,58,231,0.15); color:${T.blue}; cursor:pointer; transition: all .2s;
  }
  .edit-btn:hover { background:${T.blue}; color:white; border-color:${T.blue}; }

  .del-btn {
    width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center;
    background:${T.redBg}; border:1px solid rgba(239,68,68,0.2); color:${T.red}; cursor:pointer; transition: all .2s;
  }
  .del-btn:hover { background:${T.red}; color:white; border-color:${T.red}; }

  .ghost-add {
    border:2px dashed ${T.borderMd}; border-radius:14px; background:transparent; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:8px; color:${T.text3}; transition: all .2s;
  }
  .ghost-add:hover { border-color:${T.blue}; color:${T.blue}; background:${T.blueLt}; }

  .field-edit-btn {
    display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600;
    color:${T.blue}; background:none; border:none; cursor:pointer; padding:3px 7px;
    border-radius:6px; transition: background .2s;
  }
  .field-edit-btn:hover { background:${T.blueLt}; }

  .section-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 22px; border-bottom:1px solid ${T.border};
  }

  .ab-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .ab-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .ab-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }

  /* Tab active indicator */
  .ab-tab { position:relative; transition: color .2s; }
  .ab-tab::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px;
    background:${T.blue}; transform:scaleX(0); transition: transform .2s;
    border-radius:2px 2px 0 0;
  }
  .ab-tab.active { color:${T.blue} !important; }
  .ab-tab.active::after { transform:scaleX(1); }

  @media(max-width:1024px) {
    .ab-grid-4 { grid-template-columns:1fr 1fr !important; }
    .ab-grid-3 { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:768px) {
    .ab-grid-2 { grid-template-columns:1fr !important; }
    .ab-grid-3 { grid-template-columns:1fr 1fr !important; }
    .ab-grid-4 { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:480px) {
    .ab-grid-3 { grid-template-columns:1fr !important; }
    .ab-grid-4 { grid-template-columns:1fr !important; }
    .section-header { flex-direction:column; align-items:flex-start; gap:10px; }
  }
`;

/* ══ TOAST ══ */
function Toast({ items }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
        maxWidth: "calc(100vw - 40px)",
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 16px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            background: t.type === "err" ? T.redBg : "white",
            border: `1.5px solid ${t.type === "err" ? "rgba(239,68,68,0.3)" : T.border}`,
            color: t.type === "err" ? T.red : T.text1,
            boxShadow: T.shadowLg,
            animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          <Ic
            d={
              t.type === "err"
                ? ["M10 3l7 14H3L10 3z", "M10 8v4", "M10 14h.01"]
                : "M4 10l4 4 8-8"
            }
            size={14}
            col={t.type === "err" ? T.red : T.blue}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ CONFIRM MODAL ══ */
function ConfirmModal({ open, label, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,16,53,0.5)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: 32,
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          boxShadow: T.shadowLg,
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: T.redBg,
            border: "1.5px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={20}
            col={T.red}
          />
        </div>
        <h3
          style={{
            color: T.text1,
            fontSize: 17,
            fontWeight: 800,
            marginBottom: 8,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Delete {label}?
        </h3>
        <p
          style={{
            color: T.text2,
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          This will be permanently removed from the public site.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            className="ab-btn-ghost"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              background: T.red,
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ ADD MODAL ══ */
function AddModal({ open, title, fields, onAdd, onClose }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (open) setForm({});
  }, [open]);
  if (!open) return null;
  const submit = () => {
    const required = fields.filter((f) => f.required !== false);
    if (required.some((f) => !form[f.key]?.trim())) return;
    onAdd(form);
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,16,53,0.5)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: T.shadowLg,
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <h3
            style={{
              color: T.text1,
              fontSize: 16,
              fontWeight: 800,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.bg,
              border: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.text2,
            }}
          >
            <Ic d="M5 5l10 10M15 5l-10 10" size={14} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map(({ key, label, placeholder, multiline, wide }) => (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: T.text3,
                  marginBottom: 5,
                }}
              >
                {label}
              </label>
              {multiline ? (
                <textarea
                  className="ab-textarea"
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  rows={3}
                />
              ) : (
                <input
                  className="ab-input"
                  value={form[key] || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  style={wide ? { fontSize: 22 } : {}}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          <button
            onClick={onClose}
            className="ab-btn-ghost"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="ab-btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Add {title.replace("Add ", "")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ SECTION CARD ══ */
function SectionCard({ title, icon, badge, children, actions, delay = 0 }) {
  return (
    <div
      className="ab-card"
      style={{
        borderRadius: 18,
        animationDelay: `${delay}ms`,
        overflow: "hidden",
      }}
    >
      <div className="section-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: T.blueLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <h2
              style={{
                color: T.text1,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </h2>
            {badge && (
              <span style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>
                {badge}
              </span>
            )}
          </div>
        </div>
        {actions && (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  );
}

/* ══ EDIT FIELD ══ */
function EditField({ label, value, onChange, multiline = false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef();
  useEffect(() => {
    setDraft(value);
  }, [value]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);
  const save = () => {
    onChange(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        {label && (
          <label
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.text3,
            }}
          >
            {label}
          </label>
        )}
        {!editing && (
          <button className="field-edit-btn" onClick={() => setEditing(true)}>
            <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <div style={{ animation: "fadeIn .15s ease" }}>
          {multiline ? (
            <textarea
              ref={ref}
              className="ab-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <input
              ref={ref}
              className="ab-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button
              onClick={cancel}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: T.text2,
                background: T.bg,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="ab-btn-primary"
              style={{ padding: "6px 16px", fontSize: 12 }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "10px 13px",
            borderRadius: 10,
            background: T.bg,
            border: `1px solid ${T.border}`,
            minHeight: 38,
          }}
        >
          <p
            style={{
              color: T.text2,
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {value || (
              <span style={{ color: T.text3, fontStyle: "italic" }}>Empty</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══ STAT CARD ══ */
function StatItem({ stat, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ value: stat.value, label: stat.label });
  const save = () => {
    onEdit(stat._id, draft);
    setEditing(false);
  };
  return (
    <div className="stat-card">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,${T.blue},${T.blueMid})`,
          opacity: editing ? 1 : 0,
          transition: "opacity .2s",
        }}
      />
      {editing ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "fadeIn .15s ease",
          }}
        >
          <input
            className="ab-input"
            value={draft.value}
            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            placeholder="Value (e.g. 30+)"
            autoFocus
          />
          <input
            className="ab-input"
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            placeholder="Label"
            style={{ fontSize: 12 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                color: T.text2,
                background: T.bg,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="ab-btn-primary"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "6px 0",
                fontSize: 11,
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              color: T.blue,
              fontSize: 26,
              fontWeight: 900,
              fontFamily: "'Syne',sans-serif",
              lineHeight: 1.1,
              marginBottom: 5,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              color: T.text3,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.4,
            }}
          >
            {stat.label}
          </p>
          <div
            className="stat-actions"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 5,
              opacity: 0,
              transition: "opacity .2s",
            }}
          >
            <button className="edit-btn" onClick={() => setEditing(true)}>
              <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} />
            </button>
            <button className="del-btn" onClick={() => onDelete(stat._id)}>
              <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══ VALUE CARD ══ */
function ValueItem({ val, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    icon: val.icon,
    title: val.title,
    desc: val.desc,
  });
  const save = () => {
    onEdit(val._id, draft);
    setEditing(false);
  };
  return (
    <div className="val-card">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,${T.blue},${T.blueMid})`,
          opacity: editing ? 1 : 0,
          transition: "opacity .2s",
        }}
      />
      {editing ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "fadeIn .15s ease",
          }}
        >
          <input
            className="ab-input"
            value={draft.icon}
            onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
            placeholder="Emoji"
            style={{ fontSize: 22, width: 60 }}
            autoFocus
          />
          <input
            className="ab-input"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Title"
          />
          <textarea
            className="ab-textarea"
            value={draft.desc}
            rows={3}
            onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
            placeholder="Description"
            style={{ minHeight: 70 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                color: T.text2,
                background: T.bg,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="ab-btn-primary"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "6px 0",
                fontSize: 11,
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: T.blueLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginBottom: 12,
            }}
          >
            {val.icon}
          </div>
          <p
            style={{
              color: T.text1,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 5,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {val.title}
          </p>
          <p style={{ color: T.text2, fontSize: 12, lineHeight: 1.6 }}>
            {val.desc}
          </p>
          <div
            className="val-actions"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 5,
              opacity: 0,
              transition: "opacity .2s",
            }}
          >
            <button className="edit-btn" onClick={() => setEditing(true)}>
              <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} />
            </button>
            <button className="del-btn" onClick={() => onDelete(val._id)}>
              <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function AboutAdmin() {
  const [data, setData] = useState(INITIAL_DATA);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmDel, setConfirmDel] = useState(null);
  const [addStatOpen, setAddStatOpen] = useState(false);
  const [addValOpen, setAddValOpen] = useState(false);
  const [storyImgPreview, setStoryImgPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const imgRef = useRef();
  const tid = useRef(0);

  const toast = useCallback((msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const updateHero = (k, v) => {
    setData((d) => ({ ...d, hero: { ...d.hero, [k]: v } }));
    toast("Hero updated");
  };
  const updateStory = (k, v) => {
    setData((d) => ({ ...d, story: { ...d.story, [k]: v } }));
    toast("Story updated");
  };
  const handleStoryImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      setStoryImgPreview(ev.target.result);
      updateStory("image", ev.target.result);
    };
    r.readAsDataURL(file);
  };
  const editStat = (id, p) => {
    setData((d) => ({
      ...d,
      stats: d.stats.map((s) => (s._id === id ? { ...s, ...p } : s)),
    }));
    toast("Stat updated");
  };
  const deleteStat = (id) => setConfirmDel({ type: "stat", id, label: "Stat" });
  const addStat = (f) => {
    setData((d) => ({
      ...d,
      stats: [...d.stats, { _id: `s${++_sid}`, ...f }],
    }));
    toast("Stat added");
  };
  const updateMission = (v) => {
    setData((d) => ({ ...d, mission: v }));
    toast("Mission updated");
  };
  const updateVision = (v) => {
    setData((d) => ({ ...d, vision: v }));
    toast("Vision updated");
  };
  const editValue = (id, p) => {
    setData((d) => ({
      ...d,
      values: d.values.map((v) => (v._id === id ? { ...v, ...p } : v)),
    }));
    toast("Value updated");
  };
  const deleteValue = (id) =>
    setConfirmDel({ type: "value", id, label: "Value" });
  const addValue = (f) => {
    setData((d) => ({
      ...d,
      values: [...d.values, { _id: `v${++_vid}`, ...f }],
    }));
    toast("Value added");
  };
  const confirmDelete = () => {
    const { type, id } = confirmDel;
    if (type === "stat")
      setData((d) => ({ ...d, stats: d.stats.filter((s) => s._id !== id) }));
    if (type === "value")
      setData((d) => ({ ...d, values: d.values.filter((v) => v._id !== id) }));
    toast("Deleted", "err");
    setConfirmDel(null);
  };
  const handlePublish = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSaving(false);
    setSaved(true);
    toast("Changes published to public site ✓");
    setTimeout(() => setSaved(false), 3000);
  };

  const totalStats = data.stats.length;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/*
        KEY FIX: The root wrapper uses a solid #F4F5FA background with NO transparency.
        This prevents the dark bleed artifact caused by backdrop-filter on the sticky bar
        compositing with the gradient banner below it during scroll.
      */}
      <div
        style={{ minHeight: "100vh", background: T.bg, isolation: "isolate" }}
      >
        {/* ══ STICKY TOP BAR — solid bg, NO backdrop-filter ══ */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            /* FIXED: solid color instead of rgba + backdropFilter which caused bleed */
            background: T.bg,
            borderBottom: `1px solid ${T.border}`,
            boxShadow: "0 1px 0 rgba(43,58,231,0.06)",
            animation: "fadeUp .4s ease both",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
              gap: 12,
            }}
          >
            {/* Left */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                minWidth: 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: T.blue,
                    marginBottom: 1,
                  }}
                >
                  About Page Manager
                </div>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: T.text1,
                    fontFamily: "'Syne',sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  Manage <span style={{ color: T.blue }}>&</span> Edit Content
                </h1>
              </div>
            </div>
            {/* Right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="ab-btn-ghost">
                  <Ic
                    d={[
                      "M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z",
                      "M10 10a1 1 0 100-2 1 1 0 000 2z",
                    ]}
                    size={13}
                  />
                  Preview
                </button>
              </a>
              <button
                onClick={handlePublish}
                className="ab-btn-primary"
                style={{
                  minWidth: 148,
                  justifyContent: "center",
                  background: saved ? T.green : T.blue,
                  opacity: saving ? 0.85 : 1,
                }}
              >
                {saving ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        animation: "spinDot .7s linear infinite",
                      }}
                    />{" "}
                    Publishing…
                  </>
                ) : saved ? (
                  <>
                    <Ic d="M4 10l4 4 8-8" size={14} /> Published!
                  </>
                ) : (
                  <>
                    <Ic d={["M4 14l1-5 4 4 5-8", "M2 16h16"]} size={14} />{" "}
                    Publish Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              gap: 0,
              borderTop: `1px solid ${T.border}`,
            }}
          >
            {[
              ["content", "Content Sections", "📝"],
              ["stats", "Stats & Numbers", "📊"],
              ["values", "Core Values", "💎"],
            ].map(([id, label, ico]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`ab-tab${activeTab === id ? " active" : ""}`}
                style={{
                  padding: "10px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: activeTab === id ? T.blue : T.text2,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === id
                      ? `2px solid ${T.blue}`
                      : "2px solid transparent",
                  transition: "color .2s, border-color .2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 13 }}>{ico}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ HERO PREVIEW BANNER
            FIX: wrapped in a div with background: T.bg so there's no bg gap
            between the sticky bar and the banner. The gradient is self-contained
            inside a card — it cannot bleed outside its border-radius. ══ */}
        <div style={{ background: T.bg, paddingTop: 20, paddingBottom: 0 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                /* FIXED: isolated compositing context so gradient never bleeds upward */
                isolation: "isolate",
                background: `linear-gradient(135deg,${T.blue} 0%,${T.blueMid} 100%)`,
                padding: "28px 32px",
                color: "white",
                animation: "fadeUp .45s ease both",
              }}
            >
              {/* Decorative circles — clipped inside overflow:hidden, cannot leak */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -60,
                  right: 60,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      {data.hero.badge}
                    </span>
                    <h2
                      style={{
                        fontSize: "clamp(22px,4vw,34px)",
                        fontWeight: 900,
                        fontFamily: "'Syne',sans-serif",
                        lineHeight: 1.15,
                        marginBottom: 10,
                      }}
                    >
                      {data.hero.heading}
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        opacity: 0.8,
                        maxWidth: 520,
                        lineHeight: 1.7,
                      }}
                    >
                      {data.hero.subheading}
                    </p>
                  </div>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 8,
                      padding: "4px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                      alignSelf: "flex-start",
                    }}
                  >
                    ● LIVE PREVIEW
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  {data.stats.slice(0, 4).map((s) => (
                    <div key={s._id}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          fontFamily: "'Syne',sans-serif",
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          opacity: 0.65,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ MAIN CONTENT — always on T.bg ══ */}
        <div
          style={{
            background: T.bg,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "16px 20px 60px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* ── TAB: CONTENT ── */}
          {activeTab === "content" && (
            <>
              {/* Hero */}
              <SectionCard
                title="Hero Section"
                icon="🎯"
                delay={0}
                badge="Public page header"
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  <EditField
                    label="Badge Text"
                    value={data.hero.badge}
                    onChange={(v) => updateHero("badge", v)}
                  />
                  <EditField
                    label="Main Heading"
                    value={data.hero.heading}
                    onChange={(v) => updateHero("heading", v)}
                  />
                  <EditField
                    label="Subheading / Description"
                    value={data.hero.subheading}
                    onChange={(v) => updateHero("subheading", v)}
                    multiline
                  />
                </div>
              </SectionCard>

              {/* Our Story */}
              <SectionCard
                title="Our Story"
                icon="📖"
                delay={60}
                badge="Origin and background narrative"
              >
                <div className="ab-grid-2">
                  <div>
                    <EditField
                      label="Section Badge"
                      value={data.story.badge}
                      onChange={(v) => updateStory("badge", v)}
                    />
                    <EditField
                      label="Section Heading"
                      value={data.story.heading}
                      onChange={(v) => updateStory("heading", v)}
                      multiline
                    />
                    <EditField
                      label="Paragraph 1"
                      value={data.story.body1}
                      onChange={(v) => updateStory("body1", v)}
                      multiline
                    />
                    <EditField
                      label="Paragraph 2"
                      value={data.story.body2}
                      onChange={(v) => updateStory("body2", v)}
                      multiline
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: T.text3,
                        marginBottom: 8,
                      }}
                    >
                      Story Image
                    </label>
                    {storyImgPreview || data.story.image ? (
                      <div
                        style={{
                          position: "relative",
                          borderRadius: 14,
                          overflow: "hidden",
                          height: 220,
                        }}
                      >
                        <img
                          src={storyImgPreview || data.story.image}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(15,16,53,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            opacity: 0,
                            transition: "opacity .2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = 1)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = 0)
                          }
                        >
                          <button
                            onClick={() => imgRef.current?.click()}
                            className="ab-btn-primary"
                            style={{ fontSize: 12, padding: "7px 14px" }}
                          >
                            Change
                          </button>
                          <button
                            onClick={() => {
                              setStoryImgPreview(null);
                              updateStory("image", null);
                            }}
                            className="ab-btn-danger"
                            style={{ fontSize: 12, padding: "7px 14px" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => imgRef.current?.click()}
                        style={{
                          width: "100%",
                          height: 180,
                          borderRadius: 14,
                          border: `2px dashed ${T.borderMd}`,
                          background: T.blueLt,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          color: T.text3,
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = T.blue;
                          e.currentTarget.style.color = T.blue;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = T.borderMd;
                          e.currentTarget.style.color = T.text3;
                        }}
                      >
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 14,
                            background: "white",
                            border: `1px solid ${T.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: T.shadow,
                          }}
                        >
                          <Ic
                            d={["M4 14l4-4 3 3 4-5 5 6H4z", "M3 3h14v14H3z"]}
                            size={22}
                            col={T.blue}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p
                            style={{
                              color: T.text1,
                              fontSize: 13,
                              fontWeight: 600,
                              marginBottom: 3,
                            }}
                          >
                            Upload story image
                          </p>
                          <p style={{ color: T.text3, fontSize: 11 }}>
                            PNG, JPG up to 5 MB
                          </p>
                        </div>
                      </button>
                    )}
                    <input
                      ref={imgRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleStoryImg}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Mission & Vision */}
              <SectionCard
                title="Mission & Vision"
                icon="🎯"
                delay={120}
                badge="Strategic direction statements"
              >
                <div className="ab-grid-2">
                  <div
                    style={{
                      background: `linear-gradient(135deg,${T.blueLt},rgba(91,108,245,0.06))`,
                      border: `1.5px solid rgba(43,58,231,0.12)`,
                      borderRadius: 14,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 14,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>🎯</span>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: T.blue,
                        }}
                      >
                        Mission
                      </p>
                    </div>
                    <EditField
                      label=""
                      value={data.mission}
                      onChange={updateMission}
                      multiline
                    />
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(99,102,241,0.05),rgba(139,92,246,0.05))",
                      border: "1.5px solid rgba(99,102,241,0.15)",
                      borderRadius: 14,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 14,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>🔭</span>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#6366f1",
                        }}
                      >
                        Vision
                      </p>
                    </div>
                    <EditField
                      label=""
                      value={data.vision}
                      onChange={updateVision}
                      multiline
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Raw JSON */}
              <SectionCard
                title="Raw Data Preview"
                icon="⚙️"
                delay={180}
                badge="JSON snapshot"
                actions={
                  <button
                    className="ab-btn-ghost"
                    style={{ fontSize: 11, padding: "6px 12px" }}
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        JSON.stringify(data, null, 2),
                      );
                      toast("JSON copied ✓");
                    }}
                  >
                    <Ic
                      d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM2 6h2v12h10v2H2V6z"
                      size={13}
                    />{" "}
                    Copy
                  </button>
                }
              >
                <pre
                  style={{
                    background: T.bg,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 11,
                    color: T.text2,
                    overflow: "auto",
                    maxHeight: 180,
                    border: `1px solid ${T.border}`,
                    lineHeight: 1.7,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {JSON.stringify(
                    {
                      hero: data.hero,
                      mission: data.mission,
                      vision: data.vision,
                      statsCount: data.stats.length,
                      valuesCount: data.values.length,
                    },
                    null,
                    2,
                  )}
                </pre>
              </SectionCard>
            </>
          )}

          {/* ── TAB: STATS ── */}
          {activeTab === "stats" && (
            <SectionCard
              title="Stats & Numbers"
              icon="📊"
              delay={0}
              badge={`${totalStats} stats · shown on public site`}
              actions={
                <button
                  className="ab-btn-primary"
                  style={{ fontSize: 12, padding: "7px 14px" }}
                  onClick={() => setAddStatOpen(true)}
                >
                  <Ic d="M10 4v12M4 10h12" size={14} /> Add Stat
                </button>
              }
            >
              <div className="ab-grid-4" style={{ marginBottom: 20 }}>
                {[
                  ["Total Stats", totalStats, T.blue, "📊"],
                  ["Visible", totalStats, T.green, "✅"],
                  ["Sections", "Hero, Story", "#f59e0b", "📄"],
                  ["Last Edit", "Just now", T.text2, "🕐"],
                ].map(([lbl, val, col, ico]) => (
                  <div
                    key={lbl}
                    style={{
                      background: "white",
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      boxShadow: T.shadow,
                    }}
                  >
                    <div style={{ fontSize: 13, marginBottom: 5 }}>{ico}</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: col,
                        fontFamily: "'Syne',sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.text3,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginTop: 4,
                      }}
                    >
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div className="ab-grid-3">
                {data.stats.map((s) => (
                  <StatItem
                    key={s._id}
                    stat={s}
                    onEdit={editStat}
                    onDelete={deleteStat}
                  />
                ))}
                <button
                  className="ghost-add"
                  style={{ minHeight: 92, padding: 16 }}
                  onClick={() => setAddStatOpen(true)}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: `1.5px dashed ${T.borderMd}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    +
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>
                    Add Stat
                  </span>
                </button>
              </div>
            </SectionCard>
          )}

          {/* ── TAB: VALUES ── */}
          {activeTab === "values" && (
            <SectionCard
              title="Core Values"
              icon="💎"
              delay={0}
              badge={`${data.values.length} values · displayed on about page`}
              actions={
                <button
                  className="ab-btn-primary"
                  style={{ fontSize: 12, padding: "7px 14px" }}
                  onClick={() => setAddValOpen(true)}
                >
                  <Ic d="M10 4v12M4 10h12" size={14} /> Add Value
                </button>
              }
            >
              <div className="ab-grid-3">
                {data.values.map((v) => (
                  <ValueItem
                    key={v._id}
                    val={v}
                    onEdit={editValue}
                    onDelete={deleteValue}
                  />
                ))}
                <button
                  className="ghost-add"
                  style={{ minHeight: 120, padding: 18 }}
                  onClick={() => setAddValOpen(true)}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      border: `1.5px dashed ${T.borderMd}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    +
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>
                    Add Value
                  </span>
                </button>
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ══ MODALS ══ */}
      <AddModal
        open={addStatOpen}
        title="Add Stat"
        fields={[
          {
            key: "value",
            label: "Value",
            placeholder: "e.g. 30+",
            required: true,
          },
          {
            key: "label",
            label: "Label",
            placeholder: "e.g. Clinical Trials Completed",
            required: true,
          },
        ]}
        onAdd={addStat}
        onClose={() => setAddStatOpen(false)}
      />
      <AddModal
        open={addValOpen}
        title="Add Value"
        fields={[
          { key: "icon", label: "Icon (emoji)", placeholder: "🔬", wide: true },
          {
            key: "title",
            label: "Title",
            placeholder: "e.g. Scientific Rigour",
            required: true,
          },
          {
            key: "desc",
            label: "Description",
            placeholder: "Short description…",
            multiline: true,
          },
        ]}
        onAdd={addValue}
        onClose={() => setAddValOpen(false)}
      />
      <ConfirmModal
        open={!!confirmDel}
        label={confirmDel?.label}
        onConfirm={confirmDelete}
        onClose={() => setConfirmDel(null)}
      />
      <Toast items={toasts} />
    </>
  );
}
