import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://accelia-backend.onrender.com/api/solutions";
const getToken = () => localStorage.getItem("token");

/* ─── FONTS ── */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');`;

const T = {
  bg: "#070d1a",
  bg2: "#0c1525",
  bg3: "#111d30",
  bg4: "#162038",
  accent: "#4f9cf9",
  accent2: "#7c6af7",
  green: "#22d3a0",
  amber: "#f59e0b",
  rose: "#f43f5e",
  text1: "#e8edf5",
  text2: "#6b7fa3",
  text3: "#3a4a66",
  border: "rgba(79,156,249,0.10)",
  border2: "rgba(79,156,249,0.20)",
};

const STATUS_META = {
  Active: {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.10)",
    border: "rgba(34,211,160,0.25)",
  },
  Inactive: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
  },
};

const IMG_SEEDS = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=600&auto=format&fit=crop&q=80",
];

const EMPTY_FORM = {
  title: "",
  icon: "🔬",
  desc: "",
  imageUrl: "",
  order: 0,
  isActive: true,
};

/* ── Small components ── */
function StatusBadge({ active }) {
  const m = active ? STATUS_META.Active : STATUS_META.Inactive;
  const label = active ? "Active" : "Inactive";
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 9px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.color,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}

function StatChip({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 10,
          color: T.text3,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.text1,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 11.5,
          fontWeight: 500,
          color: T.text2,
          marginBottom: 6,
          letterSpacing: "0.04em",
        }}
      >
        {label}
        {required && <span style={{ color: T.rose, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  background: T.bg,
  border: `1px solid ${T.border2}`,
  borderRadius: 8,
  color: T.text1,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

/* ── Modal ── */
function SolutionModal({ open, onClose, onSave, editData, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    if (open) {
      if (editData) {
        setForm({
          title: editData.title || "",
          icon: editData.icon || "🔬",
          desc: editData.desc || "",
          imageUrl: editData.imageUrl || "",
          order: editData.order ?? 0,
          isActive: editData.isActive ?? true,
        });
        setImgPreview(editData.imageUrl || "");
      } else {
        setForm(EMPTY_FORM);
        setImgPreview("");
      }
      setErrors({});
    }
  }, [open, editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      set("imageUrl", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.desc.trim()) e.desc = "Description is required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({ ...form, imageUrl: imgPreview || form.imageUrl || IMG_SEEDS[0] });
  };

  const focusBorder = (name) => (focusedField === name ? T.accent : T.border2);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 16,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: T.text1,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {editData ? "Edit Solution" : "Add Solution"}
                </div>
                <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>
                  {editData
                    ? "Update solution details"
                    : "Create a new solution for the frontend"}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: T.text2,
                  padding: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 14, height: 14 }}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                flex: 1,
                scrollbarWidth: "none",
              }}
            >
              {/* Image upload */}
              <Field label="Cover Image (URL or Upload)">
                <input
                  value={form.imageUrl}
                  onChange={(e) => {
                    set("imageUrl", e.target.value);
                    setImgPreview(e.target.value);
                  }}
                  placeholder="https://... or upload below"
                  style={{ ...inputStyle, marginBottom: 8 }}
                />
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    height: 110,
                    borderRadius: 10,
                    border: `1.5px dashed ${T.border2}`,
                    background: T.bg3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = T.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = T.border2)
                  }
                >
                  {imgPreview ? (
                    <img
                      src={imgPreview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={() => setImgPreview("")}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={T.text3}
                        strokeWidth="1.5"
                        style={{ width: 24, height: 24 }}
                      >
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div style={{ fontSize: 11, color: T.text3 }}>
                        Click to upload
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
                {/* Quick picks */}
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  {IMG_SEEDS.slice(0, 4).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      onClick={() => {
                        setImgPreview(src);
                        set("imageUrl", src);
                      }}
                      style={{
                        width: 44,
                        height: 32,
                        objectFit: "cover",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: `2px solid ${imgPreview === src ? T.accent : "transparent"}`,
                        transition: "border-color 0.15s",
                      }}
                    />
                  ))}
                  <div
                    style={{
                      fontSize: 10.5,
                      color: T.text3,
                      alignSelf: "center",
                    }}
                  >
                    Quick picks
                  </div>
                </div>
              </Field>

              {/* Title */}
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Clinical Data Management"
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? T.rose : focusBorder("title"),
                  }}
                />
                {errors.title && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4 }}>
                    {errors.title}
                  </div>
                )}
              </Field>

              {/* Icon + Order row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: T.text2,
                      marginBottom: 6,
                    }}
                  >
                    Icon (emoji)
                  </label>
                  <input
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    placeholder="🔬"
                    style={{ ...inputStyle, fontSize: 20, textAlign: "center" }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: T.text2,
                      marginBottom: 6,
                    }}
                  >
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) =>
                      set("order", parseInt(e.target.value) || 0)
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Description */}
              <Field label="Description" required>
                <textarea
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  onFocus={() => setFocusedField("desc")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Describe what this solution provides…"
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    borderColor: errors.desc ? T.rose : focusBorder("desc"),
                  }}
                />
                {errors.desc && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4 }}>
                    {errors.desc}
                  </div>
                )}
              </Field>

              {/* Active toggle */}
              <Field label="Visibility">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => set("isActive", !form.isActive)}
                    style={{
                      width: 46,
                      height: 26,
                      borderRadius: 13,
                      border: "none",
                      cursor: "pointer",
                      background: form.isActive
                        ? T.green
                        : "rgba(255,255,255,0.1)",
                      position: "relative",
                      transition: "background 0.25s",
                      flexShrink: 0,
                      boxShadow: form.isActive
                        ? `0 0 10px ${T.green}55`
                        : "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3,
                        left: form.isActive ? 23 : 3,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.22s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                      }}
                    />
                  </button>
                  <span
                    style={{
                      fontSize: 13,
                      color: form.isActive ? T.green : T.text2,
                    }}
                  >
                    {form.isActive
                      ? "Visible on frontend"
                      : "Hidden from frontend"}
                  </span>
                </div>
              </Field>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border2}`,
                  color: T.text2,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "9px 24px",
                  borderRadius: 8,
                  background: saving
                    ? T.bg3
                    : `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border: "none",
                  color: saving ? T.text2 : "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {saving
                  ? "Saving…"
                  : editData
                    ? "Save Changes"
                    : "Create Solution"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Delete Confirm ── */
function DeleteConfirm({ open, onClose, onConfirm, title }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            style={{
              background: T.bg2,
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: 14,
              padding: "28px 28px 22px",
              width: 340,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(244,63,94,0.12)",
                border: "1px solid rgba(244,63,94,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.rose}
                strokeWidth="2"
                style={{ width: 20, height: 20 }}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                marginBottom: 8,
              }}
            >
              Delete Solution
            </div>
            <div
              style={{
                fontSize: 13,
                color: T.text2,
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: T.text1 }}>{title}</strong>? This cannot
              be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  color: T.text2,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "rgba(244,63,94,0.15)",
                  border: "1px solid rgba(244,63,94,0.3)",
                  color: T.rose,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Solution Card ── */
function SolutionCard({ sol, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: T.bg2,
        border: `1px solid ${hovered ? T.border2 : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: 150,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
          background: T.bg3,
        }}
      >
        {sol.imageUrl ? (
          <motion.img
            src={sol.imageUrl}
            alt={sol.title}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            {sol.icon || "🔬"}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(7,13,26,0.85) 0%, transparent 55%)",
          }}
        />
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 20 }}>{sol.icon}</span>
          <StatusBadge active={sol.isActive} />
        </div>
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 6,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(sol);
            }}
            title="Edit"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(15,23,42,0.8)",
              border: `1px solid ${T.border2}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.accent,
              padding: 0,
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 12, height: 12 }}
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(sol);
            }}
            title="Delete"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(15,23,42,0.8)",
              border: "1px solid rgba(244,63,94,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.rose,
              padding: 0,
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 12, height: 12 }}
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 16px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.text1,
            fontFamily: "'Syne', sans-serif",
            marginBottom: 6,
            lineHeight: 1.3,
          }}
        >
          {sol.title}
        </h3>
        <p
          style={{
            fontSize: 12.5,
            color: T.text2,
            lineHeight: 1.6,
            marginBottom: 12,
            flex: 1,
          }}
        >
          {sol.desc}
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <StatChip label="Order" value={`#${sol.order}`} />
          <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
            <span style={{ fontSize: 10.5, color: T.text3 }}>
              {new Date(sol.updatedAt || sol.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Toast ── */
function Toast({ msg, type }) {
  if (!msg) return null;
  const color = type === "error" ? T.rose : T.green;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        background: T.bg2,
        border: `1px solid ${color}44`,
        borderRadius: 10,
        padding: "12px 18px",
        color,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "error" ? "⚠️" : "✓"} {msg}
    </motion.div>
  );
}

/* ── MAIN PAGE ── */
export default function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchFocus, setSearchFocus] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  /* Fetch all (admin=true to get inactive too) */
  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?admin=true`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setSolutions(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load solutions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setShowModal(true);
  };
  const openEdit = (s) => {
    setEditData(s);
    setShowModal(true);
  };

  /* Create or Update */
  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editData) {
        const res = await fetch(`${API}/${editData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setSolutions((s) =>
          s.map((x) => (x._id === editData._id ? updated : x)),
        );
        showToast("Solution updated successfully");
      } else {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setSolutions((s) => [...s, created]);
        showToast("Solution created successfully");
      }
      setShowModal(false);
    } catch {
      showToast("Failed to save solution", "error");
    } finally {
      setSaving(false);
    }
  };

  /* Delete */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setSolutions((s) => s.filter((x) => x._id !== deleteTarget._id));
      showToast("Solution deleted");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = solutions.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" ? s.isActive : !s.isActive);
    return matchSearch && matchStatus;
  });

  const totalActive = solutions.filter((s) => s.isActive).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: T.text1,
      }}
    >
      <style>{`${FONT_IMPORT} * { box-sizing: border-box; } ::placeholder { color: ${T.text3}; } select option { background: ${T.bg2}; color: ${T.text1}; }`}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.accent,
                  boxShadow: `0 0 0 3px rgba(79,156,249,0.2)`,
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  color: T.text2,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Solutions Management
              </span>
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Solutions
            </h1>
            <p style={{ fontSize: 13, color: T.text2, marginTop: 6 }}>
              Changes here reflect immediately on the frontend
            </p>
          </div>
          <button
            onClick={openAdd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 10,
              background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accent2} 100%)`,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 18px rgba(79,156,249,0.25)`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              style={{ width: 14, height: 14 }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Solution
          </button>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total Solutions",
              value: solutions.length,
              color: T.accent,
            },
            { label: "Active (Visible)", value: totalActive, color: T.green },
            {
              label: "Hidden",
              value: solutions.length - totalActive,
              color: T.amber,
            },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: T.bg2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: T.text3,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: k.color,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {k.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.bg2,
              border: `1px solid ${searchFocus ? T.accent : T.border2}`,
              borderRadius: 9,
              padding: "8px 12px",
              flex: "1 1 200px",
              minWidth: 180,
              transition: "border-color 0.2s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.text3}
              strokeWidth="2"
              style={{ width: 14, height: 14, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search solutions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text1,
                fontSize: 13,
                flex: 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            {search && (
              <span
                onClick={() => setSearch("")}
                style={{ cursor: "pointer", color: T.text2, fontSize: 12 }}
              >
                ✕
              </span>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 9,
              padding: "9px 12px",
              color: filterStatus !== "All" ? T.accent : T.text2,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: T.text2,
              background: T.bg2,
              border: `1px solid ${T.border}`,
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            <span style={{ color: T.text1, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            of {solutions.length}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: T.text3,
              fontSize: 14,
            }}
          >
            Loading solutions…
          </div>
        ) : (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "80px 20px",
                    background: T.bg2,
                    border: `1.5px dashed ${T.border2}`,
                    borderRadius: 16,
                    color: T.text3,
                    fontSize: 14,
                  }}
                >
                  No solutions found.{" "}
                  <span
                    onClick={openAdd}
                    style={{ color: T.accent, cursor: "pointer" }}
                  >
                    Add one
                  </span>
                </motion.div>
              ) : (
                filtered.map((sol, i) => (
                  <SolutionCard
                    key={sol._id}
                    sol={sol}
                    index={i}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <SolutionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editData={editData}
        saving={saving}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.title}
      />
      <AnimatePresence>
        <Toast key={toast.msg} msg={toast.msg} type={toast.type} />
      </AnimatePresence>
    </div>
  );
}
