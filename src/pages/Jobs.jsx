import { useEffect, useState, useRef } from "react";

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
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.25)",
    label: "New",
  },
  reviewing: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    label: "Reviewing",
  },
  shortlisted: {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.12)",
    border: "rgba(34,211,160,0.25)",
    label: "Shortlisted",
  },
  rejected: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.25)",
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
      <div
        className="modal email-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            ✉️ Reply to {app.name}
          </div>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="email-field">
          <label>To</label>
          <div className="email-to-pill">
            <span style={{ color: "var(--accent)" }}>{app.name}</span>
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
            style={{ minHeight: 200, resize: "vertical" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            Quick Templates
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => setBody(t.body)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  background: "var(--surface2)",
                  color: "var(--muted)",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions" style={{ gap: 8 }}>
          <button
            className="btn-cancel"
            onClick={() => {
              navigator.clipboard.writeText(body);
            }}
          >
            <Ic
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              size={12}
            />
            Copy
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={openMailClient}>
            <Ic
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              size={13}
            />
            Open in Mail App
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── CV Download Helper ──────────────────────────────────────────────────────
 * Backend stores CV as base64 inside application.cv.data
 * The /cv endpoint streams the file as a download.
 * We hit that authenticated endpoint and trigger a browser download.
 */
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

/* ── CV Preview Modal ── */
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
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
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
              className="btn-save"
              style={{ padding: "6px 14px", fontSize: 12 }}
              onClick={() => downloadCV(appId, filename, token)}
            >
              <Ic
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                size={12}
              />
              Download
            </button>
            <button className="btn-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#1a1d24",
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
                className="btn-save"
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

  /* ── jobs state ── */
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

  /* ── applications state ── */
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

  /* ── toast ── */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* sync note when selectedApp changes */
  useEffect(() => {
    if (selectedApp) setNote(selectedApp.note || "");
  }, [selectedApp?._id]);

  /* ════ JOBS ════ */
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

  /* ════ APPLICATIONS ════ */
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
        const updated = await r.json();
        showToast(`Status → ${status}`);
        // ── update in both list and drawer ──
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

  /* ── Save admin note via PATCH /:id/status reuses same route?
   * Your route file doesn't have a generic PATCH /:id — add this to your
   * applicationRoutes.js:
   *   router.patch("/:id", auth, updateNote);   ← new route
   * And in applicationController.js:
   *   exports.updateNote = async (req,res) => {
   *     const app = await Application.findByIdAndUpdate(req.params.id, { note: req.body.note }, { new: true });
   *     res.json(app);
   *   };
   */
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

  const avatarColor = (name) => {
    const colors = [
      "#4f7cff",
      "#22d3a0",
      "#f59e0b",
      "#8b5cf6",
      "#f43f5e",
      "#14b8a6",
    ];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };
  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  /* ── Check if this application has a CV stored ── */
  const hasCV = (app) => !!(app?.cv?.filename || app?.cv?.size);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --bg:#0a0c10; --surface:#111318; --surface2:#181c24;
          --border:#232733; --border-hover:#3a4155;
          --text:#e8ecf4; --muted:#7a8099;
          --accent:#4f7cff; --accent-glow:rgba(79,124,255,.18);
          --green:#22c55e; --red:#f43f5e; --amber:#f59e0b;
          --violet:#8b5cf6; --teal:#14b8a6;
          --radius:14px; --radius-sm:8px;
          --shadow:0 4px 24px rgba(0,0,0,.4);
          font-family:'DM Sans',sans-serif;
        }
        .jw { height:100%; display:flex; flex-direction:column; overflow:hidden; background:var(--bg); color:var(--text); }
        .jw-scroll { flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:20px 20px 60px; }
        @media(min-width:768px){ .jw-scroll{ padding:28px 32px 80px; } }
        .jw-topbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:22px; }
        .jw-title { font-family:'Syne',sans-serif; font-size:clamp(18px,3.5vw,26px); font-weight:800; letter-spacing:-.5px; }
        .jw-title span { color:var(--accent); }
        .tab-bar { display:flex; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; margin-bottom:22px; width:fit-content; }
        .tab-btn { display:flex; align-items:center; gap:7px; padding:8px 16px; border-radius:7px; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; background:transparent; color:var(--muted); white-space:nowrap; }
        .tab-btn.active { background:var(--accent); color:#fff; box-shadow:0 2px 12px var(--accent-glow); }
        .tab-btn .tab-count { background:rgba(255,255,255,.18); border-radius:999px; padding:1px 7px; font-size:11px; font-weight:700; }
        .tab-btn:not(.active) .tab-count { background:var(--surface2); color:var(--muted); }
        .stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:20px; }
        @media(min-width:540px){ .stats-grid{ grid-template-columns:repeat(4,1fr); } }
        .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px 16px; transition:border-color .2s,transform .2s; }
        .stat-card:hover { border-color:var(--border-hover); transform:translateY(-2px); }
        .stat-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
        .stat-val { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; line-height:1; }
        .stat-sub { font-size:10px; color:var(--muted); margin-top:3px; }
        .col-green{color:var(--green)} .col-red{color:var(--red)} .col-accent{color:var(--accent)} .col-violet{color:var(--violet)} .col-amber{color:var(--amber)}
        .btn-post { display:flex; align-items:center; gap:7px; background:var(--accent); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px 18px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; }
        .btn-post:hover { background:#3a68e8; transform:translateY(-1px); box-shadow:0 0 0 6px var(--accent-glow); }
        .panel-wrap { overflow:hidden; transition:max-height .45s cubic-bezier(.4,0,.2,1),opacity .35s; max-height:0; opacity:0; }
        .panel-wrap.open { max-height:2400px; opacity:1; }
        .panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; margin-bottom:22px; }
        .panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; flex-wrap:wrap; gap:8px; }
        .panel-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; display:flex; align-items:center; gap:8px; }
        .panel-badge { background:var(--accent); color:#fff; border-radius:999px; padding:2px 10px; font-size:10px; font-weight:700; }
        .panel-badge.edit { background:var(--violet); }
        .btn-close { background:var(--surface2); border:1px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:6px 12px; font-size:12px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; }
        .btn-close:hover { color:var(--text); border-color:var(--border-hover); }
        .form-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:580px){ .form-grid{ grid-template-columns:1fr 1fr; } }
        .field { display:flex; flex-direction:column; gap:5px; }
        .field.span2 { grid-column:1/-1; }
        .field label { font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
        .field label .req { color:var(--red); }
        .finput { background:var(--surface2); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:13.5px; padding:10px 13px; outline:none; transition:border-color .2s,box-shadow .2s; width:100%; resize:vertical; }
        .finput::placeholder { color:#444c65; }
        .finput:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        textarea.finput { min-height:80px; }
        .form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:18px; flex-wrap:wrap; }
        .btn-cancel { background:transparent; border:1.5px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:9px 20px; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; }
        .btn-cancel:hover { border-color:var(--border-hover); color:var(--text); }
        .btn-save { background:var(--accent); border:none; color:#fff; border-radius:var(--radius-sm); padding:9px 24px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:7px; }
        .btn-save.editing { background:var(--violet); }
        .btn-save:hover:not(:disabled) { transform:translateY(-1px); }
        .btn-save:disabled { opacity:.6; cursor:not-allowed; }
        .filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; align-items:center; }
        .search-wrap { flex:1; min-width:160px; position:relative; }
        .search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
        .search-input { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; padding:9px 13px 9px 35px; outline:none; width:100%; transition:border-color .2s,box-shadow .2s; }
        .search-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        .search-input::placeholder { color:#444c65; }
        .filter-select { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:12.5px; padding:9px 13px; outline:none; cursor:pointer; transition:border-color .2s; }
        .filter-select:focus { border-color:var(--accent); }
        .sec-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--muted); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
        .sec-title span { color:var(--text); }
        .job-card { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius); padding:16px 18px; display:flex; flex-direction:column; gap:10px; transition:border-color .25s,transform .2s,box-shadow .25s; animation:fadeUp .35s ease both; }
        .job-card:hover { border-color:var(--border-hover); transform:translateY(-2px); box-shadow:var(--shadow); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; flex-wrap:wrap; }
        .card-meta { flex:1; min-width:0; }
        .card-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .card-dept { font-size:12.5px; color:var(--muted); }
        .card-dept b { color:var(--text); font-weight:600; }
        .card-tags { display:flex; flex-wrap:wrap; gap:5px; }
        .card-actions { display:flex; gap:7px; flex-shrink:0; }
        .card-desc { font-size:12.5px; color:var(--muted); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .badge { display:inline-flex; align-items:center; gap:4px; border-radius:999px; padding:3px 10px; font-size:10.5px; font-weight:700; letter-spacing:.04em; }
        .badge-green  { background:rgba(34,197,94,.12);  color:var(--green);  border:1px solid rgba(34,197,94,.25); }
        .badge-red    { background:rgba(244,63,94,.12);  color:var(--red);    border:1px solid rgba(244,63,94,.25); }
        .badge-blue   { background:rgba(79,124,255,.12); color:var(--accent); border:1px solid rgba(79,124,255,.25); }
        .badge-violet { background:rgba(139,92,246,.12); color:var(--violet); border:1px solid rgba(139,92,246,.25); }
        .badge-amber  { background:rgba(245,158,11,.12); color:var(--amber);  border:1px solid rgba(245,158,11,.25); }
        .badge-teal   { background:rgba(20,184,166,.12); color:var(--teal);   border:1px solid rgba(20,184,166,.25); }
        .badge-dot { width:5px; height:5px; border-radius:50%; background:currentColor; display:inline-block; }
        .btn-edit { background:var(--surface2); border:1.5px solid var(--border); color:var(--text); border-radius:var(--radius-sm); padding:6px 13px; font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; }
        .btn-edit:hover { border-color:var(--accent); background:rgba(79,124,255,.08); color:var(--accent); }
        .btn-del { background:var(--surface2); border:1.5px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:6px 13px; font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; }
        .btn-del:hover { border-color:var(--red); background:rgba(244,63,94,.08); color:var(--red); }
        .app-list { display:flex; flex-direction:column; gap:8px; }
        .app-card { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius); padding:14px 16px; display:flex; align-items:center; gap:12px; cursor:pointer; transition:all .25s; animation:fadeUp .3s ease both; }
        .app-card:hover { border-color:var(--border-hover); transform:translateY(-1px); box-shadow:var(--shadow); }
        .app-card.selected { border-color:var(--accent); background:rgba(79,124,255,.05); }
        .app-avatar { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justifyContent:center; font-weight:700; font-size:14px; flex-shrink:0; }
        .app-info { flex:1; min-width:0; }
        .app-name { font-weight:600; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:2px; }
        .app-sub { font-size:12px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .app-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
        .app-status { display:inline-flex; align-items:center; gap:4px; border-radius:999px; padding:3px 10px; font-size:10px; font-weight:700; letter-spacing:.04em; border:1px solid; }
        .drawer-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:50; animation:fadeIn .2s; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .drawer { position:fixed; top:0; right:0; height:100%; width:min(460px,100vw); background:var(--surface); border-left:1px solid var(--border); z-index:51; display:flex; flex-direction:column; animation:slideIn .28s cubic-bezier(.4,0,.2,1); overflow:hidden; }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .drawer-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); flex-shrink:0; }
        .drawer-body { flex:1; overflow-y:auto; padding:20px; }
        .drawer-row { display:flex; flex-direction:column; gap:3px; margin-bottom:14px; }
        .drawer-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-bottom:3px; }
        .drawer-val { font-size:13.5px; color:var(--text); line-height:1.6; }
        .drawer-footer { padding:16px 20px; border-top:1px solid var(--border); flex-shrink:0; display:flex; flex-direction:column; gap:8px; }
        .status-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
        .status-opt { border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:8px 10px; font-size:12px; font-weight:700; cursor:pointer; transition:all .2s; background:transparent; color:var(--muted); font-family:'DM Sans',sans-serif; text-align:center; }
        .status-opt.active { color:#fff; }
        .del-app-btn { display:flex; align-items:center; justify-content:center; gap:6px; background:transparent; color:var(--red); border:1.5px solid rgba(244,63,94,.3); border-radius:var(--radius-sm); padding:9px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; }
        .del-app-btn:hover { background:rgba(244,63,94,.08); }
        .action-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .action-btn { display:flex; align-items:center; justify-content:center; gap:7px; padding:10px; border-radius:var(--radius-sm); font-size:12.5px; font-weight:700; cursor:pointer; transition:all .2s; border:1.5px solid; font-family:'DM Sans',sans-serif; }
        .drawer-section { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); padding:10px 0 8px; border-top:1px solid var(--border); margin-top:4px; }
        .email-modal { max-width:560px !important; }
        .email-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
        .email-field label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
        .email-to-pill { background:var(--surface2); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:9px 13px; font-size:13px; }
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; animation:fadeIn .2s; }
        .modal { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius); padding:26px; max-width:360px; width:100%; box-shadow:0 24px 60px rgba(0,0,0,.6); animation:scaleIn .2s cubic-bezier(.34,1.56,.64,1); }
        @keyframes scaleIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        .modal h3 { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:8px; }
        .modal p { font-size:13.5px; color:var(--muted); margin-bottom:20px; line-height:1.6; }
        .modal-actions { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
        .btn-confirm-del { background:var(--red); border:none; color:#fff; border-radius:var(--radius-sm); padding:9px 20px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:opacity .2s; }
        .btn-confirm-del:hover { opacity:.85; }
        .empty { text-align:center; padding:50px 20px; color:var(--muted); }
        .empty-icon { font-size:36px; margin-bottom:10px; opacity:.45; }
        .empty p { font-size:13.5px; }
        .skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:var(--radius); height:80px; }
        @keyframes shimmer { to{ background-position:-200% 0; } }
        .toast { position:fixed; bottom:24px; right:18px; z-index:200; background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:12px 16px; font-size:13.5px; font-weight:500; display:flex; align-items:center; gap:9px; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:toastIn .35s cubic-bezier(.34,1.56,.64,1); max-width:300px; }
        @keyframes toastIn { from{opacity:0;transform:translateY(14px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .toast.success { border-color:rgba(34,197,94,.4); }
        .toast.error   { border-color:rgba(244,63,94,.4); }
        .toast-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .toast.success .toast-dot { background:var(--green); }
        .toast.error   .toast-dot { background:var(--red); }
        .divider { border:none; border-top:1px solid var(--border); margin:20px 0; }
        .spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
        @keyframes spin { to{ transform:rotate(360deg); } }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:var(--border); border-radius:999px; }
      `}</style>

      <div className="jw">
        <div className="jw-scroll">
          {/* TOP BAR */}
          <div className="jw-topbar">
            <div>
              <h1 className="jw-title">
                Manage Your Job <span>&</span> Applications
              </h1>
              <p
                style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}
              >
                Manage postings and review candidate applications
              </p>
            </div>
            {tab === "jobs" && (
              <button
                className="btn-post"
                onClick={panelOpen && !editId ? closePanel : openCreate}
              >
                {panelOpen && !editId ? (
                  <>
                    <span>✕</span> Cancel
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> Post
                    a Job
                  </>
                )}
              </button>
            )}
          </div>

          {/* TABS */}
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

          {/* ════ JOBS TAB ════ */}
          {tab === "jobs" && (
            <>
              <div className="stats-grid">
                {[
                  {
                    label: "Total Jobs",
                    val: stats.total,
                    sub: "All postings",
                    col: "col-accent",
                  },
                  {
                    label: "Active",
                    val: stats.active,
                    sub: "Hiring now",
                    col: "col-green",
                  },
                  {
                    label: "Closed",
                    val: stats.closed,
                    sub: "Not hiring",
                    col: "col-red",
                  },
                  {
                    label: "Departments",
                    val: stats.depts,
                    sub: "Across teams",
                    col: "col-violet",
                  },
                ].map((s) => (
                  <div className="stat-card" key={s.label}>
                    <div className="stat-label">{s.label}</div>
                    <div className={cls("stat-val", s.col)}>{s.val}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div
                className={cls("panel-wrap", panelOpen && "open")}
                ref={formRef}
              >
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      {editId ? "✏️ Edit Job Posting" : "📋 New Job Posting"}
                      <span className={cls("panel-badge", editId && "edit")}>
                        {editId ? "Editing" : "New"}
                      </span>
                    </div>
                    <button className="btn-close" onClick={closePanel}>
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
                      },
                      {
                        label: "Requirements (comma separated)",
                        key: "requirements",
                        placeholder: "e.g. Python, React",
                      },
                      {
                        label: "Responsibilities (comma separated)",
                        key: "responsibilities",
                        placeholder: "e.g. Lead sprints, mentor junior devs",
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
                          style={{
                            minHeight: f.key === "description" ? 80 : 65,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="form-actions">
                    <button className="btn-cancel" onClick={closePanel}>
                      Cancel
                    </button>
                    <button
                      className={cls("btn-save", editId && "editing")}
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

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                    <p>No jobs found.</p>
                  </div>
                ) : (
                  visible.map((job, i) => (
                    <div
                      className="job-card"
                      key={job._id}
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="card-top">
                        <div className="card-meta">
                          <div className="card-title">{job.title}</div>
                          <div className="card-dept">
                            <b>{job.dept}</b> · {job.location}
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
                    col: "col-accent",
                  },
                  {
                    label: "New",
                    val: appStats.new,
                    sub: "Needs review",
                    col: "col-accent",
                  },
                  {
                    label: "Shortlisted",
                    val: appStats.shortlisted,
                    sub: "Moving forward",
                    col: "col-green",
                  },
                  {
                    label: "Rejected",
                    val: appStats.rejected,
                    sub: "Not selected",
                    col: "col-red",
                  },
                ].map((s) => (
                  <div className="stat-card" key={s.label}>
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
                          style={{
                            background: bg + "22",
                            color: bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
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
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Application Detail
              </div>
              <button
                className="btn-close"
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
                      marginBottom: 16,
                      padding: "14px 16px",
                      background: "var(--surface2)",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: bg + "22",
                        color: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 17,
                        flexShrink: 0,
                      }}
                    >
                      {initials(selectedApp.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>
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
                        padding: "6px 10px",
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
              <div className="action-row" style={{ marginBottom: 16 }}>
                <button
                  className="action-btn"
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    background: "rgba(79,124,255,.1)",
                    borderColor: "rgba(79,124,255,.3)",
                    color: "var(--accent)",
                  }}
                >
                  <Ic
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    size={14}
                  />
                  Reply via Email
                </button>

                {/* ── CV Button: uses authenticated download ── */}
                {hasCV(selectedApp) ? (
                  <button
                    className="action-btn"
                    onClick={() => setShowCVModal(true)}
                    style={{
                      background: "rgba(34,211,160,.1)",
                      borderColor: "rgba(34,211,160,.3)",
                      color: "#22d3a0",
                    }}
                  >
                    <Ic
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      size={14}
                    />
                    View Resume
                  </button>
                ) : (
                  <div
                    className="action-btn"
                    style={{
                      background: "rgba(255,255,255,.03)",
                      borderColor: "var(--border)",
                      color: "var(--muted)",
                      cursor: "default",
                      fontSize: 11,
                    }}
                  >
                    <Ic
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      size={14}
                    />
                    No Resume
                  </div>
                )}
              </div>

              {/* Job details */}
              <div className="drawer-section">Job Details</div>
              {[
                { label: "Applied For", val: selectedApp.job?.title || "—" },
                { label: "Department", val: selectedApp.job?.dept || "—" },
                { label: "Location", val: selectedApp.job?.location || "—" },
              ].map((f) => (
                <div className="drawer-row" key={f.label}>
                  <div className="drawer-label">{f.label}</div>
                  <div className="drawer-val">{f.val}</div>
                </div>
              ))}

              {/* Candidate info */}
              <div className="drawer-section">Candidate Info</div>
              {[
                { label: "Phone", val: selectedApp.phone || "—" },
                { label: "Experience", val: selectedApp.experience || "—" },
                {
                  label: "LinkedIn",
                  val: selectedApp.linkedin || null,
                  link: true,
                },
                {
                  label: "Portfolio",
                  val: selectedApp.portfolio || null,
                  link: true,
                },
                {
                  label: "Applied On",
                  val: new Date(selectedApp.createdAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  ),
                },
              ]
                .filter((f) => f.val && f.val !== "—")
                .map((f) => (
                  <div className="drawer-row" key={f.label}>
                    <div className="drawer-label">{f.label}</div>
                    <div className="drawer-val">
                      {f.link ? (
                        <a
                          href={f.val}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "var(--accent)",
                            textDecoration: "none",
                          }}
                        >
                          {f.val}
                        </a>
                      ) : (
                        f.val
                      )}
                    </div>
                  </div>
                ))}

              {/* Cover letter */}
              {selectedApp.coverLetter && (
                <>
                  <div className="drawer-section">Cover Letter</div>
                  <div
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      fontSize: 13,
                      color: "var(--text)",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      marginBottom: 14,
                    }}
                  >
                    {selectedApp.coverLetter}
                  </div>
                </>
              )}

              {/* Internal notes */}
              <div className="drawer-section">Internal Notes</div>
              <div style={{ marginBottom: 14 }}>
                <textarea
                  className="finput"
                  placeholder="Add private notes about this candidate…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ minHeight: 80, fontSize: 13 }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 6,
                  }}
                >
                  <button
                    className="btn-save"
                    onClick={saveNote}
                    disabled={savingNote}
                    style={{ padding: "7px 18px", fontSize: 12 }}
                  >
                    {savingNote && <span className="spinner" />}
                    Save Note
                  </button>
                </div>
              </div>
            </div>

            {/* Footer: status + delete */}
            <div className="drawer-footer">
              <div className="drawer-label">Update Status</div>
              <div className="status-grid">
                {APP_STATUSES.map((s) => {
                  const m = APP_STATUS_META[s];
                  const isActive = selectedApp.status === s;
                  return (
                    <button
                      key={s}
                      className={cls("status-opt", isActive && "active")}
                      onClick={() => updateAppStatus(selectedApp._id, s)}
                      disabled={updatingStatus}
                      style={{
                        borderColor: isActive ? m.color : undefined,
                        background: isActive ? m.color : undefined,
                        color: isActive ? "#fff" : m.color,
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <button
                className="del-app-btn"
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
        </>
      )}

      {/* Modals */}
      {showEmailModal && selectedApp && (
        <EmailModal
          app={selectedApp}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {showCVModal && selectedApp && (
        <CVPreviewModal
          appId={selectedApp._id}
          filename={selectedApp.cv?.filename}
          token={token}
          onClose={() => setShowCVModal(false)}
        />
      )}

      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🗑️</div>
            <h3>Delete Job Posting?</h3>
            <p>This cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-del" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAppConfirm && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteAppConfirm(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🗑️</div>
            <h3>Delete Application?</h3>
            <p>
              This will permanently delete the candidate's application and
              uploaded resume.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteAppConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-del" onClick={deleteApp}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={cls("toast", toast.type)}>
          <div className="toast-dot" />
          {toast.msg}
        </div>
      )}
    </>
  );
}
