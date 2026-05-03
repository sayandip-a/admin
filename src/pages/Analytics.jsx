import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── THEME ── light clinical, matching reference ─────────────────────── */
const T = {
  pageBg: "#ffffff",
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
  skySoft: "rgba(14,165,233,0.10)",
  purple: "#8b5cf6",
  text1: "#111827",
  text2: "#6b7280",
  text3: "#9ca3af",
  border: "rgba(0,0,0,0.07)",
  border2: "rgba(91,79,245,0.14)",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(91,79,245,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(91,79,245,0.12)",
};

/* ─── DATA ───────────────────────────────────────────────────────────── */
const monthlyData = [
  {
    month: "Jan",
    trials: 8,
    patients: 312,
    jobs: 5,
    solutions: 3,
    revenue: 142,
  },
  {
    month: "Feb",
    trials: 11,
    patients: 428,
    jobs: 7,
    solutions: 4,
    revenue: 198,
  },
  {
    month: "Mar",
    trials: 9,
    patients: 389,
    jobs: 6,
    solutions: 5,
    revenue: 175,
  },
  {
    month: "Apr",
    trials: 14,
    patients: 521,
    jobs: 11,
    solutions: 6,
    revenue: 234,
  },
  {
    month: "May",
    trials: 13,
    patients: 487,
    jobs: 9,
    solutions: 5,
    revenue: 218,
  },
  {
    month: "Jun",
    trials: 17,
    patients: 634,
    jobs: 14,
    solutions: 8,
    revenue: 289,
  },
  {
    month: "Jul",
    trials: 16,
    patients: 598,
    jobs: 12,
    solutions: 7,
    revenue: 267,
  },
  {
    month: "Aug",
    trials: 21,
    patients: 743,
    jobs: 18,
    solutions: 9,
    revenue: 342,
  },
  {
    month: "Sep",
    trials: 19,
    patients: 682,
    jobs: 15,
    solutions: 10,
    revenue: 318,
  },
  {
    month: "Oct",
    trials: 24,
    patients: 891,
    jobs: 21,
    solutions: 12,
    revenue: 412,
  },
  {
    month: "Nov",
    trials: 22,
    patients: 834,
    jobs: 19,
    solutions: 11,
    revenue: 387,
  },
  {
    month: "Dec",
    trials: 28,
    patients: 1024,
    jobs: 24,
    solutions: 14,
    revenue: 456,
  },
];

const trialStatusData = [
  { name: "Active", value: 42, color: "#10b981" },
  { name: "Recruiting", value: 28, color: "#0ea5e9" },
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Completed", value: 35, color: "#9ca3af" },
  { name: "Suspended", value: 7, color: "#f43f5e" },
];

const phaseData = [
  { phase: "Phase I", trials: 24, patients: 480 },
  { phase: "Phase II", trials: 38, patients: 1140 },
  { phase: "Phase III", trials: 52, patients: 5200 },
  { phase: "Phase IV", trials: 16, patients: 3200 },
];

const jobsData = [
  { month: "Jan", open: 12, filled: 8, applications: 45 },
  { month: "Feb", open: 15, filled: 11, applications: 62 },
  { month: "Mar", open: 10, filled: 9, applications: 38 },
  { month: "Apr", open: 18, filled: 13, applications: 74 },
  { month: "May", open: 14, filled: 12, applications: 58 },
  { month: "Jun", open: 22, filled: 16, applications: 91 },
  { month: "Jul", open: 19, filled: 15, applications: 78 },
  { month: "Aug", open: 25, filled: 20, applications: 104 },
  { month: "Sep", open: 21, filled: 17, applications: 86 },
  { month: "Oct", open: 28, filled: 22, applications: 118 },
  { month: "Nov", open: 24, filled: 19, applications: 97 },
  { month: "Dec", open: 31, filled: 25, applications: 132 },
];

const radarData = [
  { subject: "Trials", A: 85, fullMark: 100 },
  { subject: "Patients", A: 72, fullMark: 100 },
  { subject: "Solutions", A: 90, fullMark: 100 },
  { subject: "Jobs", A: 68, fullMark: 100 },
  { subject: "Events", A: 78, fullMark: 100 },
  { subject: "Contacts", A: 94, fullMark: 100 },
];

const solutionsByCategory = [
  { name: "Trial Services", count: 8, color: T.accent },
  { name: "Data Science", count: 6, color: T.accent2 },
  { name: "Regulatory", count: 4, color: T.amber },
  { name: "Patient Services", count: 7, color: T.green },
  { name: "Communications", count: 3, color: T.rose },
  { name: "Safety", count: 5, color: T.sky },
];

const KPIS = [
  {
    label: "Total Trials",
    value: 130,
    change: "+18%",
    up: true,
    color: T.accent,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: "Total Patients",
    value: "6.8K",
    change: "+24%",
    up: true,
    color: T.green,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Open Jobs",
    value: 31,
    change: "+12%",
    up: true,
    color: T.amber,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Active Solutions",
    value: 33,
    change: "+8%",
    up: true,
    color: T.accent2,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    label: "News & Events",
    value: 48,
    change: "-3%",
    up: false,
    color: T.sky,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
        <path d="M2 8h6M2 12h6M2 16h6" />
      </svg>
    ),
  },
  {
    label: "Site Locations",
    value: 24,
    change: "+5%",
    up: true,
    color: T.rose,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 18, height: 18 }}
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const RANGES = ["6M", "1Y", "ALL"];
const TABS = ["overview", "trials", "patients", "jobs"];

/* ─── TOOLTIP ─────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border2}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxShadow: "0 8px 28px rgba(91,79,245,0.14)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: T.text3,
          marginBottom: 7,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: T.text1,
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color || p.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: T.text2 }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── CHART CARD ──────────────────────────────────────────────────────── */
function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  action,
  accentColor,
}) {
  const color = accentColor || T.accent;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxShadow: T.shadow,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* subtle top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2.5,
          background: `linear-gradient(90deg, ${color}, ${color}55)`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: T.text1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 11.5, color: T.text3, marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

/* ─── KPI CARD ────────────────────────────────────────────────────────── */
function KpiCard({ kpi, index }) {
  const [count, setCount] = useState(0);
  const numVal = parseInt(String(kpi.value).replace(/[^0-9]/g, ""));
  useEffect(() => {
    let n = 0;
    const end = numVal;
    if (!end) return;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      n += step;
      if (n >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(n);
    }, 28);
    return () => clearInterval(timer);
  }, [numVal]);
  const display =
    typeof kpi.value === "string" && kpi.value.includes("K")
      ? (count / 1000).toFixed(1) + "K"
      : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxShadow: T.shadow,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = T.shadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = T.shadow;
      }}
    >
      {/* radial glow */}
      <div
        style={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${kpi.color}18, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: `${kpi.color}15`,
            border: `1px solid ${kpi.color}28`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: kpi.color,
          }}
        >
          {kpi.icon}
        </div>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
            background: kpi.up ? T.greenSoft : T.roseSoft,
            color: kpi.up ? T.green : T.rose,
            border: `1px solid ${kpi.up ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
          }}
        >
          {kpi.up ? "↑" : "↓"} {kpi.change}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: kpi.color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {display}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: T.text2,
          marginTop: 5,
          fontWeight: 500,
        }}
      >
        {kpi.label}
      </div>
    </motion.div>
  );
}

/* ─── RANGE PICKER ────────────────────────────────────────────────────── */
function RangePicker({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 3,
        background: "#f3f4f6",
        borderRadius: 9,
        padding: 3,
        border: `1px solid ${T.border}`,
      }}
    >
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            padding: "5px 12px",
            borderRadius: 7,
            fontSize: 11.5,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.18s",
            background:
              value === r
                ? `linear-gradient(135deg, ${T.accent}, ${T.accent2})`
                : "transparent",
            color: value === r ? "#fff" : T.text2,
            boxShadow: value === r ? `0 2px 8px rgba(91,79,245,0.28)` : "none",
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

/* ─── PIE LEGEND ──────────────────────────────────────────────────────── */
function PieLegend({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: d.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{ fontSize: 12, color: T.text2, flex: 1, fontWeight: 500 }}
          >
            {d.name}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text1 }}>
            {d.value}
          </span>
          <span
            style={{
              fontSize: 10,
              color: T.text3,
              width: 34,
              textAlign: "right",
            }}
          >
            {Math.round((d.value / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── BAR FILL (CSS animation, no motion.div black bg bug) ────────────── */
function BarFill({ pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay * 1000);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div
      style={{
        height: "100%",
        borderRadius: 10,
        background: `linear-gradient(90deg, ${color}bb, ${color})`,
        width: `${width}%`,
        transition: `width 0.85s cubic-bezier(0.22,1,0.36,1)`,
      }}
    />
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────── */
export default function Analytics() {
  const [range, setRange] = useState("1Y");
  const [activeTab, setActiveTab] = useState("overview");

  const slicedData = range === "6M" ? monthlyData.slice(6) : monthlyData;
  const slicedJobs = range === "6M" ? jobsData.slice(6) : jobsData;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: T.text1,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(91,79,245,0.2); border-radius:10px; }
        .recharts-cartesian-axis-tick text { fill:${T.text3} !important; font-size:11px; font-family:'Plus Jakarta Sans',sans-serif; }
        .recharts-legend-item-text { color:${T.text2} !important; font-size:12px; }
        @media (max-width:1024px) {
          .kpi-grid { grid-template-columns: repeat(3,1fr) !important; }
          .chart-main-row { grid-template-columns: 1fr !important; }
          .chart-triple-row { grid-template-columns: 1fr 1fr !important; }
          .chart-bottom-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width:640px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .chart-triple-row { grid-template-columns: 1fr !important; }
          .pie-inner { flex-direction: column !important; }
          .tabs-row { overflow-x:auto; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "clamp(20px,4vw,36px) clamp(16px,3vw,28px)",
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 26,
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
                  fontWeight: 700,
                }}
              >
                Analytics & Insights
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
              Analytics
            </h1>
            <p style={{ fontSize: 13.5, color: T.text2, marginTop: 6 }}>
              Real-time overview of all clinical operations and portal activity
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <RangePicker value={range} onChange={setRange} />
            <div
              style={{
                fontSize: 12,
                color: T.text2,
                background: T.cardBg,
                border: `1px solid ${T.border}`,
                padding: "7px 14px",
                borderRadius: 9,
                boxShadow: T.shadow,
                fontWeight: 500,
              }}
            >
              Last updated:{" "}
              <span style={{ color: T.green, fontWeight: 700 }}>Just now</span>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="tabs-row"
          style={{
            display: "flex",
            gap: 4,
            background: T.cardBg,
            borderRadius: 12,
            padding: 4,
            marginBottom: 26,
            width: "fit-content",
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.2s",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                background:
                  activeTab === t
                    ? `linear-gradient(135deg, ${T.accent}, ${T.accent2})`
                    : "transparent",
                color: activeTab === t ? "#fff" : T.text2,
                boxShadow:
                  activeTab === t ? `0 3px 12px rgba(91,79,245,0.28)` : "none",
              }}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* ── KPI Grid ── */}
        <div
          className="kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 12,
            marginBottom: 22,
          }}
        >
          {KPIS.map((k, i) => (
            <KpiCard key={i} kpi={k} index={i} />
          ))}
        </div>

        {/* ── Main Area + Pie ── */}
        <div
          className="chart-main-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 370px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Enrollment trend */}
          <ChartCard
            title="Enrollment Trend"
            subtitle="Monthly patient enrollment vs trial count"
            delay={0.1}
            accentColor={T.accent}
            action={
              <span
                style={{
                  fontSize: 11,
                  color: T.text3,
                  background: "#f3f4f6",
                  padding: "4px 10px",
                  borderRadius: 7,
                  fontWeight: 600,
                }}
              >
                12-month view
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={slicedData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.accent} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTrials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke={T.accent}
                  strokeWidth={2.5}
                  fill="url(#gPatients)"
                  dot={false}
                  activeDot={{ r: 5, fill: T.accent, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="trials"
                  name="Trials"
                  stroke={T.green}
                  strokeWidth={2.5}
                  fill="url(#gTrials)"
                  dot={false}
                  activeDot={{ r: 5, fill: T.green, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Trial Status Pie */}
          <ChartCard
            title="Trial Status"
            subtitle="Distribution by status"
            delay={0.14}
            accentColor={T.green}
          >
            <div
              className="pie-inner"
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <div style={{ flexShrink: 0 }}>
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie
                      data={trialStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {trialStatusData.map((e, i) => (
                        <Cell key={i} fill={e.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <PieLegend data={trialStatusData} />
            </div>
          </ChartCard>
        </div>

        {/* ── Middle Row ── */}
        <div
          className="chart-triple-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Jobs bar */}
          <ChartCard
            title="Jobs Overview"
            subtitle="Open vs filled positions"
            delay={0.18}
            accentColor={T.amber}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={slicedJobs}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={9}
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="open"
                  name="Open"
                  fill={T.amber}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="filled"
                  name="Filled"
                  fill={T.green}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Phase distribution */}
          <ChartCard
            title="Trials by Phase"
            subtitle="Patient enrollment per phase"
            delay={0.22}
            accentColor={T.accent2}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={phaseData}
                layout="vertical"
                margin={{ top: 4, right: 4, left: 10, bottom: 0 }}
                barSize={9}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="phase"
                  tick={{ fill: T.text2, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="trials"
                  name="Trials"
                  fill={T.accent2}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill={T.sky}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Radar */}
          <ChartCard
            title="Portal Performance"
            subtitle="Across all modules"
            delay={0.26}
            accentColor={T.accent}
          >
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart
                data={radarData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: T.text2, fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke={T.accent}
                  fill={T.accent}
                  fillOpacity={0.12}
                  strokeWidth={2}
                  dot={{ fill: T.accent, r: 3, strokeWidth: 0 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Bottom Row ── */}
        <div
          className="chart-bottom-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 330px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Revenue / Solutions line */}
          <ChartCard
            title="Solutions Activity & Revenue"
            subtitle="Monthly revenue (K) and new solutions deployed"
            delay={0.3}
            accentColor={T.amber}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={slicedData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (K)"
                  stroke={T.amber}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="solutions"
                  name="Solutions"
                  stroke={T.accent2}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  strokeDasharray="5 3"
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  name="Jobs"
                  stroke={T.rose}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  strokeOpacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Solutions by category */}
          <ChartCard
            title="Solutions by Category"
            subtitle="Current portfolio breakdown"
            delay={0.34}
            accentColor={T.accent}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                marginTop: 4,
              }}
            >
              {(() => {
                const max = Math.max(
                  ...solutionsByCategory.map((x) => x.count),
                );
                return solutionsByCategory.map((s, i) => (
                  <div key={i} style={{ background: "transparent" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12.5,
                          color: T.text2,
                          fontWeight: 500,
                        }}
                      >
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: s.color,
                        }}
                      >
                        {s.count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 10,
                        background: "rgba(0,0,0,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <BarFill
                        pct={(s.count / max) * 100}
                        color={s.color}
                        delay={0.42 + i * 0.07}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </ChartCard>
        </div>

        {/* ── Applications trend ── */}
        <ChartCard
          title="Job Applications Over Time"
          subtitle="Monthly application volume trends"
          delay={0.38}
          accentColor={T.sky}
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={slicedJobs}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.sky} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={T.sky} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: T.text3, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: T.text3, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke={T.sky}
                strokeWidth={2.5}
                fill="url(#gApps)"
                dot={false}
                activeDot={{ r: 5, fill: T.sky, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
