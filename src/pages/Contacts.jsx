import { useState, useRef, useEffect, useCallback } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/contacts`;
const getToken = () => localStorage.getItem("token") || "";
const apiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ─── Inline SVG helper ──────────────────────────────────────────── */
const Ic = ({ d, size = 16, sw = 1.6, style: s, className: c, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={s}
    className={c}
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/* ─── Status config ──────────────────────────────────────────────── */
const STATUS = {
  new: {
    bg: "#eff9fe",
    border: "#bae6fd",
    text: "#0284c7",
    dot: "#0ea5e9",
    label: "New",
  },
  read: {
    bg: "#f8fafc",
    border: "#e2e8f0",
    text: "#64748b",
    dot: "#94a3b8",
    label: "Read",
  },
  replied: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#16a34a",
    dot: "#22c55e",
    label: "Replied",
  },
  archived: {
    bg: "#f8fafc",
    border: "#e2e8f0",
    text: "#94a3b8",
    dot: "#cbd5e1",
    label: "Archived",
  },
};
const getSty = (s = "new") => STATUS[s.toLowerCase()] || STATUS.read;

/* ─── Format time ────────────────────────────────────────────────── */
const fmt = (iso) => {
  if (!iso) return "";
  const d = new Date(iso),
    now = new Date(),
    diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ─── Toast ──────────────────────────────────────────────────────── */
function Toast({ items }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 16,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
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
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            background: t.type === "err" ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${t.type === "err" ? "#fca5a5" : "#86efac"}`,
            color: t.type === "err" ? "#dc2626" : "#16a34a",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
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
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = getSty(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name, size = 38 }) {
  const palette = [
    "#5b5ef4",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#f43f5e",
    "#a78bfa",
  ];
  const color = palette[name?.charCodeAt(0) % palette.length] || "#5b5ef4";
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg, ${color}30, ${color}15)`,
        border: `1.5px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color,
        fontFamily: "'Sora',sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Detail Drawer ──────────────────────────────────────────────── */
function DetailDrawer({
  contact,
  open,
  onClose,
  onStatusChange,
  onNoteChange,
  onDelete,
}) {
  const [note, setNote] = useState("");
  const [noteEdit, setNoteEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    if (contact) {
      setNote(contact.notes || "");
      setNoteEdit(false);
    }
  }, [contact]);

  if (!contact) return null;

  const saveNote = async () => {
    setSaving(true);
    await onNoteChange(contact._id, note);
    setSaving(false);
    setNoteEdit(false);
  };

  const sty = getSty(contact.status);

  const inpStyle = {
    width: "100%",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    padding: "10px 14px",
    fontSize: 13,
    color: "#1e1f3b",
    background: "#f8fafc",
    outline: "none",
    resize: "vertical",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(15,15,35,0.45)",
          backdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "min(560px, 100vw)",
          background: "#ffffff",
          borderLeft: "1px solid #f0f2f8",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.36s cubic-bezier(0.32,0.72,0,1)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 0",
            borderBottom: "1px solid #f0f2f8",
            background: sty.bg,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <Avatar name={contact.name} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                <StatusBadge status={contact.status} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  {fmt(contact.createdAt)}
                </span>
              </div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#1e1f3b",
                  margin: 0,
                  lineHeight: 1.3,
                  fontFamily: "'Sora',sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contact.name}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  margin: "3px 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contact.email}
                {contact.company ? ` · ${contact.company}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(255,255,255,0.8)",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#94a3b8",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1e1f3b";
                e.currentTarget.style.background = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
              }}
            >
              <Ic d="M5 5l10 10M15 5L5 15" size={13} />
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "rgba(0,0,0,0.04)",
              borderRadius: 10,
              padding: 3,
              marginBottom: 0,
            }}
          >
            {["details", "message", "actions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                  background: activeSection === tab ? "#ffffff" : "transparent",
                  color: activeSection === tab ? sty.text : "#94a3b8",
                  boxShadow:
                    activeSection === tab
                      ? "0 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            scrollbarWidth: "none",
          }}
        >
          {/* Details */}
          {activeSection === "details" && (
            <div style={{ animation: "slideIn 0.25s ease both" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "Email",
                    value: contact.email,
                    icon: ["M2 4h16v12H2z", "M2 4l8 7 8-7"],
                  },
                  {
                    label: "Phone",
                    value: contact.phone || "—",
                    icon: "M4 2h4l1.5 4L7 7.5a11 11 0 005.5 5.5L15 11l4 1.5V16a2 2 0 01-2 2C6 18 2 10 2 4a2 2 0 012-2z",
                  },
                  {
                    label: "Company",
                    value: contact.company || "—",
                    icon: ["M2 12l8-8 8 8", "M4 10v8h5v-5h2v5h5v-8"],
                  },
                  {
                    label: "Country",
                    value: contact.country || "—",
                    icon: "M10 2a8 8 0 100 16A8 8 0 0010 2z",
                  },
                  {
                    label: "Service",
                    value: contact.service || "—",
                    icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2",
                  },
                ].map((f, i) => (
                  <div
                    key={f.label}
                    style={{
                      borderRadius: 12,
                      padding: "12px 14px",
                      background: "#f8fafc",
                      border: "1px solid #f0f2f8",
                      animation: "slideIn 0.3s ease both",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Ic d={f.icon} size={11} color="#94a3b8" />
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#94a3b8",
                        }}
                      >
                        {f.label}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#1e1f3b",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0,
                      }}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          {activeSection === "message" && (
            <div style={{ animation: "slideIn 0.25s ease both" }}>
              <div
                style={{
                  borderRadius: 14,
                  padding: "18px 20px",
                  background: "#f8fafc",
                  border: "1px solid #f0f2f8",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ height: 1, flex: 1, background: sty.border }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: sty.text,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Message
                  </span>
                  <div style={{ height: 1, flex: 1, background: sty.border }} />
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {contact.message}
                </p>
              </div>

              {/* Admin note */}
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#5b5ef4",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Admin Note
                  </span>
                  {!noteEdit && (
                    <button
                      onClick={() => setNoteEdit(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "#94a3b8",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#5b5ef4")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#94a3b8")
                      }
                    >
                      <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} /> Edit
                    </button>
                  )}
                </div>
                {noteEdit ? (
                  <div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Add an internal note…"
                      style={inpStyle}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => {
                          setNote(contact.notes || "");
                          setNoteEdit(false);
                        }}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#94a3b8",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveNote}
                        disabled={saving}
                        style={{
                          padding: "7px 18px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "white",
                          background: "#5b5ef4",
                          border: "none",
                          cursor: saving ? "not-allowed" : "pointer",
                          opacity: saving ? 0.7 : 1,
                          fontFamily: "inherit",
                          boxShadow: "0 4px 12px rgba(91,94,244,0.25)",
                        }}
                      >
                        {saving ? "Saving…" : "Save Note"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      borderRadius: 10,
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #f0f2f8",
                      minHeight: 48,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      {contact.notes || "No note added yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {activeSection === "actions" && (
            <div style={{ animation: "slideIn 0.25s ease both" }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#5b5ef4",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Update Status
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {["new", "read", "replied", "archived"].map((s) => {
                  const st = STATUS[s];
                  const isActive = contact.status.toLowerCase() === s;
                  return (
                    <button
                      key={s}
                      onClick={() => onStatusChange(contact._id, s)}
                      style={{
                        padding: "10px 0",
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        border: `1.5px solid ${isActive ? st.border : "#e2e8f0"}`,
                        background: isActive ? st.bg : "#f8fafc",
                        color: isActive ? st.text : "#94a3b8",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {isActive && (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: st.dot,
                          }}
                        />
                      )}
                      {st.label}
                    </button>
                  );
                })}
              </div>

              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#5b5ef4",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Quick Actions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a
                  href={`mailto:${contact.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 16px",
                    borderRadius: 12,
                    background: "#eff0fe",
                    border: "1px solid #c7d2fe",
                    color: "#5b5ef4",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(4px)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  <Ic d={["M2 4h16v12H2z", "M2 4l8 7 8-7"]} size={16} />
                  Reply via Email
                  <span
                    style={{ marginLeft: "auto", fontSize: 11, opacity: 0.5 }}
                  >
                    →
                  </span>
                </a>
                <button
                  onClick={() => onDelete(contact._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 16px",
                    borderRadius: 12,
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    color: "#ef4444",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fef2f2")
                  }
                >
                  <Ic
                    d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                    size={16}
                  />
                  Delete Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #f0f2f8",
            display: "flex",
            gap: 10,
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <a
            href={`mailto:${contact.email}`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              background: "#5b5ef4",
              boxShadow: "0 4px 14px rgba(91,94,244,0.3)",
            }}
          >
            <Ic d={["M2 4h16v12H2z", "M2 4l8 7 8-7"]} size={14} color="white" />
            Reply via Email
          </a>
          <button
            onClick={() => onDelete(contact._id)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#ef4444",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
          >
            <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Confirm Delete ─────────────────────────────────────────────── */
function ConfirmModal({ open, count, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(15,15,35,0.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          borderRadius: 20,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          background: "#fff",
          border: "1px solid #fca5a5",
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#ef4444",
          }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={22}
            sw={1.8}
          />
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#1e1f3b",
            margin: "0 0 8px",
            fontFamily: "'Sora',sans-serif",
          }}
        >
          Delete {count > 1 ? `${count} Messages` : "Message"}?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "#94a3b8",
            lineHeight: 1.6,
            margin: "0 0 24px",
          }}
        >
          This action is permanent and cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              background: "#ef4444",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Message Card ───────────────────────────────────────────────── */
function MessageCard({ msg, isSelected, onSelect, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const isNew = msg.status.toLowerCase() === "new";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        padding: "14px 16px",
        background: isSelected ? "#f5f5ff" : hovered ? "#fafbff" : "#ffffff",
        border: `1.5px solid ${isSelected ? "#c7d2fe" : hovered ? "#e0e2fc" : "#f0f2f8"}`,
        cursor: "pointer",
        transition: "all 0.2s",
        animation: "cardIn 0.4s ease both",
        animationDelay: `${index * 50}ms`,
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 4px 16px rgba(91,94,244,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {isNew && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: 3,
            background: "#5b5ef4",
            borderRadius: "0 3px 3px 0",
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            border: `2px solid ${isSelected ? "#5b5ef4" : "#e2e8f0"}`,
            background: isSelected ? "#eff0fe" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
            transition: "all 0.15s",
            cursor: "pointer",
          }}
        >
          {isSelected && (
            <Ic d="M4 10l4 4 8-8" size={10} sw={2.5} color="#5b5ef4" />
          )}
        </div>

        <Avatar name={msg.name} size={38} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: isNew ? 700 : 500,
                color: isNew ? "#1e1f3b" : "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {msg.name}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#cbd5e1",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {fmt(msg.createdAt)}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "#94a3b8",
              margin: "0 0 6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {msg.email}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#64748b",
              margin: "0 0 8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontStyle: "italic",
            }}
          >
            "{msg.message?.slice(0, 60)}
            {msg.message?.length > 60 ? "…" : ""}"
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge status={msg.status} />
            {msg.company && (
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {msg.company}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [active, setActive] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState("cards");
  const [searchFocus, setSearchFocus] = useState(false);
  const tid = useRef(0);

  const toast = (msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setFetchErr("");
    try {
      const res = await fetch(`${API}?limit=200`, { headers: apiHeaders() });
      if (res.status === 401) {
        setFetchErr("Unauthorised — please log in again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load contacts");
      const data = await res.json();
      setMessages(data.contacts || data);
    } catch (err) {
      setFetchErr(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const mQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.company || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    const mF =
      filter === "All" || m.status.toLowerCase() === filter.toLowerCase();
    return mQ && mF;
  });

  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status.toLowerCase() === "new").length,
    replied: messages.filter((m) => m.status.toLowerCase() === "replied")
      .length,
    archived: messages.filter((m) => m.status.toLowerCase() === "archived")
      .length,
  };

  const openDetail = async (msg) => {
    let updated = msg;
    if (msg.status.toLowerCase() === "new") {
      try {
        const res = await fetch(`${API}/${msg._id}`, {
          method: "PUT",
          headers: apiHeaders(),
          body: JSON.stringify({ status: "read" }),
        });
        if (res.ok) {
          const saved = await res.json();
          updated = saved;
          setMessages((prev) =>
            prev.map((m) => (m._id === msg._id ? saved : m)),
          );
        }
      } catch (_) {}
    }
    setActive(updated);
    setDrawerOpen(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const saved = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === id ? saved : m)));
      setActive((prev) => (prev?._id === id ? saved : prev));
      toast(`Marked as ${STATUS[status]?.label || status}`);
    } catch (err) {
      toast(err.message, "err");
    }
  };

  const handleNoteChange = async (id, notes) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: apiHeaders(),
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Note save failed");
      const saved = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === id ? saved : m)));
      setActive((prev) => (prev?._id === id ? saved : prev));
      toast("Note saved");
    } catch (err) {
      toast(err.message, "err");
    }
  };

  const triggerDelete = (ids) => {
    setDeletingIds(ids);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const ids = [...deletingIds];
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API}/${id}`, { method: "DELETE", headers: apiHeaders() }),
        ),
      );
      setMessages((prev) => prev.filter((m) => !ids.includes(m._id)));
      if (active && ids.includes(active._id)) {
        setDrawerOpen(false);
        setActive(null);
      }
      setSelected([]);
      toast(`${ids.length} message${ids.length > 1 ? "s" : ""} deleted`, "err");
    } catch (err) {
      toast("Delete failed: " + err.message, "err");
    } finally {
      setConfirmOpen(false);
      setDeletingIds([]);
    }
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((m) => m._id),
    );

  const STAT_CARDS = [
    {
      label: "Total",
      value: stats.total,
      color: "#5b5ef4",
      icon: ["M2 4h16v12H2z", "M2 4l8 7 8-7"],
    },
    {
      label: "New",
      value: stats.new,
      color: "#0ea5e9",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2",
    },
    {
      label: "Replied",
      value: stats.replied,
      color: "#10b981",
      icon: "M4 10l4 4 8-8",
    },
    {
      label: "Archived",
      value: stats.archived,
      color: "#94a3b8",
      icon: [
        "M5 3h10a2 2 0 012 2v1H3V5a2 2 0 012-2z",
        "M3 6h14v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z",
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::placeholder { color: #cbd5e1; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(12px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        input:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(91,94,244,0.1) !important; outline: none; }
        @media(max-width:640px) {
          .stat-grid      { grid-template-columns: repeat(2,1fr) !important; }
          .toolbar-row    { flex-direction: column !important; }
          .filter-pills   { flex-wrap: wrap !important; }
          .table-head     { display: none !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f8",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(243,244,248,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #e8eaf4",
            animation: "slideUp 0.4s ease both",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#5b5ef4",
                margin: 0,
              }}
            >
              Manage Your All
            </p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#1e1f3b",
                margin: 0,
                fontFamily: "'Sora',sans-serif",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
              }}
            >
              Contact Inbox 💬
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* View toggle */}
            <div
              style={{
                display: "flex",
                background: "#ffffff",
                borderRadius: 9,
                padding: 3,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {[
                ["cards", "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z"],
                ["table", "M3 5h14M3 10h14M3 15h14"],
              ].map(([mode, d]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    width: 30,
                    height: 28,
                    borderRadius: 7,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    background: viewMode === mode ? "#eff0fe" : "transparent",
                    color: viewMode === mode ? "#5b5ef4" : "#94a3b8",
                  }}
                >
                  <Ic d={d} size={13} />
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchContacts}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#94a3b8",
                transition: "color 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5b5ef4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <Ic
                d="M4 4a8 8 0 0112 0M16 16a8 8 0 01-12 0M18 10h-4M6 10H2"
                size={14}
              />
            </button>

            {stats.new > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: "#eff9fe",
                  border: "1px solid #bae6fd",
                  animation: "slideUp 0.4s ease 0.1s both",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#0ea5e9",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#0284c7" }}
                >
                  {stats.new} new
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>
          {/* Error banner */}
          {fetchErr && (
            <div
              style={{
                marginBottom: 20,
                padding: "14px 18px",
                borderRadius: 14,
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                color: "#dc2626",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ic
                d={["M10 3l7 14H3L10 3z", "M10 8v4", "M10 14h.01"]}
                size={16}
              />
              {fetchErr}
              <button
                onClick={fetchContacts}
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  color: "#dc2626",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "100px 0",
                gap: 16,
                color: "#94a3b8",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#5b5ef4",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: 13, margin: 0 }}>Loading contacts…</p>
            </div>
          ) : (
            <>
              {/* ── Stat Cards ── */}
              <div
                className="stat-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {STAT_CARDS.map((s, i) => (
                  <div
                    key={s.label}
                    style={{
                      borderRadius: 14,
                      padding: "16px 18px",
                      background: "#ffffff",
                      border: "1px solid #f0f2f8",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      animation: "slideUp 0.5s ease both",
                      animationDelay: `${i * 60}ms`,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow =
                        "0 1px 4px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}28`,
                        color: s.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Ic d={s.icon} size={18} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: s.color,
                          fontFamily: "'Sora',sans-serif",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}
                      >
                        {s.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Toolbar ── */}
              <div
                className="toolbar-row"
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 16,
                  animation: "slideUp 0.5s ease 0.15s both",
                }}
              >
                {/* Search */}
                <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#cbd5e1",
                    }}
                  >
                    <Ic
                      d={["M9 4a5 5 0 100 10A5 5 0 009 4z", "M15 15l4 4"]}
                      size={14}
                    />
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setSearchFocus(false)}
                    placeholder="Search name, email, company…"
                    style={{
                      width: "100%",
                      paddingLeft: 36,
                      paddingRight: 12,
                      paddingTop: 9,
                      paddingBottom: 9,
                      borderRadius: 10,
                      border: `1.5px solid ${searchFocus ? "#818cf8" : "#e2e8f0"}`,
                      background: "#ffffff",
                      color: "#1e1f3b",
                      fontSize: 13,
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: searchFocus
                        ? "0 0 0 3px rgba(91,94,244,0.1)"
                        : "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>

                {/* Filter pills */}
                <div
                  className="filter-pills"
                  style={{ display: "flex", gap: 6 }}
                >
                  {["All", "New", "Read", "Replied", "Archived"].map((tab) => {
                    const st = STATUS[tab.toLowerCase()];
                    const isActive = filter === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          border: `1.5px solid ${isActive ? st?.border || "#c7d2fe" : "#e2e8f0"}`,
                          background: isActive
                            ? st?.bg || "#eff0fe"
                            : "#ffffff",
                          color: isActive ? st?.text || "#5b5ef4" : "#94a3b8",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.18s",
                          whiteSpace: "nowrap",
                          boxShadow: isActive
                            ? "0 2px 8px rgba(0,0,0,0.06)"
                            : "none",
                        }}
                      >
                        {tab}
                        {tab !== "All" && (
                          <span
                            style={{
                              marginLeft: 5,
                              fontSize: 10,
                              opacity: 0.65,
                            }}
                          >
                            {
                              messages.filter(
                                (m) =>
                                  m.status.toLowerCase() === tab.toLowerCase(),
                              ).length
                            }
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bulk delete */}
                {selected.length > 0 && (
                  <button
                    onClick={() => triggerDelete(selected)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 16px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fca5a5",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      animation: "slideUp 0.2s ease both",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Ic
                      d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                      size={13}
                    />
                    Delete {selected.length}
                  </button>
                )}
              </div>

              {/* Count row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  <span style={{ color: "#1e1f3b", fontWeight: 600 }}>
                    {filtered.length}
                  </span>{" "}
                  messages
                </p>
                {(search || filter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("All");
                    }}
                    style={{
                      fontSize: 11,
                      color: "#5b5ef4",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "inherit",
                    }}
                  >
                    <Ic d="M5 5l10 10M15 5L5 15" size={11} /> Clear
                  </button>
                )}
              </div>

              {/* ── Content ── */}
              {filtered.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "72px 20px",
                    background: "#ffffff",
                    border: "1.5px dashed #e2e8f0",
                    borderRadius: 16,
                    textAlign: "center",
                    animation: "slideUp 0.4s ease both",
                  }}
                >
                  <Ic
                    d={["M2 4h16v12H2z", "M2 4l8 7 8-7"]}
                    size={40}
                    style={{ color: "#e2e8f0", marginBottom: 12 }}
                  />
                  <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                    No messages match your filters
                  </p>
                </div>
              ) : viewMode === "cards" ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {filtered.map((msg, i) => (
                    <MessageCard
                      key={msg._id}
                      msg={msg}
                      index={i}
                      isSelected={selected.includes(msg._id)}
                      onSelect={() => toggleSelect(msg._id)}
                      onClick={() => openDetail(msg)}
                    />
                  ))}
                </div>
              ) : (
                /* Table view */
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid #f0f2f8",
                    background: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="table-head"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2rem 2fr 1.5fr 1fr 1fr 6rem",
                      alignItems: "center",
                      padding: "12px 18px",
                      borderBottom: "1px solid #f0f2f8",
                      background: "#f8fafc",
                    }}
                  >
                    <button
                      onClick={toggleAll}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        border: `2px solid ${selected.length === filtered.length && filtered.length > 0 ? "#5b5ef4" : "#e2e8f0"}`,
                        background:
                          selected.length === filtered.length &&
                          filtered.length > 0
                            ? "#eff0fe"
                            : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {selected.length === filtered.length &&
                        filtered.length > 0 && (
                          <Ic
                            d="M4 10l4 4 8-8"
                            size={10}
                            sw={2.5}
                            color="#5b5ef4"
                          />
                        )}
                    </button>
                    {["Sender", "Company", "Country", "Status", "Time"].map(
                      (h) => (
                        <p
                          key={h}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#94a3b8",
                            margin: 0,
                          }}
                        >
                          {h}
                        </p>
                      ),
                    )}
                  </div>

                  {filtered.map((msg, i) => {
                    const isNew = msg.status.toLowerCase() === "new";
                    const isSel = selected.includes(msg._id);
                    return (
                      <div
                        key={msg._id}
                        onClick={() => openDetail(msg)}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2rem 2fr 1.5fr 1fr 1fr 6rem",
                          alignItems: "center",
                          padding: "13px 18px",
                          borderBottom: "1px solid #f8fafc",
                          background: isSel ? "#f5f5ff" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          animation: "cardIn 0.35s ease both",
                          animationDelay: `${i * 35}ms`,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fafbff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = isSel
                            ? "#f5f5ff"
                            : "transparent")
                        }
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(msg._id);
                          }}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            border: `2px solid ${isSel ? "#5b5ef4" : "#e2e8f0"}`,
                            background: isSel ? "#eff0fe" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          {isSel && (
                            <Ic
                              d="M4 10l4 4 8-8"
                              size={10}
                              sw={2.5}
                              color="#5b5ef4"
                            />
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            minWidth: 0,
                          }}
                        >
                          <Avatar name={msg.name} size={30} />
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: isNew ? 700 : 500,
                                color: "#1e1f3b",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {msg.name}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#94a3b8",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {msg.email}
                            </p>
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {msg.company || "—"}
                        </p>
                        <p
                          style={{ fontSize: 12, color: "#64748b", margin: 0 }}
                        >
                          {msg.country || "—"}
                        </p>
                        <StatusBadge status={msg.status} />
                        <p
                          style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}
                        >
                          {fmt(msg.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DetailDrawer
        contact={active}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
        onDelete={(id) => {
          triggerDelete([id]);
          setDrawerOpen(false);
        }}
      />
      <ConfirmModal
        open={confirmOpen}
        count={deletingIds.length}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <Toast items={toasts} />
    </>
  );
}
