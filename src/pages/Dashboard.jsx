import React from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../lib/useAppData";
import { Card, ProgressBar } from "../components/ui";
import { Plane, Target, Bot, Cpu, Code2, FileText } from "lucide-react";

const ICONS = { plane: Plane, target: Target, robot: Bot, chip: Cpu, code: Code2, file: FileText };

export default function Dashboard() {
  const { clusters, tasks, loading, usingDemoData } = useAppData();

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Yükleniyor…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Görev Kümeleri</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Her disiplin kendi kümesini görür; ilerleme çubuğuyla genel durum anlık takip edilir.
      </p>
      {usingDemoData && <DemoBanner />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clusters.map((c) => {
          const clusterTasks = tasks.filter((t) => t.cluster_id === c.id);
          const done = clusterTasks.filter((t) => t.status === "tamamlandi").length;
          const total = clusterTasks.length || 1;
          const Icon = ICONS[c.icon] || FileText;
          return (
            <Link key={c.id} to={`/kume/${c.id}`}>
              <Card className="row-card h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="rounded-full flex items-center justify-center shrink-0"
                    style={{ width: 42, height: 42, background: "rgba(79,209,255,0.16)" }}
                  >
                    <Icon size={19} color="var(--accent)" />
                  </div>
                  <h2 className="font-bold">{c.title}</h2>
                </div>
                <ProgressBar pct={done / total} />
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  {done}/{clusterTasks.length} görev tamamlandı
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <div
      className="rounded-xl px-4 py-2.5 text-xs mb-5"
      style={{ background: "rgba(139,92,246,0.14)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.35)" }}
    >
      Demo modu: Supabase henüz bağlanmadı, örnek veriler gösteriliyor. Kurulum için README.md dosyasına bakın.
    </div>
  );
}
