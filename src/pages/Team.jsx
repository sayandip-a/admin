// src/admin/Team.jsx — Admin panel, light clinical theme (Accelia style)
import { useState, useEffect, useRef } from "react";
import {
  fetchAdminTeam,
  createMember,
  updateMember,
  deleteMember,
  updateMemberStatus,
} from "../services/teamApi";

/* ─── Config ──────────────────────────────────────────────── */
const AVATAR_PALETTES = [
  { bg: "linear-gradient(135deg,#6366f1,#818cf8)", ring: "#6366f1" },
  { bg: "linear-gradient(135deg,#3b82f6,#60a5fa)", ring: "#3b82f6" },
  { bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)", ring: "#8b5cf6" },
  { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)", ring: "#06b6d4" },
  { bg: "linear-gradient(135deg,#10b981,#6ee7b7)", ring: "#10b981" },
  { bg: "linear-gradient(135deg,#f59e0b,#fcd34d)", ring: "#f59e0b" },
];

const DEPARTMENTS = [
  "All",
  "Oncology Research",
  "Cardiovascular",
  "Neurology",
  "Medical Affairs",
  "Data Science",
  "Regulatory Affairs",
];

const STATUS_OPTIONS = ["Active", "On Leave", "Inactive"];

const EMPTY_FORM = {
  name: "",
  role: "",
  email: "",
  department: "Oncology Research",
  status: "Active",
  avatar: null,
  projects: 0,
  order: 0,
};

const STATUS_META = {
  Active: {
    bg: "#dcfce7",
    color: "#15803d",
    dot: "#22c55e",
    border: "#bbf7d0",
  },
  "On Leave": {
    bg: "#fef9c3",
    color: "#a16207",
    dot: "#eab308",
    border: "#fef08a",
  },
  Inactive: {
    bg: "#f1f5f9",
    color: "#64748b",
    dot: "#94a3b8",
    border: "#e2e8f0",
  },
};

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}
function getPalette(i) {
  return AVATAR_PALETTES[i % AVATAR_PALETTES.length];
}

/* ─── Inline Styles ───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{font-family:'DM Sans',sans-serif;box-sizing:border-box;}
  @keyframes fadeUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
  @keyframes modalPop {from{opacity:0;transform:scale(0.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes slideRight{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes spin     {to{transform:rotate(360deg)}}
  @keyframes pulse2   {0%,100%{opacity:1}50%{opacity:.45}}
  @keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
  .animate-spin{animation:spin 0.85s linear infinite}
  .card-hover{transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
  .card-hover:hover{transform:translateY(-4px);box-shadow:0 16px 40px -12px rgba(99,102,241,.18);border-color:#c7d2fe!important}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:8px}
  .shimmer{background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:200% 100%;animation:shimmer 1.4s infinite}
`;

/* ─── Toast ───────────────────────────────────────────────── */
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const isErr = type === "error";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 200,
        padding: "12px 20px",
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 500,
        background: isErr ? "#fef2f2" : "#f0fdf4",
        color: isErr ? "#dc2626" : "#15803d",
        border: `1px solid ${isErr ? "#fecaca" : "#bbf7d0"}`,
        boxShadow: "0 8px 24px -4px rgba(0,0,0,.12)",
        animation: "slideRight .3s ease both",
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: 320,
      }}
    >
      <span style={{ fontSize: 16 }}>{isErr ? "⚠️" : "✓"}</span>
      {message}
    </div>
  );
}

/* ─── Skeleton Card ───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        padding: 20,
        animation: "fadeUp .5s ease both",
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div
          className="shimmer"
          style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="shimmer"
            style={{
              height: 13,
              borderRadius: 8,
              width: "70%",
              marginBottom: 8,
            }}
          />
          <div
            className="shimmer"
            style={{ height: 11, borderRadius: 8, width: "50%" }}
          />
        </div>
      </div>
      <div className="shimmer" style={{ height: 1, marginBottom: 14 }} />
      <div
        className="shimmer"
        style={{ height: 11, borderRadius: 8, width: "80%", marginBottom: 8 }}
      />
      <div
        className="shimmer"
        style={{ height: 11, borderRadius: 8, width: "55%", marginBottom: 16 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <div
          className="shimmer"
          style={{ flex: 1, height: 32, borderRadius: 10 }}
        />
        <div
          className="shimmer"
          style={{ flex: 1, height: 32, borderRadius: 10 }}
        />
      </div>
    </div>
  );
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Avatar({ member, paletteIndex = 0, size = "lg", onImageChange }) {
  const ref = useRef();
  const pal = getPalette(paletteIndex);
  const sz = size === "lg" ? 52 : 38;
  return (
    <div style={{ position: "relative", width: sz, height: sz, flexShrink: 0 }}>
      <div
        style={{
          width: sz,
          height: sz,
          borderRadius: 14,
          background: pal.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size === "lg" ? 17 : 13,
          color: "#fff",
          boxShadow: `0 0 0 3px ${pal.ring}22,0 4px 12px ${pal.ring}33`,
          overflow: "hidden",
        }}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>{getInitials(member.name)}</span>
        )}
      </div>
      {onImageChange && (
        <>
          <button
            type="button"
            onClick={() => ref.current.click()}
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#6366f1",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              boxShadow: "0 2px 6px #6366f144",
            }}
          >
            <svg
              width="9"
              height="9"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 1v10M1 6h10" />
            </svg>
          </button>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = (ev) => onImageChange(ev.target.result);
              r.readAsDataURL(f);
            }}
          />
        </>
      )}
    </div>
  );
}

/* ─── Department Badge ────────────────────────────────────── */
function DeptBadge({ dept }) {
  const colors = {
    "Oncology Research": ["#ede9fe", "#7c3aed"],
    Cardiovascular: ["#fee2e2", "#dc2626"],
    Neurology: ["#dbeafe", "#2563eb"],
    "Medical Affairs": ["#d1fae5", "#059669"],
    "Data Science": ["#e0f2fe", "#0284c7"],
    "Regulatory Affairs": ["#fef9c3", "#a16207"],
  }[dept] || ["#f1f5f9", "#64748b"];
  return (
    <span
      style={{
        fontSize: 10,
        padding: "3px 9px",
        borderRadius: 20,
        fontWeight: 600,
        background: colors[0],
        color: colors[1],
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
      }}
    >
      {dept}
    </span>
  );
}

/* ─── Member Card ─────────────────────────────────────────── */
function MemberCard({
  member,
  paletteIndex,
  onEdit,
  onDelete,
  onStatusChange,
  index,
  loading,
}) {
  const st = STATUS_META[member.status] || STATUS_META.Inactive;
  return (
    <div
      className="card-hover"
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 20,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        animation: `fadeUp .5s ease both`,
        animationDelay: `${index * 60}ms`,
        opacity: loading ? 0.7 : 1,
        pointerEvents: loading ? "none" : "auto",
        transition: "opacity .2s",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: getPalette(paletteIndex).bg,
          borderRadius: "20px 20px 0 0",
        }}
      />

      {/* Order */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          fontSize: 10,
          color: "#cbd5e1",
          fontFamily: "'Syne',sans-serif",
          fontWeight: 600,
        }}
      >
        #{String(member.order ?? 0).padStart(2, "0")}
      </div>

      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14, marginTop: 6 }}>
        <Avatar member={member} paletteIndex={paletteIndex} size="lg" />
        <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#64748b",
              margin: "2px 0 6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.role}
          </p>
          {/* Status select */}
          <select
            value={member.status}
            onChange={(e) => onStatusChange(member._id, e.target.value)}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 20,
              fontWeight: 600,
              border: `1px solid ${st.border}`,
              background: st.bg,
              color: st.color,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option
                key={s}
                value={s}
                style={{ background: "#fff", color: "#0f172a" }}
              >
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ height: 1, background: "#f1f5f9", marginBottom: 12 }} />

      {/* Meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <DeptBadge dept={member.department} />
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
          {member.projects} proj.
        </span>
      </div>

      <p
        style={{
          fontSize: 11,
          color: "#64748b",
          display: "flex",
          alignItems: "center",
          gap: 5,
          margin: "0 0 3px",
          overflow: "hidden",
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 14 14"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.4"
        >
          <rect x="1" y="3" width="12" height="9" rx="1.5" />
          <path d="M1 5l6 4 6-4" strokeLinecap="round" />
        </svg>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {member.email}
        </span>
      </p>
      <p style={{ fontSize: 11, color: "#cbd5e1", margin: "0 0 14px" }}>
        Joined {member.joined}
      </p>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <ActionBtn
          onClick={() => onEdit(member)}
          hoverColor="#6366f1"
          hoverBg="#eef2ff"
          icon={
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" strokeLinejoin="round" />
            </svg>
          }
        >
          Edit
        </ActionBtn>
        <ActionBtn
          onClick={() => onDelete(member._id, member.name)}
          hoverColor="#dc2626"
          hoverBg="#fef2f2"
          icon={
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.8 8.5H3.3l-.8-8.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Delete
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, icon, hoverColor, hoverBg }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "7px 0",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .2s",
        background: h ? hoverBg : "#f8fafc",
        color: h ? hoverColor : "#64748b",
        border: `1px solid ${h ? hoverColor + "33" : "#e2e8f0"}`,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/* ─── Modal ───────────────────────────────────────────────── */
function Modal({
  show,
  isEdit,
  form,
  setForm,
  onConfirm,
  onClose,
  onAvatarChange,
  saving,
  error,
}) {
  if (!show) return null;
  const inp = {
    width: "100%",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    color: "#0f172a",
    outline: "none",
    transition: "border-color .2s",
    fontFamily: "'DM Sans',sans-serif",
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,23,42,.45)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 28,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 64px -16px rgba(0,0,0,.25)",
          animation: "modalPop .3s cubic-bezier(.34,1.56,.64,1) both",
          overflowY: "auto",
          maxHeight: "92vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {isEdit ? "Edit Member" : "Add Member"}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>
              {isEdit
                ? "Update member details"
                : "Fill in details to add a new member"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#f1f5f9",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: 16,
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            ✕
          </button>
        </div>

        {/* Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 22,
                color: "#fff",
                overflow: "hidden",
                boxShadow: "0 0 0 4px #e0e7ff",
              }}
            >
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>{getInitials(form.name)}</span>
              )}
            </div>
            <label
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 18,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: 0,
                transition: "opacity .2s",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                gap: 3,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = (ev) => onAvatarChange(ev.target.result);
                  r.readAsDataURL(f);
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 16s0-4 6-4 6 4 6 4" strokeLinecap="round" />
                <circle cx="10" cy="8" r="3" />
              </svg>
              Photo
            </label>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 12,
              color: "#dc2626",
              background: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            style={inp}
            placeholder="Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <input
              style={inp}
              placeholder="Role / Title"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <input
              style={inp}
              placeholder="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            style={{ ...inp, color: "#0f172a" }}
          >
            {DEPARTMENTS.slice(1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Projects
              </label>
              <input
                style={inp}
                placeholder="0"
                type="number"
                min="0"
                value={form.projects}
                onChange={(e) =>
                  setForm({ ...form, projects: Number(e.target.value) })
                }
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Display Order
              </label>
              <input
                style={inp}
                placeholder="0"
                type="number"
                min="0"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>
          {/* Status */}
          <div style={{ display: "flex", gap: 8 }}>
            {STATUS_OPTIONS.map((s) => {
              const active = form.status === s;
              const m = STATUS_META[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                    background: active ? m.bg : "#f8fafc",
                    color: active ? m.color : "#94a3b8",
                    border: `1.5px solid ${active ? m.border : "#e2e8f0"}`,
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 12,
              background: "#f1f5f9",
              border: "1.5px solid #e2e8f0",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 12,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px #6366f133",
              opacity: saving ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity .2s",
            }}
          >
            {saving && (
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Dialog ───────────────────────────────────────── */
function DeleteDialog({ name, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,23,42,.45)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 24px 64px -16px rgba(0,0,0,.25)",
          animation: "modalPop .25s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#fef2f2",
            border: "1.5px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 14"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.6"
          >
            <path
              d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.8 8.5H3.3l-.8-8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 16,
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Remove Member
        </h3>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Are you sure you want to remove{" "}
          <strong style={{ color: "#0f172a" }}>{name}</strong>? This cannot be
          undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              background: "#f1f5f9",
              border: "1.5px solid #e2e8f0",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              background: "#dc2626",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading && (
              <svg
                className="animate-spin"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Pill ───────────────────────────────────────────── */
function StatPill({ icon, value, label, accent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accent}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          fontSize: 16,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            fontWeight: 500,
            marginTop: 1,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [cardLoading, setCardLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminTeam();
        setMembers(data);
      } catch (err) {
        showToast("Failed to load team members", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = members.filter((m) => {
    const matchDept = filter === "All" || m.department === filter;
    const q = search.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  const handleConfirm = async () => {
    if (!form.name.trim()) return setModalError("Name is required.");
    if (!form.email.trim()) return setModalError("Email is required.");
    setModalError("");
    setSaving(true);
    try {
      if (isEdit) {
        const updated = await updateMember(currentId, form);
        setMembers((prev) =>
          prev.map((m) => (m._id === currentId ? updated : m)),
        );
        showToast(`${updated.name} updated successfully`);
      } else {
        const created = await createMember({
          ...form,
          joined: new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
        });
        setMembers((prev) => [...prev, created]);
        showToast(`${created.name} added to the team`);
      }
      closeModal();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setIsEdit(true);
    setCurrentId(member._id);
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      department: member.department,
      status: member.status,
      avatar: member.avatar,
      projects: member.projects,
      order: member.order ?? 0,
    });
    setModalError("");
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMember(deleteTarget.id);
      setMembers((prev) => prev.filter((m) => m._id !== deleteTarget.id));
      showToast(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setCardLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await updateMemberStatus(id, status);
      setMembers((prev) => prev.map((m) => (m._id === id ? updated : m)));
      showToast(`Status updated to ${status}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCardLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setCurrentId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const activeCount = members.filter((m) => m.status === "Active").length;
  const onLeaveCount = members.filter((m) => m.status === "On Leave").length;
  const deptCount = new Set(members.map((m) => m.department)).size;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f8",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(16px,4vw,40px) clamp(12px,3vw,32px)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 28,
              animation: "fadeUp .5s ease both",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".18em",
                  color: "#6366f1",
                  textTransform: "uppercase",
                }}
              ></p>
              <h1
                style={{
                  margin: "0 0 12px",
                  fontSize: "clamp(24px,4vw,32px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "-0.5px",
                }}
              >
                Manage Your Team❤️
              </h1>
              {/* Stat pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <StatPill
                  icon="👥"
                  value={members.length}
                  label="Total Members"
                  accent="#6366f1"
                />
                <StatPill
                  icon={
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 0 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block",
                          animation: "pulse2 2s infinite",
                        }}
                      />
                    </span>
                  }
                  value={activeCount}
                  label="Active"
                  accent="#10b981"
                />
                <StatPill
                  icon="🏥"
                  value={deptCount}
                  label="Departments"
                  accent="#3b82f6"
                />
                {onLeaveCount > 0 && (
                  <StatPill
                    icon="☕"
                    value={onLeaveCount}
                    label="On Leave"
                    accent="#f59e0b"
                  />
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* View toggle */}
              <div
                style={{
                  display: "flex",
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 4,
                  gap: 2,
                }}
              >
                {[
                  ["grid", "⊞"],
                  ["list", "☰"],
                ].map(([mode, icon]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "all .2s",
                      background: viewMode === mode ? "#6366f1" : "transparent",
                      color: viewMode === mode ? "#fff" : "#94a3b8",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setIsEdit(false);
                  setForm(EMPTY_FORM);
                  setModalError("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#6366f1,#818cf8)",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px #6366f133",
                  transition: "opacity .2s, transform .2s",
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px #6366f144";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px #6366f133";
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: "rgba(255,255,255,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
                Add Member
              </button>
            </div>
          </div>

          {/* ── Filters ── */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 20,
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,.04)",
              animation: "fadeUp .5s .1s ease both",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative", flex: "1", minWidth: 200 }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3 3" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search name, role, email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "8px 12px 8px 30px",
                    fontSize: 13,
                    color: "#0f172a",
                    outline: "none",
                    transition: "border-color .2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              {/* Dept filters */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setFilter(dept)}
                    style={{
                      fontSize: 11,
                      padding: "5px 12px",
                      borderRadius: 20,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .2s",
                      background: filter === dept ? "#6366f1" : "transparent",
                      color: filter === dept ? "#fff" : "#64748b",
                      border: `1.5px solid ${filter === dept ? "#6366f1" : "#e2e8f0"}`,
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results count ── */}
          {!loading && (
            <p
              style={{
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: 500,
                marginBottom: 14,
                animation: "fadeIn .4s ease both",
              }}
            >
              Showing{" "}
              <strong style={{ color: "#64748b" }}>{filtered.length}</strong> of{" "}
              {members.length} members
              {search && (
                <>
                  {" "}
                  matching "
                  <strong style={{ color: "#6366f1" }}>{search}</strong>"
                </>
              )}
            </p>
          )}

          {/* ── Grid / List ── */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 14,
              }}
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                animation: "fadeUp .5s ease both",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                  fontSize: 28,
                }}
              >
                👤
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
                No members found
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#6366f1",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 14,
              }}
            >
              {filtered.map((member, i) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  paletteIndex={members.indexOf(member)}
                  onEdit={handleEdit}
                  onDelete={(id, name) => setDeleteTarget({ id, name })}
                  onStatusChange={handleStatusChange}
                  index={i}
                  loading={!!cardLoading[member._id]}
                />
              ))}
            </div>
          ) : (
            /* List view */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                animation: "fadeUp .4s ease both",
              }}
            >
              {filtered.map((member, i) => {
                const pal = getPalette(members.indexOf(member));
                const st = STATUS_META[member.status] || STATUS_META.Inactive;
                return (
                  <div
                    key={member._id}
                    className="card-hover"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      animation: `fadeUp .4s ease both`,
                      animationDelay: `${i * 40}ms`,
                      opacity: cardLoading[member._id] ? 0.7 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 40,
                        borderRadius: 4,
                        background: pal.bg,
                        flexShrink: 0,
                      }}
                    />
                    <Avatar
                      member={member}
                      paletteIndex={members.indexOf(member)}
                      size="sm"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {member.name}
                      </p>
                      <p
                        style={{
                          margin: "1px 0 0",
                          fontSize: 11,
                          color: "#94a3b8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {member.role}
                      </p>
                    </div>
                    <div style={{ display: "none" }} />
                    {/* spacer */}
                    <DeptBadge dept={member.department} />
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                        background: st.bg,
                        color: st.color,
                        border: `1px solid ${st.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.status}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        minWidth: 50,
                        textAlign: "right",
                      }}
                    >
                      {member.projects} proj.
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionBtn
                        onClick={() => handleEdit(member)}
                        hoverColor="#6366f1"
                        hoverBg="#eef2ff"
                        icon={
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path
                              d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z"
                              strokeLinejoin="round"
                            />
                          </svg>
                        }
                      >
                        Edit
                      </ActionBtn>
                      <ActionBtn
                        onClick={() =>
                          setDeleteTarget({ id: member._id, name: member.name })
                        }
                        hoverColor="#dc2626"
                        hoverBg="#fef2f2"
                        icon={
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path
                              d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.8 8.5H3.3l-.8-8.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        }
                      >
                        Delete
                      </ActionBtn>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        isEdit={isEdit}
        form={form}
        setForm={setForm}
        onConfirm={handleConfirm}
        onClose={closeModal}
        onAvatarChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
        saving={saving}
        error={modalError}
      />

      {deleteTarget && (
        <DeleteDialog
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
