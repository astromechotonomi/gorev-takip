import React, { useState } from "react";
import { useAppData } from "../lib/useAppData";
import { ProgressBar } from "../components/ui";
import { DemoBanner } from "./Dashboard";
import StageModal from "./StageModal";
import Gantt from "../components/Gantt";
import { Check } from "lucide-react";

const STAGES = [
  { key: "odr", label: "ÖDR", sub: "Tamamlandı", state: "done" },
  { key: "ddr", label: "DDR", sub: "Mevcut aşama", state: "active" },
  { key: "fdr", label: "FDR", sub: "Sırada", state: "upcoming" },
];

export default function Progress() {
  const { clusters, tasks, loading, usingDemoData } = useAppData();
  const [openStage, setOpenStage] = useState(null);

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Yükleniyor…</p>;

  const totalDone = tasks.filter((t) => t.status === "tamamlandi").length;
  const overallPct = tasks.length ? totalDone / tasks.length : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Genel İlerleme</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Üst düzey görünüm: hangi aşamadayız, hangi küme önde ya da geride. Aşamalara tıklayarak detayını görebilirsin.
      </p>
      {usingDemoData && <DemoBanner />}

      <div
        className="rounded-3xl p-4 sm:p-6 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
      >
        <Stepper onSelect={setOpenStage} />
      </div>

      <div
        className="rounded-3xl p-4 sm:p-6 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Genel Tamamlanma</p>
          <p className="text-sm font-bold" style={{ color: "var(--accent)" }}>
            {totalDone}/{tasks.length} görev · %{Math.round(overallPct * 100)}
          </p>
        </div>
        <ProgressBar pct={overallPct} color="var(--accent)" height={10} />
      </div>

      <div
        className="rounded-3xl p-4 sm:p-6 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-4">Zaman Çizelgesi (Gantt)</p>
        <Gantt clusters={clusters} tasks={tasks} />
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {[
            ["Planlandı", "var(--gray-status)"],
            ["Devam Ediyor", "var(--accent)"],
            ["Tamamlandı", "var(--green)"],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="w-2.5 h-2.5 rounded" style={{ background: color }} /> {label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="w-0.5 h-3" style={{ background: "var(--accent)" }} /> Bugün
          </div>
        </div>
      </div>

      <div className="rounded-3xl p-4 sm:p-6" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-semibold mb-4">Küme Bazlı İlerleme</p>
        <div className="flex flex-col gap-4">
          {clusters.map((c) => {
            const clusterTasks = tasks.filter((t) => t.cluster_id === c.id);
            const done = clusterTasks.filter((t) => t.status === "tamamlandi").length;
            const total = clusterTasks.length || 1;
            const pct = done / total;
            return (
              <div key={c.id} className="flex items-center gap-4">
                <span className="text-sm w-32 sm:w-40 shrink-0 truncate">{c.title}</span>
                <ProgressBar pct={pct} color={pct >= 0.5 ? "var(--green)" : "var(--accent)"} />
                <span className="text-xs w-10 text-right shrink-0" style={{ color: "var(--text-muted)" }}>
                  %{Math.round(pct * 100)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {openStage && <StageModal stage={openStage} onClose={() => setOpenStage(null)} />}
    </div>
  );
}

function Stepper({ onSelect }) {
  return (
    <div className="flex items-center">
      {STAGES.map((s, i) => (
        <React.Fragment key={s.key}>
          <button
            onClick={() => onSelect(s.key)}
            className="focus-ring flex flex-col items-center gap-2 text-center w-20 sm:w-28 shrink-0 transition hover:opacity-80"
          >
            <div
              className="rounded-full flex items-center justify-center font-bold"
              style={{
                width: 40,
                height: 40,
                background: s.state === "done" ? "var(--green)" : s.state === "active" ? "var(--accent)" : "var(--panel-3)",
                color: s.state === "upcoming" ? "var(--text-primary)" : "var(--bg-dark)",
                border: s.state === "active" ? "2px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              {s.state === "done" ? <Check size={16} /> : i + 1}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">{s.label}</p>
              <p className="text-[10px] sm:text-xs" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
            </div>
          </button>
          {i < STAGES.length - 1 && (
            <div className="flex-1 h-px mb-7" style={{ background: "var(--border)" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
