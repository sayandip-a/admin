import { useEffect, useState, useRef } from "react";
import { ThemeContext } from "./Dashboard";
const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;
const APP_URL = `${import.meta.env.VITE_API_URL}/api/applications`;

const cls = (...args) => args.filter(Boolean).join(" ");

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const STATUSES = ["Active", "Closed"];
const APP_STATUSES = ["new", "reviewing", "shortlisted", "rejected"];

const EMPTY_FORM = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  description: "",
  requirements: "",
  responsibilities: "",
  experience: "",
  salary: "",
  status: "Active",
};

const typeBadge = {
  "Full-time": "badge-blue",
  "Part-time": "badge-violet",
  Contract: "badge-amber",
  Internship: "badge-teal",
};
const statusBadge = { Active: "badge-green", Closed: "badge-red" };

const APP_STATUS_META = {
  new: {
    color: "#5b8dee",
    bg: "rgba(91,141,238,.1)",
    border: "rgba(91,141,238,.25)",
    label: "New",
  },
  reviewing: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,.1)",
    border: "rgba(245,158,11,.25)",
    label: "Reviewing",
  },
  shortlisted: {
    color: "#22c55e",
    bg: "rgba(34,197,94,.1)",
    border: "rgba(34,197,94,.25)",
    label: "Shortlisted",
  },
  rejected: {
    color: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    border: "rgba(239,68,68,.25)",
    label: "Rejected",
  },
};

function Ic({ d, size = 14 }) {
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

/* ── Email Compose Modal ── */
function EmailModal({ app, onClose }) {
  const [subject, setSubject] = useState(
    `Re: Your application for ${app.job?.title || "the position"}`,
  );
  const [body, setBody] = useState(
    `Dear ${app.name},\n\nThank you for applying for the ${app.job?.title || "position"} role at Accelia.\n\n[Your message here]\n\nBest regards,\nAccelia HR Team`,
  );

  const openMailClient = () => {
    window.open(
      `mailto:${app.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank",
    );
    onClose();
  };

  const templates = [
    {
      label: "Interview Invite",
      body: `Dear ${app.name},\n\nWe are pleased to invite you for an interview for the ${app.job?.title} position.\n\nPlease let us know your availability for a 30-minute call this week.\n\nBest regards,\nAccelia HR Team`,
    },
    {
      label: "Shortlisted",
      body: `Dear ${app.name},\n\nCongratulations! You have been shortlisted for the ${app.job?.title} role.\n\nOur team will be in touch shortly with the next steps.\n\nBest regards,\nAccelia HR Team`,
    },
    {
      label: "Regret Letter",
      body: `Dear ${app.name},\n\nThank you for your interest in the ${app.job?.title} position at Accelia.\n\nAfter careful consideration, we regret to inform you that we have decided to move forward with other candidates.\n\nWe wish you the best in your job search.\n\nBest regards,\nAccelia HR Team`,
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal email-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text)",
            }}
          >
            ✉️ Reply to {app.name}
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="email-field">
          <label>To</label>
          <div className="email-to-pill">
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {app.name}
            </span>
            <span style={{ color: "var(--muted)", marginLeft: 6 }}>
              &lt;{app.email}&gt;
            </span>
          </div>
        </div>
        <div className="email-field">
          <label>Subject</label>
          <input
            className="finput"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="email-field">
          <label>Message</label>
          <textarea
            className="finput"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ minHeight: 180, resize: "vertical" }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            Quick Templates
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => setBody(t.body)}
                className="tpl-btn"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="btn-outline"
            onClick={() => navigator.clipboard.writeText(body)}
          >
            <Ic
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              size={12}
            />
            Copy
          </button>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={openMailClient}>
            <Ic
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              size={13}
            />
            Open in Mail
          </button>
        </div>
      </div>
    </div>
  );
}

function downloadCV(appId, filename, token) {
  fetch(`${APP_URL}/${appId}/cv`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("CV not found");
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "resume";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch((err) => alert(err.message));
}

function CVPreviewModal({ appId, filename, token, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const isPdf = filename?.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    fetch(`${APP_URL}/${appId}/cv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("CV not found");
        return res.blob();
      })
      .then((blob) => {
        setBlobUrl(URL.createObjectURL(blob));
        setLoading(false);
      })
      .catch((e) => {
        setErr(e.message);
        setLoading(false);
      });
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [appId]);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ alignItems: "stretch", padding: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          width: "min(780px,100vw)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text)",
            }}
          >
            <Ic
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              size={16}
            />
            Resume — {filename}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              style={{ padding: "6px 14px", fontSize: 12 }}
              onClick={() => downloadCV(appId, filename, token)}
            >
              <Ic
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                size={12}
              />
              Download
            </button>
            <button className="btn-icon-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#f0f2f8",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {loading && (
            <div style={{ color: "var(--muted)", marginTop: 60 }}>
              Loading resume…
            </div>
          )}
          {err && (
            <div style={{ color: "var(--red)", marginTop: 60 }}>⚠️ {err}</div>
          )}
          {blobUrl && isPdf && (
            <iframe
              src={`${blobUrl}#toolbar=1`}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "80vh",
                border: "none",
                borderRadius: 8,
              }}
              title="Resume"
            />
          )}
          {blobUrl && !isPdf && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <p style={{ fontSize: 14, marginBottom: 16 }}>
                Preview not available for this file type.
              </p>
              <button
                className="btn-primary"
                onClick={() => downloadCV(appId, filename, token)}
              >
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const token = localStorage.getItem("token");
  const [tab, setTab] = useState("jobs");

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const [apps, setApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [appStatus, setAppStatus] = useState("all");
  const [appJob, setAppJob] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteAppConfirm, setDeleteAppConfirm] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    if (selectedApp) setNote(selectedApp.note || "");
  }, [selectedApp?._id]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const r = await fetch(`${API_URL}?admin=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setJobs(d.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPanelOpen(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };
  const openEdit = (job) => {
    setForm({
      title: job.title || "",
      department: job.dept || "",
      location: job.location || "",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: (job.requirements || []).join(", "),
      responsibilities: (job.responsibilities || []).join(", "),
      experience: job.experience || "",
      salary: job.salary || "",
      status: job.isActive ? "Active" : "Closed",
    });
    setEditId(job._id);
    setPanelOpen(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );
  };
  const closePanel = () => {
    setPanelOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.department ||
      !form.location ||
      !form.description
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }
    const payload = {
      title: form.title,
      dept: form.department,
      location: form.location,
      type: form.type,
      description: form.description,
      requirements: form.requirements
        ? form.requirements.split(",").map((s) => s.trim())
        : [],
      responsibilities: form.responsibilities
        ? form.responsibilities.split(",").map((s) => s.trim())
        : [],
      experience: form.experience,
      salary: form.salary,
      isActive: form.status === "Active",
    };
    try {
      setSaving(true);
      const r = await fetch(editId ? `${API_URL}/${editId}` : API_URL, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || "Error", "error");
        return;
      }
      showToast(editId ? "Job updated!" : "Job posted!");
      closePanel();
      fetchJobs();
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await fetch(`${API_URL}/${deleteConfirm}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        showToast("Job deleted");
        fetchJobs();
      } else showToast("Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const visible = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      (j.title?.toLowerCase().includes(q) ||
        j.dept?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)) &&
      (filterStatus === "All" ||
        (filterStatus === "Active" ? j.isActive : !j.isActive)) &&
      (filterType === "All" || j.type === filterType)
    );
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.isActive).length,
    closed: jobs.filter((j) => !j.isActive).length,
    depts: new Set(jobs.map((j) => j.dept)).size,
  };

  const fetchApps = async () => {
    try {
      setLoadingApps(true);
      const params = new URLSearchParams();
      if (appStatus !== "all") params.set("status", appStatus);
      if (appJob !== "all") params.set("jobId", appJob);
      const r = await fetch(`${APP_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setApps(d.applications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApps(false);
    }
  };
  useEffect(() => {
    if (tab === "applications") fetchApps();
  }, [tab, appStatus, appJob]);

  const updateAppStatus = async (id, status) => {
    try {
      setUpdatingStatus(true);
      const r = await fetch(`${APP_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (r.ok) {
        showToast(`Status → ${status}`);
        setSelectedApp((prev) =>
          prev?._id === id ? { ...prev, status } : prev,
        );
        setApps((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a)),
        );
      } else showToast("Update failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNote = async () => {
    if (!selectedApp) return;
    try {
      setSavingNote(true);
      const r = await fetch(`${APP_URL}/${selectedApp._id}/note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      });
      if (r.ok) {
        showToast("Note saved");
        setSelectedApp((prev) => (prev ? { ...prev, note } : null));
        setApps((prev) =>
          prev.map((a) => (a._id === selectedApp._id ? { ...a, note } : a)),
        );
      } else showToast("Failed to save note", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setSavingNote(false);
    }
  };

  const deleteApp = async () => {
    if (!deleteAppConfirm) return;
    try {
      const r = await fetch(`${APP_URL}/${deleteAppConfirm}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        showToast("Application deleted");
        setSelectedApp(null);
        fetchApps();
      } else showToast("Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleteAppConfirm(null);
    }
  };

  const visibleApps = apps.filter((a) => {
    const q = appSearch.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.job?.title?.toLowerCase().includes(q)
    );
  });

  const appStats = {
    total: apps.length,
    new: apps.filter((a) => a.status === "new").length,
    shortlisted: apps.filter((a) => a.status === "shortlisted").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  const AVATAR_COLORS = [
    "#5b8dee",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
  ];
  const avatarColor = (name) =>
    AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";
  const hasCV = (app) => !!(app?.cv?.filename || app?.cv?.size);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        :root {
          --bg: #f4f5fb;
          --surface: #ffffff;
          --surface2: #f8f9fe;
          --surface3: #eef0fa;
          --border: #e4e7f4;
          --border-hover: #c5cbe8;
          --text: #1a1f3a;
          --text-secondary: #4a5278;
          --muted: #8892b8;
          --accent: #5b8dee;
          --accent-dark: #3d6fd4;
          --accent-light: rgba(91,141,238,.1);
          --accent-glow: rgba(91,141,238,.25);
          --green: #22c55e;
          --green-light: rgba(34,197,94,.1);
          --red: #ef4444;
          --red-light: rgba(239,68,68,.1);
          --amber: #f59e0b;
          --violet: #8b5cf6;
          --teal: #14b8a6;
          --shadow-sm: 0 1px 3px rgba(26,31,58,.06), 0 1px 2px rgba(26,31,58,.04);
          --shadow: 0 4px 16px rgba(26,31,58,.08), 0 2px 6px rgba(26,31,58,.04);
          --shadow-lg: 0 12px 40px rgba(26,31,58,.12), 0 4px 12px rgba(26,31,58,.06);
          --radius: 16px;
          --radius-sm: 10px;
          --radius-xs: 6px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Page shell ── */
        .jw { height:100%; display:flex; flex-direction:column; overflow:hidden; background:var(--bg); color:var(--text); }
        .jw-scroll { flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:24px 20px 80px; }
        @media(min-width:768px){ .jw-scroll { padding:32px 36px 80px; } }

        /* ── Top bar ── */
        .jw-topbar { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:24px; }
        .jw-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:clamp(20px,3.5vw,28px); font-weight:800; letter-spacing:-.6px; color:var(--text); line-height:1.2; }
        .jw-subtitle { font-size:13px; color:var(--muted); margin-top:4px; font-weight:400; }

        /* ── Tab bar ── */
        .tab-bar { display:inline-flex; gap:4px; background:var(--surface); border:1.5px solid var(--border); border-radius:12px; padding:4px; margin-bottom:24px; box-shadow:var(--shadow-sm); }
        .tab-btn { display:flex; align-items:center; gap:7px; padding:8px 18px; border-radius:9px; border:none; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all .25s cubic-bezier(.4,0,.2,1); background:transparent; color:var(--muted); white-space:nowrap; }
        .tab-btn:hover:not(.active) { color:var(--text); background:var(--surface3); }
        .tab-btn.active { background:var(--accent); color:#fff; box-shadow:0 2px 10px var(--accent-glow); }
        .tab-count { border-radius:999px; padding:1px 8px; font-size:11px; font-weight:700; }
        .tab-btn.active .tab-count { background:rgba(255,255,255,.25); color:#fff; }
        .tab-btn:not(.active) .tab-count { background:var(--surface3); color:var(--muted); }

        /* ── Stat cards ── */
        .stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
        @media(min-width:540px){ .stats-grid { grid-template-columns:repeat(4,1fr); } }
        .stat-card {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius); padding:16px 18px;
          box-shadow:var(--shadow-sm);
          transition:transform .25s ease, box-shadow .25s ease, border-color .2s;
          cursor:default;
          animation: fadeUp .4s ease both;
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow); border-color:var(--border-hover); }
        .stat-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
        .stat-label { font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
        .stat-val { font-family:'Plus Jakarta Sans',sans-serif; font-size:28px; font-weight:800; line-height:1; letter-spacing:-1px; }
        .stat-sub { font-size:11px; color:var(--muted); margin-top:4px; }
        .col-blue   { color:var(--accent); }
        .col-green  { color:var(--green); }
        .col-red    { color:var(--red); }
        .col-violet { color:var(--violet); }
        .col-amber  { color:var(--amber); }
        .bg-blue   { background:var(--accent-light); }
        .bg-green  { background:var(--green-light); }
        .bg-red    { background:var(--red-light); }
        .bg-violet { background:rgba(139,92,246,.1); }

        /* ── Post job button ── */
        .btn-post {
          display:flex; align-items:center; gap:8px;
          background:var(--accent); color:#fff; border:none;
          border-radius:var(--radius-sm); padding:10px 20px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13.5px; font-weight:700;
          cursor:pointer; transition:all .25s; white-space:nowrap;
          box-shadow: 0 2px 12px var(--accent-glow);
        }
        .btn-post:hover { background:var(--accent-dark); transform:translateY(-1px); box-shadow:0 4px 18px var(--accent-glow); }
        .btn-post.cancel { background:var(--surface); color:var(--text); border:1.5px solid var(--border); box-shadow:none; }
        .btn-post.cancel:hover { background:var(--surface3); box-shadow:none; }

        /* ── Form panel ── */
        .panel-wrap { overflow:hidden; transition:max-height .5s cubic-bezier(.4,0,.2,1), opacity .4s; max-height:0; opacity:0; }
        .panel-wrap.open { max-height:2600px; opacity:1; }
        .panel {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius); padding:24px; margin-bottom:24px;
          box-shadow:var(--shadow);
        }
        .panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:8px; }
        .panel-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; display:flex; align-items:center; gap:10px; }
        .panel-badge { border-radius:999px; padding:3px 12px; font-size:10.5px; font-weight:700; letter-spacing:.04em; }
        .panel-badge.new  { background:var(--accent-light); color:var(--accent); }
        .panel-badge.edit { background:rgba(139,92,246,.1); color:var(--violet); }

        /* ── Inputs ── */
        .form-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:580px){ .form-grid { grid-template-columns:1fr 1fr; } }
        .field { display:flex; flex-direction:column; gap:6px; }
        .field.span2 { grid-column:1/-1; }
        .field label { font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--muted); }
        .req { color:var(--red); }
        .finput {
          background:var(--surface2); border:1.5px solid var(--border);
          border-radius:var(--radius-sm); color:var(--text);
          font-family:'DM Sans',sans-serif; font-size:13.5px;
          padding:10px 14px; outline:none;
          transition:border-color .2s, box-shadow .2s, background .2s;
          width:100%; resize:vertical;
        }
        .finput::placeholder { color:#b5bcd8; }
        .finput:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); background:var(--surface); }
        textarea.finput { min-height:80px; }

        /* ── Form actions ── */
        .form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; flex-wrap:wrap; }
        .btn-outline {
          background:transparent; border:1.5px solid var(--border); color:var(--text-secondary);
          border-radius:var(--radius-sm); padding:9px 20px;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px;
        }
        .btn-outline:hover { border-color:var(--border-hover); color:var(--text); background:var(--surface3); }
        .btn-primary {
          background:var(--accent); border:none; color:#fff;
          border-radius:var(--radius-sm); padding:9px 22px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:7px;
          box-shadow:0 2px 10px var(--accent-glow);
        }
        .btn-primary:hover:not(:disabled) { background:var(--accent-dark); transform:translateY(-1px); }
        .btn-primary:disabled { opacity:.55; cursor:not-allowed; }
        .btn-primary.violet { background:var(--violet); box-shadow:0 2px 10px rgba(139,92,246,.3); }
        .btn-primary.violet:hover { background:#7c3aed; }

        /* ── Filters ── */
        .filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; align-items:center; }
        .search-wrap { flex:1; min-width:180px; position:relative; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
        .search-input {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius-sm); color:var(--text);
          font-family:'DM Sans',sans-serif; font-size:13px;
          padding:10px 14px 10px 38px; outline:none; width:100%;
          transition:border-color .2s, box-shadow .2s;
          box-shadow:var(--shadow-sm);
        }
        .search-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        .search-input::placeholder { color:#b5bcd8; }
        .filter-select {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius-sm); color:var(--text-secondary);
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
          padding:10px 14px; outline:none; cursor:pointer;
          transition:border-color .2s; box-shadow:var(--shadow-sm);
        }
        .filter-select:focus { border-color:var(--accent); }

        /* ── Section title ── */
        .sec-title {
          font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700;
          color:var(--muted); margin-bottom:14px; display:flex; align-items:center; gap:6px;
          letter-spacing:.04em; text-transform:uppercase;
        }
        .sec-title span { color:var(--text); }

        /* ── Job cards ── */
        .job-list { display:flex; flex-direction:column; gap:10px; }
        .job-card {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius); padding:18px 20px;
          display:flex; flex-direction:column; gap:12px;
          box-shadow:var(--shadow-sm);
          transition:transform .25s ease, box-shadow .25s ease, border-color .2s;
          animation:fadeUp .35s ease both;
          position:relative; overflow:hidden;
        }
        .job-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,var(--accent),var(--violet));
          opacity:0; transition:opacity .25s;
        }
        .job-card:hover { transform:translateY(-2px); box-shadow:var(--shadow); border-color:var(--border-hover); }
        .job-card:hover::before { opacity:1; }

        .card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .card-meta { flex:1; min-width:0; }
        .card-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; margin-bottom:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .card-dept { font-size:12.5px; color:var(--muted); display:flex; align-items:center; gap:5px; }
        .card-dept b { color:var(--text-secondary); font-weight:600; }
        .card-tags { display:flex; flex-wrap:wrap; gap:6px; }
        .card-actions { display:flex; gap:7px; flex-shrink:0; }
        .card-desc { font-size:12.5px; color:var(--muted); line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* ── Badges ── */
        .badge { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:4px 11px; font-size:10.5px; font-weight:700; letter-spacing:.03em; }
        .badge-green  { background:rgba(34,197,94,.1);  color:var(--green);  border:1px solid rgba(34,197,94,.2); }
        .badge-red    { background:rgba(239,68,68,.1);  color:var(--red);    border:1px solid rgba(239,68,68,.2); }
        .badge-blue   { background:var(--accent-light); color:var(--accent); border:1px solid rgba(91,141,238,.2); }
        .badge-violet { background:rgba(139,92,246,.1); color:var(--violet); border:1px solid rgba(139,92,246,.2); }
        .badge-amber  { background:rgba(245,158,11,.1); color:var(--amber);  border:1px solid rgba(245,158,11,.2); }
        .badge-teal   { background:rgba(20,184,166,.1); color:var(--teal);   border:1px solid rgba(20,184,166,.2); }
        .badge-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

        /* ── Card action buttons ── */
        .btn-edit {
          background:var(--surface2); border:1.5px solid var(--border); color:var(--text-secondary);
          border-radius:var(--radius-sm); padding:7px 14px; font-size:12px; font-weight:600;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px;
        }
        .btn-edit:hover { border-color:var(--accent); background:var(--accent-light); color:var(--accent); }
        .btn-del {
          background:var(--surface2); border:1.5px solid var(--border); color:var(--muted);
          border-radius:var(--radius-sm); padding:7px 14px; font-size:12px; font-weight:600;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px;
        }
        .btn-del:hover { border-color:var(--red); background:var(--red-light); color:var(--red); }

        /* ── Application list ── */
        .app-list { display:flex; flex-direction:column; gap:8px; }
        .app-card {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius); padding:14px 18px;
          display:flex; align-items:center; gap:13px; cursor:pointer;
          transition:all .25s; animation:fadeUp .3s ease both;
          box-shadow:var(--shadow-sm);
        }
        .app-card:hover { border-color:var(--border-hover); transform:translateY(-1px); box-shadow:var(--shadow); }
        .app-card.selected { border-color:var(--accent); background:rgba(91,141,238,.03); }
        .app-avatar {
          width:40px; height:40px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-weight:700; font-size:14px; flex-shrink:0;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .app-info { flex:1; min-width:0; }
        .app-name { font-weight:600; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:2px; }
        .app-sub  { font-size:11.5px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .app-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
        .app-status { display:inline-flex; align-items:center; gap:4px; border-radius:999px; padding:3px 11px; font-size:10px; font-weight:700; letter-spacing:.04em; border:1px solid; }

        /* ── Drawer ── */
        .drawer-backdrop { position:fixed; inset:0; background:rgba(26,31,58,.35); z-index:50; animation:fadeIn .2s; backdrop-filter:blur(2px); }
        .drawer {
          position:fixed; top:0; right:0; height:100%; width:min(480px,100vw);
          background:var(--surface); border-left:1.5px solid var(--border);
          z-index:51; display:flex; flex-direction:column;
          animation:slideIn .3s cubic-bezier(.4,0,.2,1);
          box-shadow:-8px 0 40px rgba(26,31,58,.12);
        }
        .drawer-header { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1.5px solid var(--border); flex-shrink:0; }
        .drawer-title { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:15px; }
        .drawer-body  { flex:1; overflow-y:auto; padding:22px; }
        .drawer-section { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); padding:12px 0 8px; border-top:1.5px solid var(--border); margin-top:4px; }
        .drawer-row { display:flex; flex-direction:column; gap:3px; margin-bottom:14px; }
        .drawer-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
        .drawer-val   { font-size:13.5px; color:var(--text); line-height:1.6; }
        .drawer-footer { padding:18px 22px; border-top:1.5px solid var(--border); flex-shrink:0; display:flex; flex-direction:column; gap:8px; }
        .status-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
        .status-opt {
          border:1.5px solid var(--border); border-radius:var(--radius-sm);
          padding:9px 10px; font-size:12px; font-weight:700;
          cursor:pointer; transition:all .2s; background:transparent;
          color:var(--muted); font-family:'DM Sans',sans-serif; text-align:center;
        }
        .status-opt.active { color:#fff; }
        .action-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .action-btn {
          display:flex; align-items:center; justify-content:center; gap:7px;
          padding:10px; border-radius:var(--radius-sm);
          font-size:12.5px; font-weight:700; cursor:pointer;
          transition:all .2s; border:1.5px solid;
          font-family:'DM Sans',sans-serif;
        }
        .del-app-btn {
          display:flex; align-items:center; justify-content:center; gap:6px;
          background:transparent; color:var(--red); border:1.5px solid rgba(239,68,68,.25);
          border-radius:var(--radius-sm); padding:9px;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
          cursor:pointer; transition:all .2s;
        }
        .del-app-btn:hover { background:var(--red-light); }

        /* ── Modals ── */
        .modal-backdrop { position:fixed; inset:0; background:rgba(26,31,58,.5); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; animation:fadeIn .2s; backdrop-filter:blur(3px); }
        .modal {
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius); padding:28px; max-width:400px; width:100%;
          box-shadow:var(--shadow-lg); animation:scaleIn .25s cubic-bezier(.34,1.56,.64,1);
        }
        .email-modal { max-width:560px !important; }
        .modal h3 { font-family:'Plus Jakarta Sans',sans-serif; font-size:17px; font-weight:800; margin-bottom:8px; color:var(--text); }
        .modal p  { font-size:13.5px; color:var(--muted); margin-bottom:22px; line-height:1.7; }
        .modal-actions { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
        .btn-confirm-del { background:var(--red); border:none; color:#fff; border-radius:var(--radius-sm); padding:9px 20px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:opacity .2s; }
        .btn-confirm-del:hover { opacity:.85; }

        /* Email modal parts */
        .email-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .email-field label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
        .email-to-pill { background:var(--surface2); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; font-size:13px; }
        .tpl-btn {
          padding:5px 12px; border-radius:999px; font-size:11px; font-weight:600;
          border:1.5px solid var(--border); background:var(--surface2);
          color:var(--muted); cursor:pointer; transition:all .2s;
        }
        .tpl-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-light); }

        /* ── Misc ── */
        .btn-icon-close {
          background:var(--surface2); border:1.5px solid var(--border); color:var(--muted);
          border-radius:var(--radius-sm); padding:6px 13px; font-size:12px; font-weight:600;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px;
        }
        .btn-icon-close:hover { color:var(--text); border-color:var(--border-hover); background:var(--surface3); }
        .divider { border:none; border-top:1.5px solid var(--border); margin:22px 0; }
        .spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
        .empty { text-align:center; padding:60px 20px; color:var(--muted); }
        .empty-icon { font-size:38px; margin-bottom:12px; opacity:.4; }
        .empty p { font-size:13.5px; }
        .skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surface3) 50%,var(--surface) 75%); background-size:200% 100%; animation:shimmer 1.6s infinite; border-radius:var(--radius); height:88px; border:1.5px solid var(--border); }

        /* ── Toast ── */
        .toast {
          position:fixed; bottom:24px; right:20px; z-index:200;
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:var(--radius-sm); padding:13px 18px;
          font-size:13.5px; font-weight:500; display:flex; align-items:center; gap:10px;
          box-shadow:var(--shadow-lg); animation:toastIn .35s cubic-bezier(.34,1.56,.64,1);
          max-width:320px; color:var(--text);
        }
        .toast.success { border-color:rgba(34,197,94,.35); }
        .toast.error   { border-color:rgba(239,68,68,.35); }
        .toast-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .toast.success .toast-dot { background:var(--green); }
        .toast.error   .toast-dot { background:var(--red); }

        /* ── Animations ── */
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideIn  { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer  { to{ background-position:-200% 0 } }
        @keyframes spin     { to{ transform:rotate(360deg) } }
        @keyframes toastIn  { from{opacity:0;transform:translateY(16px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:var(--border); border-radius:999px; }
        ::-webkit-scrollbar-thumb:hover { background:var(--border-hover); }
      `}</style>

      <div className="jw">
        <div className="jw-scroll">
          {/* TOP BAR */}
          <div className="jw-topbar">
            <div style={{ animation: "fadeUp .4s ease both" }}>
              <h1 className="jw-title">
                Manage Jobs <span style={{ color: "var(--accent)" }}>&</span>{" "}
                Applications
              </h1>
              <p className="jw-subtitle">
                Post openings and review candidate pipelines
              </p>
            </div>
            {tab === "jobs" && (
              <button
                className={cls("btn-post", panelOpen && !editId && "cancel")}
                onClick={panelOpen && !editId ? closePanel : openCreate}
                style={{ animation: "fadeUp .4s .1s ease both" }}
              >
                {panelOpen && !editId ? (
                  <>
                    <span>✕</span> Cancel
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Post
                    a Job
                  </>
                )}
              </button>
            )}
          </div>

          {/* TABS */}
          <div style={{ animation: "fadeUp .4s .1s ease both" }}>
            <div className="tab-bar">
              <button
                className={cls("tab-btn", tab === "jobs" && "active")}
                onClick={() => setTab("jobs")}
              >
                <Ic
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                  size={13}
                />
                Jobs <span className="tab-count">{jobs.length}</span>
              </button>
              <button
                className={cls("tab-btn", tab === "applications" && "active")}
                onClick={() => setTab("applications")}
              >
                <Ic
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  size={13}
                />
                Applications{" "}
                <span className="tab-count">{apps.length || "—"}</span>
              </button>
            </div>
          </div>

          {/* ════ JOBS TAB ════ */}
          {tab === "jobs" && (
            <>
              {/* Stats */}
              <div className="stats-grid">
                {[
                  {
                    label: "Total Jobs",
                    val: stats.total,
                    sub: "All postings",
                    col: "col-blue",
                    bg: "bg-blue",
                    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
                  },
                  {
                    label: "Active",
                    val: stats.active,
                    sub: "Hiring now",
                    col: "col-green",
                    bg: "bg-green",
                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Closed",
                    val: stats.closed,
                    sub: "Not hiring",
                    col: "col-red",
                    bg: "bg-red",
                    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Departments",
                    val: stats.depts,
                    sub: "Across teams",
                    col: "col-violet",
                    bg: "bg-violet",
                    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                  },
                ].map((s, i) => (
                  <div
                    className="stat-card"
                    key={s.label}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={cls("stat-icon", s.bg)}>
                      <Ic
                        d={s.icon}
                        size={16}
                        style={{ color: `var(--${s.col.replace("col-", "")})` }}
                      />
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div className={cls("stat-val", s.col)}>{s.val}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Form panel */}
              <div
                className={cls("panel-wrap", panelOpen && "open")}
                ref={formRef}
              >
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      {editId ? "✏️ Edit Job Posting" : "📋 New Job Posting"}
                      <span
                        className={cls("panel-badge", editId ? "edit" : "new")}
                      >
                        {editId ? "Editing" : "New"}
                      </span>
                    </div>
                    <button className="btn-icon-close" onClick={closePanel}>
                      ✕ Close
                    </button>
                  </div>
                  <div className="form-grid">
                    {[
                      {
                        label: "Job Title",
                        key: "title",
                        placeholder: "e.g. Senior ML Engineer",
                        req: true,
                      },
                      {
                        label: "Department",
                        key: "department",
                        placeholder: "e.g. Engineering",
                        req: true,
                      },
                      {
                        label: "Location",
                        key: "location",
                        placeholder: "e.g. Kolkata / Remote",
                        req: true,
                      },
                    ].map((f) => (
                      <div className="field" key={f.key}>
                        <label>
                          {f.label} {f.req && <span className="req">*</span>}
                        </label>
                        <input
                          className="finput"
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                    <div className="field">
                      <label>Job Type</label>
                      <select
                        className="finput"
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                      >
                        {TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    {[
                      {
                        label: "Experience",
                        key: "experience",
                        placeholder: "e.g. 2+ years",
                      },
                      {
                        label: "Salary (optional)",
                        key: "salary",
                        placeholder: "e.g. ₹12–18 LPA",
                      },
                    ].map((f) => (
                      <div className="field" key={f.key}>
                        <label>{f.label}</label>
                        <input
                          className="finput"
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                    <div className="field">
                      <label>Status</label>
                      <select
                        className="finput"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {[
                      {
                        label: "Job Description *",
                        key: "description",
                        placeholder: "Describe the role…",
                        h: 90,
                      },
                      {
                        label: "Requirements (comma separated)",
                        key: "requirements",
                        placeholder: "e.g. Python, React",
                        h: 65,
                      },
                      {
                        label: "Responsibilities (comma sep.)",
                        key: "responsibilities",
                        placeholder: "e.g. Lead sprints, mentor devs",
                        h: 65,
                      },
                    ].map((f) => (
                      <div className="field span2" key={f.key}>
                        <label>{f.label}</label>
                        <textarea
                          className="finput"
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                          style={{ minHeight: f.h }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-actions">
                    <button className="btn-outline" onClick={closePanel}>
                      Cancel
                    </button>
                    <button
                      className={cls("btn-primary", editId && "violet")}
                      onClick={handleSubmit}
                      disabled={saving}
                    >
                      {saving && <span className="spinner" />}
                      {editId ? "Save Changes" : "Post Job"}
                    </button>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Filters */}
              <div className="filters">
                <div className="search-wrap">
                  <svg
                    className="search-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    className="search-input"
                    placeholder="Search jobs…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option>Active</option>
                  <option>Closed</option>
                </select>
                <select
                  className="filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All types</option>
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sec-title">
                Job Postings —{" "}
                <span>
                  {visible.length} of {jobs.length}
                </span>
              </div>

              <div className="job-list">
                {loadingJobs ? (
                  [1, 2, 3].map((i) => (
                    <div
                      className="skeleton"
                      key={i}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))
                ) : visible.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🔍</div>
                    <p>No jobs match your filters.</p>
                  </div>
                ) : (
                  visible.map((job, i) => (
                    <div
                      className="job-card"
                      key={job._id}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="card-top">
                        <div className="card-meta">
                          <div className="card-title">{job.title}</div>
                          <div className="card-dept">
                            <Ic
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                              size={11}
                            />
                            <b>{job.dept}</b>
                            <span style={{ color: "var(--border-hover)" }}>
                              ·
                            </span>
                            <Ic
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              size={11}
                            />
                            {job.location}
                          </div>
                        </div>
                        <div className="card-actions">
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(job)}
                          >
                            <Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4Z" />
                            Edit
                          </button>
                          <button
                            className="btn-del"
                            onClick={() => setDeleteConfirm(job._id)}
                          >
                            <Ic d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="card-tags">
                        <span
                          className={cls(
                            "badge",
                            statusBadge[job.isActive ? "Active" : "Closed"],
                          )}
                        >
                          <span className="badge-dot" />
                          {job.isActive ? "Active" : "Closed"}
                        </span>
                        <span
                          className={cls(
                            "badge",
                            typeBadge[job.type] || "badge-blue",
                          )}
                        >
                          {job.type}
                        </span>
                        {job.experience && (
                          <span className="badge badge-amber">
                            🕐 {job.experience}
                          </span>
                        )}
                        {job.salary && (
                          <span className="badge badge-teal">
                            ₹ {job.salary}
                          </span>
                        )}
                        {job.applications > 0 && (
                          <span className="badge badge-violet">
                            <Ic
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              size={10}
                            />
                            {job.applications} applied
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <div className="card-desc">{job.description}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ════ APPLICATIONS TAB ════ */}
          {tab === "applications" && (
            <>
              <div className="stats-grid">
                {[
                  {
                    label: "Total",
                    val: appStats.total,
                    sub: "All received",
                    col: "col-blue",
                    bg: "bg-blue",
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  },
                  {
                    label: "New",
                    val: appStats.new,
                    sub: "Needs review",
                    col: "col-blue",
                    bg: "bg-blue",
                    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                  },
                  {
                    label: "Shortlisted",
                    val: appStats.shortlisted,
                    sub: "Moving forward",
                    col: "col-green",
                    bg: "bg-green",
                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Rejected",
                    val: appStats.rejected,
                    sub: "Not selected",
                    col: "col-red",
                    bg: "bg-red",
                    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map((s, i) => (
                  <div
                    className="stat-card"
                    key={s.label}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className={cls("stat-icon", s.bg)}>
                      <Ic d={s.icon} size={16} />
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div className={cls("stat-val", s.col)}>{s.val}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="filters">
                <div className="search-wrap">
                  <svg
                    className="search-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    className="search-input"
                    placeholder="Search by name, email, job…"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value)}
                >
                  <option value="all">All status</option>
                  {APP_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {APP_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
                <select
                  className="filter-select"
                  value={appJob}
                  onChange={(e) => setAppJob(e.target.value)}
                >
                  <option value="all">All jobs</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sec-title">
                Applications —{" "}
                <span>
                  {visibleApps.length} of {apps.length}
                </span>
              </div>

              <div className="app-list">
                {loadingApps ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      className="skeleton"
                      key={i}
                      style={{ animationDelay: `${i * 0.08}s` }}
                    />
                  ))
                ) : visibleApps.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📭</div>
                    <p>No applications found.</p>
                  </div>
                ) : (
                  visibleApps.map((a, i) => {
                    const meta =
                      APP_STATUS_META[a.status] || APP_STATUS_META.new;
                    const bg = avatarColor(a.name);
                    return (
                      <div
                        className={cls(
                          "app-card",
                          selectedApp?._id === a._id && "selected",
                        )}
                        key={a._id}
                        onClick={() => setSelectedApp(a)}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div
                          className="app-avatar"
                          style={{ background: bg + "20", color: bg }}
                        >
                          {initials(a.name)}
                        </div>
                        <div className="app-info">
                          <div className="app-name">{a.name}</div>
                          <div className="app-sub">
                            {a.email} · {a.job?.title || "Unknown Job"}
                          </div>
                        </div>
                        <div className="app-right">
                          <span
                            className="app-status"
                            style={{
                              color: meta.color,
                              background: meta.bg,
                              borderColor: meta.border,
                            }}
                          >
                            {meta.label}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>
                            {new Date(a.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ════ APPLICATION DETAIL DRAWER ════ */}
      {selectedApp && (
        <>
          <div
            className="drawer-backdrop"
            onClick={() => setSelectedApp(null)}
          />
          <div className="drawer">
            <div className="drawer-header">
              <span className="drawer-title">Application Detail</span>
              <button
                className="btn-icon-close"
                onClick={() => setSelectedApp(null)}
              >
                ✕ Close
              </button>
            </div>

            <div className="drawer-body">
              {/* Avatar card */}
              {(() => {
                const bg = avatarColor(selectedApp.name);
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 18,
                      padding: "16px",
                      background: "var(--surface2)",
                      borderRadius: 14,
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: bg + "20",
                        color: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 17,
                        flexShrink: 0,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                      }}
                    >
                      {initials(selectedApp.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                        }}
                      >
                        {selectedApp.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedApp.email}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedApp.email);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        padding: "6px 11px",
                        borderRadius: 8,
                        border: "1.5px solid var(--border)",
                        background: "var(--surface)",
                        color: copied ? "var(--green)" : "var(--muted)",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        transition: "all .2s",
                        flexShrink: 0,
                      }}
                    >
                      <Ic
                        d={
                          copied
                            ? "M5 13l4 4L19 7"
                            : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        }
                        size={12}
                      />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div className="action-row" style={{ marginBottom: 18 }}>
                <button
                  className="action-btn"
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    color: "var(--accent)",
                    borderColor: "rgba(91,141,238,.3)",
                    background: "var(--accent-light)",
                  }}
                >
                  <Ic
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    size={14}
                  />
                  Send Email
                </button>
                {hasCV(selectedApp) ? (
                  <button
                    className="action-btn"
                    onClick={() => setShowCVModal(true)}
                    style={{
                      color: "var(--violet)",
                      borderColor: "rgba(139,92,246,.3)",
                      background: "rgba(139,92,246,.08)",
                    }}
                  >
                    <Ic
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      size={14}
                    />
                    View Resume
                  </button>
                ) : (
                  <button
                    className="action-btn"
                    disabled
                    style={{
                      color: "var(--muted)",
                      borderColor: "var(--border)",
                      background: "var(--surface2)",
                      opacity: 0.55,
                    }}
                  >
                    <Ic
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      size={14}
                    />
                    No Resume
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="drawer-row">
                <div className="drawer-label">Applied For</div>
                <div className="drawer-val" style={{ fontWeight: 600 }}>
                  {selectedApp.job?.title || "—"}
                </div>
              </div>
              {selectedApp.phone && (
                <div className="drawer-row">
                  <div className="drawer-label">Phone</div>
                  <div className="drawer-val">{selectedApp.phone}</div>
                </div>
              )}
              {selectedApp.linkedin && (
                <div className="drawer-row">
                  <div className="drawer-label">LinkedIn</div>
                  <a
                    href={selectedApp.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--accent)",
                      fontSize: 13.5,
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    View Profile ↗
                  </a>
                </div>
              )}
              {selectedApp.coverLetter && (
                <div className="drawer-row">
                  <div className="drawer-label">Cover Letter</div>
                  <div
                    className="drawer-val"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}
              <div className="drawer-row">
                <div className="drawer-label">Applied On</div>
                <div className="drawer-val">
                  {new Date(selectedApp.createdAt).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Admin note */}
              <div className="drawer-section">Admin Notes</div>
              <textarea
                className="finput"
                placeholder="Add internal notes about this candidate…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ minHeight: 80, fontSize: 13, marginBottom: 8 }}
              />
              <button
                className="btn-primary"
                onClick={saveNote}
                disabled={savingNote}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                {savingNote ? (
                  <>
                    <span className="spinner" />
                    Saving…
                  </>
                ) : (
                  "Save Note"
                )}
              </button>

              {/* Status update */}
              <div className="drawer-section">Update Status</div>
              <div className="status-grid">
                {APP_STATUSES.map((s) => {
                  const meta = APP_STATUS_META[s];
                  const isActive = selectedApp.status === s;
                  return (
                    <button
                      key={s}
                      className={cls("status-opt", isActive && "active")}
                      onClick={() => updateAppStatus(selectedApp._id, s)}
                      disabled={updatingStatus}
                      style={
                        isActive
                          ? {
                              background: meta.bg,
                              borderColor: meta.border,
                              color: meta.color,
                              boxShadow: `0 2px 8px ${meta.border}`,
                            }
                          : {}
                      }
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 16 }}>
                <button
                  className="del-app-btn"
                  style={{ width: "100%" }}
                  onClick={() => setDeleteAppConfirm(selectedApp._id)}
                >
                  <Ic
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    size={13}
                  />
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Job Posting?</h3>
            <p>
              This action cannot be undone. All associated data will be
              permanently removed.
            </p>
            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-del" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete application modal */}
      {deleteAppConfirm && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteAppConfirm(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Application?</h3>
            <p>
              This will permanently remove the candidate's application and all
              associated data.
            </p>
            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setDeleteAppConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-del" onClick={deleteApp}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email modal */}
      {showEmailModal && selectedApp && (
        <EmailModal
          app={selectedApp}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* CV Preview modal */}
      {showCVModal && selectedApp && (
        <CVPreviewModal
          appId={selectedApp._id}
          filename={selectedApp.cv?.filename}
          token={token}
          onClose={() => setShowCVModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={cls("toast", toast.type)}>
          <span className="toast-dot" />
          {toast.msg}
        </div>
      )}
    </>
  );
}
