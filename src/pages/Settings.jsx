import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "profile", label: "Profile", icon: "👤", color: "#5eead4" },
  { id: "notifications", label: "Notifications", icon: "🔔", color: "#fbbf24" },
  { id: "security", label: "Security", icon: "🔒", color: "#818cf8" },
  { id: "portal", label: "Portal", icon: "🌐", color: "#34d399" },
  { id: "danger", label: "Danger Zone", icon: "⚠️", color: "#f87171" },
];

/* ── tiny reusable components ─────────────────────────────────── */

function Toggle({ value, onChange, accent = "#5eead4" }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        background: value ? accent : "rgba(255,255,255,0.1)",
        position: "relative",
        transition: "background 0.25s",
        boxShadow: value ? `0 0 10px ${accent}55` : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
        }}
      />
    </button>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        gap: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", margin: 0 }}
        >
          {label}
        </p>
        {desc && (
          <p
            style={{
              fontSize: 12,
              color: "#475569",
              margin: "3px 0 0",
              lineHeight: 1.5,
            }}
          >
            {desc}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Card({ title, accent = "#5eead4", children }) {
  return (
    <div
      style={{
        background: "#0d1526",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 16,
        overflow: "hidden",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
      }}
    >
      {title && (
        <div
          style={{
            padding: "11px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: 10,
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "0 18px" }}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  accent = "#5eead4",
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          display: "block",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: focused ? accent : "#334155",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          border: `1px solid ${focused ? accent + "44" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          color: "#e2e8f0",
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${accent}14` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
    </div>
  );
}

function DangerBtn({ label, desc, btnLabel, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid rgba(248,113,113,0.07)",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", margin: 0 }}
        >
          {label}
        </p>
        {desc && (
          <p style={{ fontSize: 12, color: "#334155", margin: "3px 0 0" }}>
            {desc}
          </p>
        )}
      </div>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flexShrink: 0,
          padding: "7px 14px",
          borderRadius: 9,
          border: "1px solid rgba(248,113,113,0.25)",
          background: hov ? "rgba(248,113,113,0.14)" : "rgba(248,113,113,0.06)",
          color: "#f87171",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {btnLabel}
      </button>
    </div>
  );
}

/* ── Main Settings component ──────────────────────────────────── */

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    orgName: "Accelia Clinical Solutions",
    email: "admin@accelia.in",
    phone: "+91 98300 00000",
    website: "https://accelia.in",
  });
  const [notifs, setNotifs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    trialAlerts: true,
    jobAlerts: true,
    weeklyDigest: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
    apiAccess: false,
  });
  const [portal, setPortal] = useState({
    publicPortal: true,
    allowRegistration: true,
    autoPublish: false,
    seoEnabled: true,
    maintenanceMode: false,
  });

  const setN = (k) => (v) => setNotifs((s) => ({ ...s, [k]: v }));
  const setSec = (k) => (v) => setSecurity((s) => ({ ...s, [k]: v }));
  const setP = (k) => (v) => setPortal((s) => ({ ...s, [k]: v }));
  const setProf = (k) => (v) => setProfile((s) => ({ ...s, [k]: v }));

  const tab = tabs.find((t) => t.id === activeTab);
  const accent = tab?.color || "#5eead4";

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .settings-root {
          display: flex;
          flex-direction: column;
          height: 100%;          /* fills the <main> from App.jsx */
          background: #080f1e;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          overflow: hidden;      /* children handle their own scroll */
        }

        /* ── top bar ── */
        .settings-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          height: 54px;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(8,15,30,0.97);
          backdrop-filter: blur(14px);
        }

        .back-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: #94a3b8; cursor: pointer;
          transition: all 0.2s; flex-shrink: 0;
        }
        .back-btn:hover { background: rgba(255,255,255,0.09); color: #f1f5f9; }

        .settings-topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800; color: #f1f5f9;
        }

        /* ── tab bar ── */
        .settings-tabbar {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: #0b1120;
          flex-shrink: 0;
          padding: 0 10px;
        }
        .settings-tabbar::-webkit-scrollbar { display: none; }

        .settings-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 13px; border: none; cursor: pointer;
          font-size: 12.5px; font-weight: 500; background: transparent;
          color: #475569; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
          white-space: nowrap; border-bottom: 2px solid transparent;
          margin-bottom: -1px; border-radius: 0;
        }
        .settings-tab:hover { color: #94a3b8; }
        .settings-tab.active { font-weight: 700; border-bottom-color: currentColor; }

        /* ── scrollable content ── */
        .settings-scroll {
          flex: 1;
          min-height: 0;         /* critical for flex scroll */
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 16px 120px; /* 120px bottom = save bar + mobile nav clearance */
        }

        /* ── save bar ── */
        .settings-savebar {
          position: sticky;
          bottom: 0;
          padding: 12px 16px;
          background: rgba(8,15,30,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          display: flex; align-items: center;
          justify-content: flex-end; gap: 12px;
          flex-shrink: 0;
          z-index: 50;
        }

        .save-btn {
          padding: 11px 28px; border-radius: 11px; border: none;
          font-size: 14px; font-weight: 700; min-width: 130px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.2s;
        }

        .twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

        @keyframes fadeup {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fadeup { animation: fadeup 0.3s ease forwards; }

        /* mobile: single column grid */
        @media (max-width: 500px) {
          .twocol { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="settings-root">
        {/* ── Top bar with back button ───────────────────────── */}
        <div className="settings-topbar">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{ width: 16, height: 16 }}
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="settings-topbar-title">Settings</span>
          {/* live badge */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              fontSize: 11,
              color: "#475569",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 6px ${accent}`,
                display: "inline-block",
              }}
            />
            Live
          </div>
        </div>

        {/* ── Tab bar ───────────────────────────────────────── */}
        <div className="settings-tabbar">
          {tabs.map((t) => {
            const on = activeTab === t.id;
            return (
              <button
                key={t.id}
                className={`settings-tab${on ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
                style={{ color: on ? t.color : undefined }}
              >
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Scrollable content ────────────────────────────── */}
        <div className="settings-scroll">
          <div key={activeTab} className="fadeup">
            {/* Page header */}
            <div style={{ marginBottom: 22 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                CLINIX RESEARCH PLATFORM
              </p>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  letterSpacing: "-0.02em",
                }}
              >
                {tab?.label}
              </h1>
            </div>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.05)",
                marginBottom: 20,
              }}
            />

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <>
                <Card title="Organization Info" accent={accent}>
                  <div style={{ paddingTop: 16 }}>
                    <Field
                      label="Organization Name"
                      value={profile.orgName}
                      onChange={setProf("orgName")}
                      accent={accent}
                    />
                    <div className="twocol">
                      <Field
                        label="Admin Email"
                        value={profile.email}
                        type="email"
                        onChange={setProf("email")}
                        accent={accent}
                      />
                      <Field
                        label="Phone"
                        value={profile.phone}
                        onChange={setProf("phone")}
                        accent={accent}
                      />
                    </div>
                    <Field
                      label="Website"
                      value={profile.website}
                      onChange={setProf("website")}
                      accent={accent}
                    />
                  </div>
                </Card>

                <Card title="Organization Logo" accent={accent}>
                  <div
                    style={{
                      padding: "16px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        flexShrink: 0,
                        background: `linear-gradient(135deg,${accent},${accent}88)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#080f1e",
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {profile.orgName?.slice(0, 2).toUpperCase() || "AC"}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e2e8f0",
                          marginBottom: 3,
                        }}
                      >
                        Upload Logo
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#334155",
                          marginBottom: 10,
                        }}
                      >
                        PNG or SVG · max 2MB
                      </p>
                      <button
                        style={{
                          padding: "7px 14px",
                          borderRadius: 9,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)",
                          color: "#94a3b8",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <Card title="Notification Preferences" accent={accent}>
                {[
                  {
                    key: "emailNotifs",
                    label: "Email Notifications",
                    desc: "Receive updates and alerts via email",
                  },
                  {
                    key: "smsNotifs",
                    label: "SMS Notifications",
                    desc: "Critical alerts sent to your registered phone",
                  },
                  {
                    key: "trialAlerts",
                    label: "Clinical Trial Alerts",
                    desc: "Notify when trial status changes",
                  },
                  {
                    key: "jobAlerts",
                    label: "Job Application Alerts",
                    desc: "New applications submitted",
                  },
                  {
                    key: "weeklyDigest",
                    label: "Weekly Digest",
                    desc: "Summary email every Monday",
                  },
                ].map(({ key, label, desc }) => (
                  <SettingRow key={key} label={label} desc={desc}>
                    <Toggle
                      value={notifs[key]}
                      onChange={setN(key)}
                      accent={accent}
                    />
                  </SettingRow>
                ))}
              </Card>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <>
                <Card title="Authentication" accent={accent}>
                  {[
                    {
                      key: "twoFactor",
                      label: "Two-Factor Authentication",
                      desc: "Require a verification code on every login",
                    },
                    {
                      key: "loginAlerts",
                      label: "Login Alerts",
                      desc: "Email me when a new device logs in",
                    },
                    {
                      key: "sessionTimeout",
                      label: "Session Timeout",
                      desc: "Auto-logout after 30 minutes of inactivity",
                    },
                    {
                      key: "apiAccess",
                      label: "Enable API Access",
                      desc: "Allow external integrations via REST API",
                    },
                  ].map(({ key, label, desc }) => (
                    <SettingRow key={key} label={label} desc={desc}>
                      <Toggle
                        value={security[key]}
                        onChange={setSec(key)}
                        accent={accent}
                      />
                    </SettingRow>
                  ))}
                </Card>
                <Card title="Change Password" accent={accent}>
                  <div style={{ paddingTop: 16 }}>
                    <Field
                      label="Current Password"
                      value=""
                      onChange={() => {}}
                      type="password"
                      placeholder="••••••••"
                      accent={accent}
                    />
                    <Field
                      label="New Password"
                      value=""
                      onChange={() => {}}
                      type="password"
                      placeholder="••••••••"
                      accent={accent}
                    />
                    <Field
                      label="Confirm Password"
                      value=""
                      onChange={() => {}}
                      type="password"
                      placeholder="••••••••"
                      accent={accent}
                    />
                    <button
                      style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: `linear-gradient(135deg,${accent},${accent}bb)`,
                        color: "#080f1e",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        marginBottom: 18,
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </Card>
              </>
            )}

            {/* ── PORTAL ── */}
            {activeTab === "portal" && (
              <Card title="Portal Configuration" accent={accent}>
                {[
                  {
                    key: "publicPortal",
                    label: "Public Portal",
                    desc: "Make your research portal publicly accessible",
                    ac: accent,
                  },
                  {
                    key: "allowRegistration",
                    label: "Allow Public Registration",
                    desc: "Let visitors create accounts on the portal",
                    ac: accent,
                  },
                  {
                    key: "autoPublish",
                    label: "Auto-Publish Jobs",
                    desc: "Automatically publish approved job listings",
                    ac: accent,
                  },
                  {
                    key: "seoEnabled",
                    label: "SEO Optimization",
                    desc: "Enable meta tags and structured data",
                    ac: accent,
                  },
                  {
                    key: "maintenanceMode",
                    label: "Maintenance Mode",
                    desc: "Take the portal offline for maintenance",
                    ac: "#f87171",
                  },
                ].map(({ key, label, desc, ac }) => (
                  <SettingRow key={key} label={label} desc={desc}>
                    <Toggle
                      value={portal[key]}
                      onChange={setP(key)}
                      accent={ac}
                    />
                  </SettingRow>
                ))}
                {portal.maintenanceMode && (
                  <div
                    className="fadeup"
                    style={{
                      margin: "8px 0 12px",
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      fontSize: 13,
                      color: "#fca5a5",
                    }}
                  >
                    ⚠️ Maintenance mode active — portal is offline for visitors.
                  </div>
                )}
              </Card>
            )}

            {/* ── DANGER ── */}
            {activeTab === "danger" && (
              <div
                style={{
                  background: "#0d1120",
                  borderRadius: 14,
                  border: "1px solid rgba(248,113,113,0.18)",
                  overflow: "hidden",
                  boxShadow: "0 4px 30px rgba(248,113,113,0.07)",
                }}
              >
                <div
                  style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid rgba(248,113,113,0.1)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#f87171",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "rgba(248,113,113,0.04)",
                  }}
                >
                  ⚠️ Danger Zone
                </div>
                <div style={{ padding: "0 18px" }}>
                  <DangerBtn
                    label="Clear All Cache"
                    desc="Flush platform cache"
                    btnLabel="Clear Cache"
                    onClick={() => alert("Cache cleared")}
                  />
                  <DangerBtn
                    label="Export All Data"
                    desc="Download a full JSON export of your platform data"
                    btnLabel="Export"
                    onClick={() => alert("Export started")}
                  />
                  <DangerBtn
                    label="Reset Portal Settings"
                    desc="Restore all portal settings to factory defaults"
                    btnLabel="Reset"
                    onClick={() =>
                      window.confirm("Reset all portal settings?") &&
                      alert("Reset done")
                    }
                  />
                  <DangerBtn
                    label="Delete Organization"
                    desc="Permanently delete this org and all data. Cannot be undone."
                    btnLabel="Delete Org"
                    onClick={() =>
                      window.confirm("Permanently delete organization?") &&
                      alert("Deleted")
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Save bar (sticky to bottom of flex column) ──── */}
        {activeTab !== "danger" && (
          <div className="settings-savebar">
            {saved && (
              <span
                className="fadeup"
                style={{
                  fontSize: 13,
                  color: accent,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: `${accent}18`,
                    border: `1px solid ${accent}40`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                  }}
                >
                  ✓
                </span>
                Saved successfully
              </span>
            )}
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving
                  ? "rgba(255,255,255,0.06)"
                  : `linear-gradient(135deg,${accent},${accent}bb)`,
                color: saving ? "#475569" : "#080f1e",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : `0 4px 18px ${accent}38`,
              }}
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
