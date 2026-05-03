import { useState, useRef, useEffect } from "react";

function getAPI(path) {
  try {
    const base =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
      (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
      "";
    return `${base}${path}`;
  } catch {
    return path;
  }
}
const LOC_API = () => getAPI("/api/locations");

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const ICONS = {
  pin: (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <ellipse cx="20" cy="45" rx="8" ry="3" fill="rgba(91,94,244,0.15)" />
      <circle cx="20" cy="18" r="16" fill="#5b5ef4" />
      <circle cx="20" cy="18" r="9" fill="white" fillOpacity=".15" />
      <circle cx="20" cy="18" r="5" fill="white" fillOpacity=".9" />
      <line
        x1="20"
        y1="34"
        x2="20"
        y2="43"
        stroke="#5b5ef4"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  building: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <rect
        x="8"
        y="10"
        width="32"
        height="34"
        rx="3"
        fill="#5b5ef4"
        opacity=".15"
      />
      <rect
        x="10"
        y="12"
        width="28"
        height="30"
        rx="2"
        fill="#5b5ef4"
        opacity=".25"
      />
      <rect x="14" y="16" width="6" height="6" rx="1" fill="#818cf8" />
      <rect x="28" y="16" width="6" height="6" rx="1" fill="#818cf8" />
      <rect x="14" y="26" width="6" height="6" rx="1" fill="#818cf8" />
      <rect x="28" y="26" width="6" height="6" rx="1" fill="#818cf8" />
      <rect x="19" y="34" width="10" height="8" rx="1" fill="#818cf8" />
      <rect
        x="18"
        y="6"
        width="12"
        height="8"
        rx="2"
        fill="#5b5ef4"
        opacity=".6"
      />
    </svg>
  ),
  office: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <rect
        x="6"
        y="14"
        width="36"
        height="26"
        rx="3"
        fill="#5b5ef4"
        opacity=".12"
      />
      <rect
        x="8"
        y="16"
        width="32"
        height="22"
        rx="2"
        fill="#5b5ef4"
        opacity=".2"
      />
      <rect x="13" y="21" width="5" height="5" rx="1" fill="#818cf8" />
      <rect x="22" y="21" width="5" height="5" rx="1" fill="#818cf8" />
      <rect x="30" y="21" width="5" height="5" rx="1" fill="#818cf8" />
      <rect x="13" y="30" width="5" height="5" rx="1" fill="#818cf8" />
      <rect x="22" y="30" width="5" height="5" rx="1" fill="#818cf8" />
      <rect x="30" y="30" width="5" height="5" rx="1" fill="#818cf8" />
      <rect
        x="12"
        y="10"
        width="24"
        height="8"
        rx="2"
        fill="#5b5ef4"
        opacity=".45"
      />
    </svg>
  ),
  lab: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        d="M18 8v16L9 36a5 5 0 004.5 7h21A5 5 0 0039 36L30 24V8"
        stroke="#5b5ef4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="15"
        y1="8"
        x2="33"
        y2="8"
        stroke="#5b5ef4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="34" r="2.5" fill="#818cf8" opacity=".8" />
      <circle cx="26" cy="38" r="1.5" fill="#818cf8" opacity=".6" />
      <circle cx="32" cy="34" r="2" fill="#818cf8" opacity=".7" />
    </svg>
  ),
};

const STATUS_STYLE = {
  Active: {
    bg: "#e8faf2",
    border: "#a7f3d0",
    text: "#059669",
    dot: "#10b981",
    chip: "#dcfce7",
  },
  Inactive: {
    bg: "#f1f5f9",
    border: "#cbd5e1",
    text: "#64748b",
    dot: "#94a3b8",
    chip: "#f1f5f9",
  },
  "Coming Soon": {
    bg: "#fef9ec",
    border: "#fde68a",
    text: "#d97706",
    dot: "#f59e0b",
    chip: "#fef3c7",
  },
};

const ICON_OPTIONS = ["pin", "building", "office", "lab"];
const STATUS_OPTIONS = ["Active", "Inactive", "Coming Soon"];
const EMPTY = {
  city: "",
  state: "",
  tagline: "",
  isHQ: false,
  status: "Active",
  icon: "pin",
  address: "",
  phone: "",
  email: "",
  image: null,
};

/* ─── Tiny inline SVG icon helper ───────────────────────────────── */
const Ic = ({ d, size = 16, sw = 1.7, style, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        border: "1px solid #f0f2f8",
        animation: `fadeUp .5s ease ${delay}ms both`,
        transition: "transform .2s ease, box-shadow .2s ease",
        cursor: "default",
      }}
      className="stat-card"
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: accent + "18",
          border: `1px solid ${accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1e1f3b",
            margin: 0,
            fontFamily: "'Sora',sans-serif",
            lineHeight: 1.1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#94a3b8",
            margin: "2px 0 0",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────── */
function Toast({ items }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 16,
        zIndex: 9999,
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
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            animation: "slideInRight .35s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          <Ic
            d={
              t.type === "err"
                ? ["M10 3l7 14H3L10 3z", "M10 9v4", "M10 15h.01"]
                : "M4 10l4 4 8-8"
            }
            size={14}
            sw={2}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────── */
function ConfirmModal({ open, name, onConfirm, onClose }) {
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
        background: "rgba(15,15,35,0.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f2f8",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
          boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={22}
            sw={1.8}
            color="#ef4444"
          />
        </div>
        <h3
          style={{
            color: "#1e1f3b",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 6,
            fontFamily: "'Sora',sans-serif",
          }}
        >
          Remove Location?
        </h3>
        <p
          style={{
            color: "#94a3b8",
            fontSize: 13,
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#374151" }}>{name}</strong> will be
          permanently removed.
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
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              cursor: "pointer",
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
              background: "#ef4444",
              border: "none",
              color: "white",
              cursor: "pointer",
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

/* ─── Drawer ─────────────────────────────────────────────────────── */
function Drawer({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();
  const isEdit = !!initial?._id;

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrs({});
      setImgPreview(initial?.image || null);
    }
  }, [open, initial]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      set("image")(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImgPreview(null);
    set("image")(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev?.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inp = (k) => ({
    width: "100%",
    borderRadius: 10,
    padding: "10px 13px",
    fontSize: 13,
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    background: "#f8fafc",
    border: `1.5px solid ${errs[k] ? "#fca5a5" : "#e2e8f0"}`,
    color: "#1e1f3b",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box",
  });

  const lbl = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 5,
    color: "#94a3b8",
  };

  const sectionBox = {
    borderRadius: 14,
    padding: 16,
    background: "#f8fafc",
    border: "1px solid #f0f2f8",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(15,15,35,0.4)",
          backdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .3s ease",
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          zIndex: 999,
          width: "min(480px,100vw)",
          background: "#ffffff",
          borderLeft: "1px solid #f0f2f8",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .38s cubic-bezier(.32,.72,0,1)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: "1px solid #f0f2f8",
            background: "#fff",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5b5ef4",
                marginBottom: 3,
              }}
            >
              {isEdit ? "Edit" : "New"} Location
            </p>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1e1f3b",
                fontFamily: "'Sora',sans-serif",
                margin: 0,
              }}
            >
              {isEdit ? `Editing ${initial?.city}` : "Add to India Map"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .2s",
            }}
          >
            <Ic d="M5 5l10 10M15 5L5 15" size={14} />
          </button>
        </div>

        {/* Form */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Image */}
          <div>
            <label style={lbl}>Location Photo</label>
            {imgPreview ? (
              <div
                style={{
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  height: 150,
                }}
              >
                <img
                  src={imgPreview}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(91,94,244,0.9)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Ic
                      d="M13 3l4 4-8 8H5v-4l8-8z"
                      size={10}
                      sw={2}
                      color="white"
                    />{" "}
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(239,68,68,0.9)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Ic
                      d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                      size={10}
                      sw={2}
                      color="white"
                    />{" "}
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  padding: "24px 0",
                  cursor: "pointer",
                  background: "#f8fafc",
                  border: "1.5px dashed #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  color: "#94a3b8",
                  transition: "border-color .2s",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#eff0fe",
                    border: "1px solid #c7d2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic
                    d={["M4 14l4-4 3 3 4-5 5 6H4z", "M3 3h14v14H3V3z"]}
                    size={20}
                    sw={1.5}
                    color="#5b5ef4"
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    Upload photo
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: 11,
                      margin: "2px 0 0",
                    }}
                  >
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImage}
            />
          </div>

          {/* Icon */}
          <div>
            <label style={lbl}>Icon Style</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 8,
              }}
            >
              {ICON_OPTIONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => set("icon")(ic)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    padding: "10px 6px",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all .2s",
                    background: form.icon === ic ? "#eff0fe" : "#f8fafc",
                    border: `1.5px solid ${form.icon === ic ? "#818cf8" : "#e2e8f0"}`,
                  }}
                >
                  <div style={{ width: 28, height: 28 }}>{ICONS[ic]}</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "capitalize",
                      color: form.icon === ic ? "#5b5ef4" : "#94a3b8",
                    }}
                  >
                    {ic}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div style={sectionBox}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#5b5ef4",
                marginBottom: 14,
              }}
            >
              Location Details
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div>
                <label style={lbl}>
                  City / Area <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  placeholder="e.g. Kolkata"
                  style={inp("city")}
                />
                {errs.city && (
                  <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
                    {errs.city}
                  </p>
                )}
              </div>
              <div>
                <label style={lbl}>
                  State <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  placeholder="e.g. West Bengal"
                  style={inp("state")}
                />
                {errs.state && (
                  <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
                    {errs.state}
                  </p>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={lbl}>Tagline</label>
              <input
                value={form.tagline}
                onChange={(e) => set("tagline")(e.target.value)}
                placeholder="e.g. Headquarters – Strategic Hub"
                style={inp()}
              />
            </div>
            <div>
              <label style={lbl}>Full Address</label>
              <input
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="123, Park Street, Kolkata"
                style={inp()}
              />
            </div>
          </div>

          {/* Contact */}
          <div style={sectionBox}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#5b5ef4",
                marginBottom: 14,
              }}
            >
              Contact (optional)
            </p>
            <div style={{ marginBottom: 10 }}>
              <label style={lbl}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+91 00000 00000"
                style={inp()}
              />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="kolkata@accelia.com"
                style={inp()}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={lbl}>Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {STATUS_OPTIONS.map((s) => {
                const sty = STATUS_STYLE[s];
                const active = form.status === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => set("status")(s)}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all .2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      background: active ? sty.bg : "#f8fafc",
                      border: `1.5px solid ${active ? sty.border : "#e2e8f0"}`,
                      color: active ? sty.text : "#94a3b8",
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sty.dot,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HQ toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 14,
              borderRadius: 14,
              background: "#f8fafc",
              border: "1px solid #f0f2f8",
            }}
          >
            <div>
              <p
                style={{
                  color: "#1e1f3b",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Mark as HQ
              </p>
              <p style={{ color: "#94a3b8", fontSize: 11, margin: "2px 0 0" }}>
                Highlights this as the headquarters
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("isHQ")(!form.isHQ)}
              style={{
                position: "relative",
                width: 44,
                height: 24,
                borderRadius: 12,
                flexShrink: 0,
                cursor: "pointer",
                background: form.isHQ ? "#5b5ef4" : "#e2e8f0",
                border: "none",
                transition: "background .3s",
                boxShadow: form.isHQ
                  ? "0 2px 8px rgba(91,94,244,0.35)"
                  : "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  left: form.isHQ ? "calc(100% - 21px)" : "3px",
                  transition: "left .3s cubic-bezier(.34,1.56,.64,1)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "16px 22px",
            borderTop: "1px solid #f0f2f8",
            background: "#fff",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: saving ? "#a5b4fc" : "#5b5ef4",
              color: "white",
              border: "none",
              boxShadow: saving ? "none" : "0 4px 16px rgba(91,94,244,0.35)",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {saving ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  style={{ animation: "spin .7s linear infinite" }}
                >
                  <path d="M10 2v4M10 14v4M4 10H2M18 10h-2M5.64 5.64l-1.41-1.41M15.78 15.78l-1.42-1.42" />
                </svg>
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Location"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Location Card ──────────────────────────────────────────────── */
function LocationCard({ loc, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const sty = STATUS_STYLE[loc.status] || STATUS_STYLE["Active"];
  const isHQ = loc.isHQ;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        border: isHQ
          ? "1.5px solid #818cf8"
          : hovered
            ? "1.5px solid #e0e2fc"
            : "1.5px solid #f0f2f8",
        boxShadow: hovered
          ? "0 8px 28px rgba(91,94,244,0.12), 0 2px 8px rgba(0,0,0,0.06)"
          : isHQ
            ? "0 4px 16px rgba(91,94,244,0.1)"
            : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all .25s ease",
        animation: "cardUp .45s ease both",
        animationDelay: `${index * 55}ms`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Image / icon area */}
      {loc.image ? (
        <div style={{ height: 90, overflow: "hidden", position: "relative" }}>
          <img
            src={loc.image}
            alt={loc.city}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform .35s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.3))",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isHQ
              ? "linear-gradient(135deg,#eff0fe,#e0e7ff)"
              : "linear-gradient(135deg,#f8fafc,#f1f5f9)",
            borderBottom: "1px solid #f0f2f8",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              opacity: 0.9,
              transform: hovered ? "scale(1.12)" : "scale(1)",
              transition: "transform .3s ease",
            }}
          >
            {ICONS[loc.icon] || ICONS.pin}
          </div>
        </div>
      )}

      {/* Badges row */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        {isHQ ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: 5,
              background: "#5b5ef4",
              color: "white",
            }}
          >
            HQ
          </span>
        ) : (
          <span />
        )}
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: sty.bg,
            border: `1px solid ${sty.border}`,
            color: sty.text,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: sty.dot,
            }}
          />
          {loc.status}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "10px 13px 13px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
        }}
      >
        <h3
          style={{
            color: "#1e1f3b",
            fontWeight: 700,
            fontSize: 13,
            margin: "0 0 2px",
            fontFamily: "'Sora',sans-serif",
            lineHeight: 1.3,
          }}
        >
          {loc.city}
        </h3>
        <p
          style={{
            color: "#94a3b8",
            fontSize: 11,
            margin: "0 0 11px",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {loc.tagline || loc.state || "No description"}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(loc)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "6px 0",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .2s",
              background: "#eff0fe",
              border: "1px solid #c7d2fe",
              color: "#5b5ef4",
            }}
          >
            <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} sw={2} /> Edit
          </button>
          <button
            onClick={() => onDelete(loc)}
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all .2s",
              flexShrink: 0,
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#ef4444",
            }}
          >
            <Ic
              d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
              size={12}
              sw={1.8}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function Locations() {
  const token = localStorage.getItem("token") || "";
  const [locs, setLocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStat, setFilterStat] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  const toast = (msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const fetchLocs = async () => {
    setLoading(true);
    try {
      const r = await fetch(LOC_API());
      const d = await r.json();
      setLocs(Array.isArray(d.locations) ? d.locations : []);
    } catch (e) {
      console.error("Locations fetch error:", e);
      toast("Failed to load locations", "err");
      setLocs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocs();
  }, []);

  const handleSave = async (payload) => {
    const isEdit = !!editTarget?._id;
    const url = isEdit ? `${LOC_API()}/${editTarget._id}` : LOC_API();
    const method = isEdit ? "PUT" : "POST";
    if (payload.isHQ && !isEdit)
      setLocs((l) => l.map((x) => ({ ...x, isHQ: false })));
    const r = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (!r.ok) {
      toast(d.message || "Save failed", "err");
      return;
    }
    toast(isEdit ? "Location updated ✓" : "Location added ✓");
    fetchLocs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const r = await fetch(`${LOC_API()}/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) {
        toast("Delete failed", "err");
        return;
      }
      toast(`${deleteTarget.city} removed`, "err");
      fetchLocs();
    } catch {
      toast("Delete failed", "err");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = locs.filter((l) => {
    const q = search.toLowerCase();
    const mQ =
      !q ||
      l.city?.toLowerCase().includes(q) ||
      l.state?.toLowerCase().includes(q) ||
      (l.tagline || "").toLowerCase().includes(q);
    const mS = filterStat === "All" || l.status === filterStat;
    return mQ && mS;
  });

  const counts = {
    total: locs.length,
    active: locs.filter((l) => l.status === "Active").length,
    soon: locs.filter((l) => l.status === "Coming Soon").length,
    inactive: locs.filter((l) => l.status === "Inactive").length,
  };

  const FILTER_TABS = ["All", "Active", "Coming Soon", "Inactive"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes cardUp       { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:none} }
        @keyframes popIn        { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:none} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes shimmer      { to{background-position:-200% 0} }
        @keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:.4} }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        input::placeholder        { color: #cbd5e1 !important; }
        input:focus               { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(91,94,244,0.12) !important; outline: none; }

        .filter-scroll  { overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; padding-bottom:2px; }
        .filter-scroll::-webkit-scrollbar { display:none; }

        .loc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(min-width:480px)  { .loc-grid { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:768px)  { .loc-grid { grid-template-columns:repeat(4,1fr); gap:14px; } }
        @media(min-width:1100px) { .loc-grid { grid-template-columns:repeat(5,1fr); } }

        .stat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:24px; }
        @media(min-width:600px) { .stat-grid { grid-template-columns:repeat(4,1fr); } }

        .skeleton  { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:16px; }

        .add-btn:hover  { background:#f5f5ff !important; border-color:#c7d2fe !important; color:#5b5ef4 !important; }
        .filter-tab:hover { border-color:#c7d2fe !important; color:#5b5ef4 !important; background:#f5f5ff !important; }
        .stat-card:hover { transform:translateY(-2px) !important; box-shadow:0 8px 24px rgba(0,0,0,0.1) !important; }

        @media(max-width:640px) {
          .page-title { font-size:24px !important; }
          .top-bar    { padding:12px 14px !important; }
          .page-pad   { padding:18px 14px 36px !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f8",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {/* ── Top Bar ── */}
        <div
          className="top-bar"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            background: "rgba(243,244,248,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #e8eaf4",
            animation: "fadeUp .4s ease both",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5b5ef4",
                marginBottom: 2,
              }}
            >
              Manage your offices and
            </p>
            <h1
              className="page-title"
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1e1f3b",
                margin: 0,
                fontFamily: "'Sora',sans-serif",
                lineHeight: 1.1,
              }}
            >
              Locations 📍
            </h1>
          </div>

          <button
            onClick={() => {
              setEditTarget(null);
              setDrawerOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              border: "none",
              background: "#5b5ef4",
              boxShadow: "0 4px 16px rgba(91,94,244,0.35)",
              transition: "all .2s",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1 }}>
              +
            </span>
            <span>Add Location</span>
          </button>
        </div>

        <div
          className="page-pad"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 24px 48px",
          }}
        >
          {/* ── Stat Cards ── */}
          <div className="stat-grid">
            <StatCard
              label="Total Locations"
              value={counts.total}
              delay={0}
              accent="#5b5ef4"
              icon={
                <Ic
                  d={["M9 4a5 5 0 100 10A5 5 0 009 4z", "M15 15l4 4"]}
                  size={20}
                  sw={1.6}
                  color="#5b5ef4"
                />
              }
            />
            <StatCard
              label="Active"
              value={counts.active}
              delay={60}
              accent="#10b981"
              icon={<Ic d="M4 10l4 4 8-8" size={20} sw={2} color="#10b981" />}
            />
            <StatCard
              label="Coming Soon"
              value={counts.soon}
              delay={120}
              accent="#f59e0b"
              icon={
                <Ic
                  d="M10 3v2M10 15v2M3 10H1M19 10h-2M5.64 5.64l-1.41-1.41M15.78 15.78l-1.42-1.42"
                  size={20}
                  sw={1.8}
                  color="#f59e0b"
                />
              }
            />
            <StatCard
              label="Inactive"
              value={counts.inactive}
              delay={180}
              accent="#64748b"
              icon={
                <Ic
                  d={["M10 10m-7 0a7 7 0 1014 0 7 7 0 00-14 0", "M7.5 7.5l5 5"]}
                  size={20}
                  sw={1.6}
                  color="#64748b"
                />
              }
            />
          </div>

          {/* ── Filter & Search Row ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 16,
              animation: "fadeUp .4s ease .1s both",
            }}
          >
            <div className="filter-scroll" style={{ display: "flex", gap: 8 }}>
              {FILTER_TABS.map((s) => {
                const active = filterStat === s;
                return (
                  <button
                    key={s}
                    className="filter-tab"
                    onClick={() => setFilterStat(s)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 18px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all .2s",
                      background: active ? "#5b5ef4" : "#ffffff",
                      border: `1.5px solid ${active ? "#5b5ef4" : "#e2e8f0"}`,
                      color: active ? "#ffffff" : "#64748b",
                      boxShadow: active
                        ? "0 2px 8px rgba(91,94,244,0.25)"
                        : "none",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div style={{ position: "relative", maxWidth: 320 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  display: "flex",
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
                placeholder="Search locations…"
                style={{
                  width: "100%",
                  paddingLeft: 34,
                  paddingRight: 12,
                  paddingTop: 9,
                  paddingBottom: 9,
                  borderRadius: 10,
                  fontSize: 13,
                  outline: "none",
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  color: "#1e1f3b",
                  fontFamily: "'DM Sans',sans-serif",
                  boxSizing: "border-box",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "border-color .2s, box-shadow .2s",
                }}
              />
            </div>
          </div>

          {/* ── Result count ── */}
          <p
            style={{
              fontSize: 12,
              color: "#94a3b8",
              marginBottom: 14,
              fontWeight: 500,
              animation: "fadeIn .4s ease .15s both",
            }}
          >
            Showing{" "}
            <strong style={{ color: "#374151" }}>{filtered.length}</strong> of{" "}
            <strong style={{ color: "#374151" }}>{locs.length}</strong>{" "}
            locations
          </p>

          {/* ── Grid ── */}
          {loading ? (
            <div className="loc-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton" style={{ height: 175 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                animation: "fadeUp .4s ease both",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  marginBottom: 14,
                  opacity: 0.25,
                }}
              >
                {ICONS.pin}
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                No locations match your search
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStat("All");
                }}
                style={{
                  color: "#5b5ef4",
                  fontSize: 12,
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="loc-grid">
              {filtered.map((loc, i) => (
                <LocationCard
                  key={loc._id}
                  loc={loc}
                  index={i}
                  onEdit={(l) => {
                    setEditTarget(l);
                    setDrawerOpen(true);
                  }}
                  onDelete={(l) => setDeleteTarget(l)}
                />
              ))}

              {/* Add placeholder card */}
              <button
                className="add-btn"
                onClick={() => {
                  setEditTarget(null);
                  setDrawerOpen(true);
                }}
                style={{
                  minHeight: 175,
                  borderRadius: 16,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "#ffffff",
                  border: "1.5px dashed #e2e8f0",
                  color: "#94a3b8",
                  transition: "all .25s",
                  animation: "cardUp .45s ease both",
                  animationDelay: `${filtered.length * 55}ms`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    border: "1.5px dashed currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: 11, fontWeight: 700 }}>
                  Add Location
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
      <ConfirmModal
        open={!!deleteTarget}
        name={deleteTarget?.city}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <Toast items={toasts} />
    </>
  );
}
