import { useState, useEffect } from "react";

/* ─── THEME ── light clinical ─── */
const T = {
  pageBg: "#f3f0fb",
  cardBg: "#ffffff",
  cardBg2: "#f9f7ff",
  accent: "#5b4ff5",
  accent2: "#8b5cf6",
  accentSoft: "rgba(91,79,245,0.08)",
  accentSoft2: "rgba(91,79,245,0.15)",
  green: "#10b981",
  greenSoft: "rgba(16,185,129,0.10)",
  amber: "#f59e0b",
  amberSoft: "rgba(245,158,11,0.10)",
  rose: "#f43f5e",
  roseSoft: "rgba(244,63,94,0.10)",
  sky: "#0ea5e9",
  purple: "#8b5cf6",
  purpleSoft: "rgba(139,92,246,0.10)",
  text1: "#111827",
  text2: "#6b7280",
  text3: "#9ca3af",
  border: "rgba(0,0,0,0.07)",
  border2: "rgba(91,79,245,0.18)",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(91,79,245,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(91,79,245,0.12)",
};

const PHASE_META = {
  "Phase I": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.22)",
    topBar: "#f59e0b",
  },
  "Phase II": {
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.10)",
    border: "rgba(14,165,233,0.22)",
    topBar: "#0ea5e9",
  },
  "Phase III": {
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.10)",
    border: "rgba(139,92,246,0.22)",
    topBar: "#8b5cf6",
  },
  "Phase IV": {
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.22)",
    topBar: "#10b981",
  },
};

const STATUS_META = {
  Active: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.25)",
    dot: "#10b981",
  },
  Recruiting: {
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.10)",
    border: "rgba(14,165,233,0.25)",
    dot: "#0ea5e9",
  },
  Completed: {
    color: "#6b7280",
    bg: "rgba(107,127,163,0.10)",
    border: "rgba(107,127,163,0.22)",
    dot: "#9ca3af",
  },
  Pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    dot: "#f59e0b",
  },
  Suspended: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.10)",
    border: "rgba(244,63,94,0.25)",
    dot: "#f43f5e",
  },
};

const INITIAL_TRIALS = [
  {
    id: 1,
    trialId: "CT-2024-001",
    name: "Phase III Oncology Study",
    phase: "Phase III",
    status: "Active",
    indication: "Lung Cancer",
    sponsor: "Clinix Medical",
    patients: 120,
    target: 200,
    lead: "Dr. Sarah Chen",
    startDate: "Jan 2024",
    endDate: "Dec 2025",
    sites: 6,
    country: "USA",
    description:
      "A randomized double-blind study evaluating novel immunotherapy combinations in advanced lung cancer patients.",
  },
  {
    id: 2,
    trialId: "CT-2024-002",
    name: "Cardiovascular Prevention Trial",
    phase: "Phase II",
    status: "Recruiting",
    indication: "Hypertension",
    sponsor: "HeartCare Inc.",
    patients: 85,
    target: 150,
    lead: "Dr. Mark Williams",
    startDate: "Mar 2024",
    endDate: "Mar 2026",
    sites: 4,
    country: "UK",
    description:
      "Multi-center trial investigating new antihypertensive agents with reduced side-effect profiles.",
  },
  {
    id: 3,
    trialId: "CT-2024-003",
    name: "Neurological Disorder Study",
    phase: "Phase I",
    status: "Completed",
    indication: "Alzheimer's",
    sponsor: "Clinix Medical",
    patients: 45,
    target: 45,
    lead: "Dr. Priya Mehta",
    startDate: "Sep 2023",
    endDate: "Feb 2024",
    sites: 2,
    country: "India",
    description:
      "First-in-human study assessing safety and tolerability of a novel amyloid-targeting compound.",
  },
  {
    id: 4,
    trialId: "CT-2024-004",
    name: "Immunotherapy Research",
    phase: "Phase II",
    status: "Active",
    indication: "Melanoma",
    sponsor: "BioPharm Ltd",
    patients: 210,
    target: 250,
    lead: "Dr. James Ford",
    startDate: "Feb 2024",
    endDate: "Aug 2025",
    sites: 8,
    country: "Germany",
    description:
      "Combination checkpoint inhibitor therapy evaluated against standard of care in stage III/IV melanoma.",
  },
  {
    id: 5,
    trialId: "CT-2024-005",
    name: "Diabetes Management Protocol",
    phase: "Phase III",
    status: "Pending",
    indication: "Type 2 Diabetes",
    sponsor: "Clinix Medical",
    patients: 0,
    target: 300,
    lead: "Dr. Emily Ross",
    startDate: "May 2024",
    endDate: "May 2027",
    sites: 5,
    country: "Canada",
    description:
      "Evaluating a novel GLP-1 agonist for glycemic control and cardiovascular risk reduction in T2DM patients.",
  },
  {
    id: 6,
    trialId: "CT-2024-006",
    name: "Rare Disease Genomics Study",
    phase: "Phase I",
    status: "Recruiting",
    indication: "Cystic Fibrosis",
    sponsor: "GenCore Therapeutics",
    patients: 18,
    target: 60,
    lead: "Dr. Lena Vogel",
    startDate: "Jun 2024",
    endDate: "Jun 2026",
    sites: 3,
    country: "France",
    description:
      "Gene-therapy-based interventional study targeting CFTR mutations in pediatric and adult CF patients.",
  },
];

const EMPTY_FORM = {
  trialId: "",
  name: "",
  phase: "Phase II",
  status: "Pending",
  indication: "",
  sponsor: "",
  target: "",
  lead: "",
  startDate: "",
  endDate: "",
  sites: "",
  country: "",
  description: "",
};

/* ─── tiny anim hook ─── */
function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };
}

/* ─── BADGES ─── */
function PhaseBadge({ label }) {
  const m = PHASE_META[label] || {};
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const m = STATUS_META[label] || STATUS_META.Pending;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 12px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.dot,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

/* ─── PROGRESS BAR (CSS-only animated) ─── */
function EnrollmentBar({ patients, target, animKey }) {
  const pct =
    target > 0 ? Math.min(100, Math.round((patients / target) * 100)) : 0;
  const color = pct >= 80 ? T.green : pct >= 40 ? T.accent : T.amber;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct, animKey]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>
          Enrollment
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.text1 }}>
          {patients}{" "}
          <span style={{ color: T.text3, fontWeight: 400 }}>/ {target}</span>
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: "rgba(0,0,0,0.06)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: `linear-gradient(90deg,${color},${color}cc)`,
            borderRadius: 99,
            transition: "width 0.85s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
      <div
        style={{
          fontSize: 10,
          color: T.text3,
          marginTop: 3,
          textAlign: "right",
        }}
      >
        {pct}% enrolled
      </div>
    </div>
  );
}

/* ─── FORM FIELD ─── */
function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: T.text2,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
        {required && <span style={{ color: T.rose, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 10.5, color: T.rose, marginTop: 3 }}>
          {error}
        </div>
      )}
    </div>
  );
}

const mkInput = (focused, hasError) => ({
  width: "100%",
  padding: "9px 12px",
  background: "#f9fafb",
  border: `1.5px solid ${hasError ? T.rose : focused ? T.accent : "rgba(0,0,0,0.12)"}`,
  borderRadius: 9,
  color: T.text1,
  fontSize: 13,
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s",
  boxShadow: focused ? `0 0 0 3px rgba(91,79,245,0.12)` : "none",
});

/* ─── SECTION DIVIDER ─── */
function SectionDivider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "16px 0 14px",
        userSelect: "none",
      }}
    >
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.text3,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

/* ─── MODAL (no framer-motion) ─── */
function TrialModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        editData
          ? {
              ...editData,
              target: String(editData.target),
              sites: String(editData.sites),
            }
          : EMPTY_FORM,
      );
      setErrors({});
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
    } else {
      setVisible(false);
    }
  }, [open, editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.trialId.trim()) e.trialId = "Required";
    if (!form.lead.trim()) e.lead = "Required";
    return e;
  };
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      ...form,
      target: parseInt(form.target) || 0,
      sites: parseInt(form.sites) || 0,
    });
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(17,24,39,0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.22s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: T.cardBg,
          borderRadius: 20,
          width: "100%",
          maxWidth: 620,
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(16px)",
          transition:
            "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px 18px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "linear-gradient(135deg,#f8f6ff,#fff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px rgba(91,79,245,0.3)`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                style={{ width: 16, height: 16 }}
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: T.text1,
                  letterSpacing: "-0.02em",
                }}
              >
                {editData ? "Edit Trial" : "New Clinical Trial"}
              </div>
              <div style={{ fontSize: 12, color: T.text3, marginTop: 1 }}>
                {editData
                  ? "Update trial configuration"
                  : "Register a new trial to the portal"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#f3f4f6",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.text2,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: 13, height: 13 }}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "22px 26px",
            overflowY: "auto",
            flex: 1,
            scrollbarWidth: "thin",
            scrollbarColor: `${T.border2} transparent`,
          }}
        >
          <SectionDivider label="Identity" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <Field label="Trial ID" required error={errors.trialId}>
              <input
                value={form.trialId}
                onChange={(e) => set("trialId", e.target.value)}
                onFocus={() => setFocused("tid")}
                onBlur={() => setFocused(null)}
                placeholder="CT-2024-XXX"
                style={mkInput(focused === "tid", !!errors.trialId)}
              />
            </Field>
            <Field label="Phase">
              <select
                value={form.phase}
                onChange={(e) => set("phase", e.target.value)}
                style={{ ...mkInput(false, false), cursor: "pointer" }}
              >
                {["Phase I", "Phase II", "Phase III", "Phase IV"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Trial Name" required error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              placeholder="Full official trial name"
              style={mkInput(focused === "name", !!errors.name)}
            />
          </Field>

          <SectionDivider label="Medical Details" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <Field label="Indication">
              <input
                value={form.indication}
                onChange={(e) => set("indication", e.target.value)}
                onFocus={() => setFocused("ind")}
                onBlur={() => setFocused(null)}
                placeholder="e.g. Lung Cancer"
                style={mkInput(focused === "ind", false)}
              />
            </Field>
            <Field label="Sponsor">
              <input
                value={form.sponsor}
                onChange={(e) => set("sponsor", e.target.value)}
                onFocus={() => setFocused("spon")}
                onBlur={() => setFocused(null)}
                placeholder="Sponsor organization"
                style={mkInput(focused === "spon", false)}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused(null)}
              placeholder="Brief description of trial objectives…"
              rows={3}
              style={{
                ...mkInput(focused === "desc", false),
                resize: "vertical",
              }}
            />
          </Field>

          <SectionDivider label="Operations" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                style={{ ...mkInput(false, false), cursor: "pointer" }}
              >
                {[
                  "Pending",
                  "Recruiting",
                  "Active",
                  "Completed",
                  "Suspended",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Target Patients">
              <input
                type="number"
                value={form.target}
                onChange={(e) => set("target", e.target.value)}
                onFocus={() => setFocused("tgt")}
                onBlur={() => setFocused(null)}
                min="0"
                placeholder="0"
                style={mkInput(focused === "tgt", false)}
              />
            </Field>
            <Field label="Sites">
              <input
                type="number"
                value={form.sites}
                onChange={(e) => set("sites", e.target.value)}
                onFocus={() => setFocused("sit")}
                onBlur={() => setFocused(null)}
                min="0"
                placeholder="0"
                style={mkInput(focused === "sit", false)}
              />
            </Field>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <Field label="Lead Researcher" required error={errors.lead}>
              <input
                value={form.lead}
                onChange={(e) => set("lead", e.target.value)}
                onFocus={() => setFocused("lead")}
                onBlur={() => setFocused(null)}
                placeholder="Dr. Full Name"
                style={mkInput(focused === "lead", !!errors.lead)}
              />
            </Field>
            <Field label="Country">
              <input
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                onFocus={() => setFocused("cou")}
                onBlur={() => setFocused(null)}
                placeholder="e.g. USA"
                style={mkInput(focused === "cou", false)}
              />
            </Field>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Start Date">
              <input
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                onFocus={() => setFocused("sd")}
                onBlur={() => setFocused(null)}
                placeholder="Jan 2024"
                style={mkInput(focused === "sd", false)}
              />
            </Field>
            <Field label="End Date">
              <input
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                onFocus={() => setFocused("ed")}
                onBlur={() => setFocused(null)}
                placeholder="Dec 2025"
                style={mkInput(focused === "ed", false)}
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 26px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
            background: "#fafafa",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 22px",
              borderRadius: 9,
              background: "#f3f4f6",
              border: "1px solid rgba(0,0,0,0.08)",
              color: T.text2,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e9eaec";
              e.currentTarget.style.color = T.text1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.color = T.text2;
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "9px 24px",
              borderRadius: 9,
              background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: `0 4px 14px rgba(91,79,245,0.35)`,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 6px 20px rgba(91,79,245,0.45)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = `0 4px 14px rgba(91,79,245,0.35)`;
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              style={{ width: 13, height: 13 }}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            {editData ? "Save Changes" : "Create Trial"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE CONFIRM ─── */
function DeleteConfirm({ open, onClose, onConfirm, name }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
    else setVisible(false);
  }, [open]);
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        background: "rgba(17,24,39,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: T.cardBg,
          borderRadius: 18,
          padding: 28,
          width: 340,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(10px)",
          transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: T.roseSoft,
            border: "1px solid rgba(244,63,94,0.2)",
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
            fontSize: 17,
            fontWeight: 800,
            color: T.text1,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Delete Trial
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
          <strong style={{ color: T.text1 }}>{name}</strong>? This cannot be
          undone.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 9,
              background: "#f3f4f6",
              border: "1px solid rgba(0,0,0,0.08)",
              color: T.text2,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 9,
              background: T.roseSoft,
              border: "1px solid rgba(244,63,94,0.25)",
              color: T.rose,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(244,63,94,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = T.roseSoft)
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── KPI CARD ─── */
function KpiCard({ label, value, color, icon, delay }) {
  const style = useFadeIn(delay);
  return (
    <div
      style={{
        ...style,
        background: T.cardBg,
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: T.shadow,
        border: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: T.text1,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: T.text3,
            marginTop: 3,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─── TRIAL CARD ─── */
function TrialCard({ trial, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pm = PHASE_META[trial.phase] || {};

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60 + index * 55);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.cardBg,
        borderRadius: 16,
        boxShadow: hovered ? T.shadowHover : T.shadow,
        border: `1px solid ${hovered ? "rgba(91,79,245,0.14)" : T.border}`,
        overflow: "hidden",
        transition:
          "box-shadow 0.25s, border-color 0.25s, opacity 0.4s, transform 0.4s",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        cursor: "default",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(18px)",
      }}
    >
      {/* Phase color top bar */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg,${pm.topBar || T.accent},${pm.topBar || T.accent}88)`,
        }}
      />

      <div style={{ padding: "20px 22px" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: T.accent,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  background: T.accentSoft,
                  padding: "2px 9px",
                  borderRadius: 20,
                  border: `1px solid ${T.border2}`,
                  whiteSpace: "nowrap",
                }}
              >
                {trial.trialId}
              </span>
              <PhaseBadge label={trial.phase} />
              <StatusBadge label={trial.status} />
            </div>
            <h3
              style={{
                fontSize: 15.5,
                fontWeight: 800,
                color: T.text1,
                margin: "0 0 4px",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              {trial.name}
            </h3>
            <p
              style={{
                fontSize: 12.5,
                color: T.text2,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span>{trial.indication}</span>
              {trial.sponsor && (
                <>
                  <span style={{ color: T.border }}>·</span>
                  <span style={{ color: T.text3 }}>{trial.sponsor}</span>
                </>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexShrink: 0,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.18s",
            }}
          >
            <button
              onClick={() => onEdit(trial)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: T.accentSoft,
                border: `1px solid ${T.border2}`,
                display: "flex",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
                color: T.accent,
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = T.accentSoft2)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = T.accentSoft)
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 11, height: 11 }}
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(trial)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: T.roseSoft,
                border: "1px solid rgba(244,63,94,0.22)",
                display: "flex",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
                color: T.rose,
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(244,63,94,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = T.roseSoft)
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: 11, height: 11 }}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {/* Description */}
        {trial.description && (
          <p
            style={{
              fontSize: 12,
              color: T.text3,
              lineHeight: 1.65,
              margin: "0 0 16px",
              paddingLeft: 12,
              borderLeft: `2.5px solid ${T.accentSoft2}`,
            }}
          >
            {trial.description.length > 130
              ? trial.description.slice(0, 130) + "…"
              : trial.description}
          </p>
        )}

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <EnrollmentBar
            patients={trial.patients}
            target={trial.target}
            animKey={trial.id}
          />
        </div>

        {/* Meta grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))",
            gap: "10px 20px",
            paddingTop: 14,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {[
            { label: "Lead", value: trial.lead },
            { label: "Sites", value: trial.sites },
            { label: "Country", value: trial.country },
            {
              label: "Period",
              value:
                trial.startDate && trial.endDate
                  ? `${trial.startDate} – ${trial.endDate}`
                  : trial.startDate || "—",
            },
          ].map((m, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 10,
                  color: T.text3,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 3,
                  fontWeight: 600,
                }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text1 }}>
                {m.value || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyState({ onAdd }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "72px 20px",
        background: T.cardBg,
        border: `1.5px dashed rgba(91,79,245,0.2)`,
        borderRadius: 18,
        textAlign: "center",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        boxShadow: T.shadow,
        gridColumn: "1 / -1",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: "#f5f3ff",
          border: `1px solid rgba(91,79,245,0.15)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.text3}
          strokeWidth="1.5"
          style={{ width: 26, height: 26 }}
        >
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: T.text1,
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        No trials found
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.text2,
          marginBottom: 22,
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        No trials match your current filters. Adjust your search or add a new
        trial.
      </div>
      <button
        onClick={onAdd}
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
          border: "none",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          boxShadow: `0 4px 14px rgba(91,79,245,0.3)`,
        }}
      >
        + New Trial
      </button>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Trials() {
  const [trials, setTrials] = useState(INITIAL_TRIALS);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setHeaderVisible(true));
  }, []);

  const openAdd = () => {
    setEditData(null);
    setShowModal(true);
  };
  const openEdit = (t) => {
    setEditData(t);
    setShowModal(true);
  };
  const handleSave = (form) => {
    if (editData)
      setTrials((ts) =>
        ts.map((t) => (t.id === editData.id ? { ...t, ...form } : t)),
      );
    else setTrials((ts) => [...ts, { ...form, id: Date.now(), patients: 0 }]);
    setShowModal(false);
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      setTrials((ts) => ts.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered = trials.filter((t) => {
    const matchFilter = filter === "All" || t.status === filter;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.trialId.toLowerCase().includes(search.toLowerCase()) ||
      (t.indication || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: trials.length,
    Active: trials.filter((t) => t.status === "Active").length,
    Recruiting: trials.filter((t) => t.status === "Recruiting").length,
    Pending: trials.filter((t) => t.status === "Pending").length,
    Completed: trials.filter((t) => t.status === "Completed").length,
  };

  const totalEnrolled = trials.reduce((a, t) => a + (t.patients || 0), 0);
  const totalTarget = trials.reduce((a, t) => a + (t.target || 0), 0);
  const totalSites = trials.reduce((a, t) => a + (t.sites || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        html, body, #root { background: ${T.pageBg} !important; }
        *, *::before, *::after { box-sizing: border-box; }
        ::placeholder { color: #9ca3af; }
        select option { background:#fff; color:#111827; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(91,79,245,0.2); border-radius:10px; }
        ::-webkit-scrollbar-track { background:transparent; }
        @media(max-width:640px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .filter-row { flex-wrap: wrap !important; }
        }
        @media(max-width:420px) {
          .trials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Full page wrapper — this is the key fix ── */}
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: T.pageBg,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          color: T.text1,
          /* Prevent any child from breaking the bg */
          position: "relative",
          zIndex: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "clamp(20px,4vw,36px) clamp(16px,3vw,28px)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 28,
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(-14px)",
              transition: "opacity 0.38s ease, transform 0.38s ease",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: T.accent,
                    boxShadow: `0 0 0 3px rgba(91,79,245,0.2)`,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: T.text3,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Clinical Trial Management
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(22px,4vw,30px)",
                  fontWeight: 800,
                  color: T.text1,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                Clinical Trials
              </h1>
              <p
                style={{
                  fontSize: 13.5,
                  color: T.text2,
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                Monitor and manage all active clinical research programs
              </p>
            </div>
            <button
              onClick={openAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 24px",
                borderRadius: 12,
                background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
                border: "none",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                boxShadow: `0 4px 18px rgba(91,79,245,0.35)`,
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 6px 24px rgba(91,79,245,0.45)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `0 4px 18px rgba(91,79,245,0.35)`;
              }}
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
              New Trial
            </button>
          </div>

          {/* ── KPI Strip ── */}
          <div
            className="kpi-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <KpiCard
              label="Total Trials"
              value={trials.length}
              color={T.accent}
              delay={60}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.accent}
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              }
            />
            <KpiCard
              label="Active Trials"
              value={counts.Active}
              color={T.green}
              delay={90}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.green}
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <KpiCard
              label="Enrolled"
              value={`${totalEnrolled}/${totalTarget}`}
              color={T.purple}
              delay={120}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.purple}
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
            <KpiCard
              label="Total Sites"
              value={totalSites}
              color={T.amber}
              delay={150}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.amber}
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            />
          </div>

          {/* ── Filters ── */}
          <div
            className="filter-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 22,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: T.cardBg,
                border: `1.5px solid ${searchFocus ? T.accent : "rgba(0,0,0,0.10)"}`,
                borderRadius: 11,
                padding: "8px 14px",
                flex: "1 1 200px",
                minWidth: 180,
                transition: "all 0.2s",
                boxShadow: searchFocus
                  ? `0 0 0 3px rgba(91,79,245,0.10)`
                  : "none",
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
                placeholder="Search trials…"
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
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              />
              {search && (
                <span
                  onClick={() => setSearch("")}
                  style={{
                    cursor: "pointer",
                    color: T.text3,
                    fontSize: 12,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </span>
              )}
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["All", "Active", "Recruiting", "Pending", "Completed"].map(
                (f) => {
                  const active = filter === f;
                  const sm = f !== "All" ? STATUS_META[f] : null;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "7px 15px",
                        borderRadius: 22,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        transition: "all 0.18s",
                        background: active
                          ? `linear-gradient(135deg,${T.accent},${T.accent2})`
                          : T.cardBg,
                        color: active ? "#fff" : T.text2,
                        border: active ? "none" : `1px solid ${T.border}`,
                        boxShadow: active
                          ? `0 3px 12px rgba(91,79,245,0.28)`
                          : "none",
                      }}
                    >
                      {f !== "All" && sm && !active && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: sm.dot,
                            marginRight: 5,
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                      {f}{" "}
                      <span style={{ fontSize: 10, opacity: 0.75 }}>
                        {counts[f]}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            {/* Count */}
            <div
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: T.text2,
                background: T.cardBg,
                border: `1px solid ${T.border}`,
                padding: "7px 14px",
                borderRadius: 9,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: T.text1, fontWeight: 700 }}>
                {filtered.length}
              </span>{" "}
              of {trials.length} trials
            </div>
          </div>

          {/* ── Cards ── */}
          <div
            className="trials-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(min(100%,500px),1fr))",
              gap: 16,
            }}
          >
            {filtered.length === 0 ? (
              <EmptyState onAdd={openAdd} />
            ) : (
              filtered.map((trial, i) => (
                <TrialCard
                  key={trial.id}
                  trial={trial}
                  index={i}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <TrialModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editData={editData}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        name={deleteTarget?.name}
      />
    </>
  );
}
