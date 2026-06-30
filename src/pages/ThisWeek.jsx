import React, { useState } from "react";
import { useAppData } from "../lib/useAppData";
import { Card, Avatar } from "../components/ui";
import { DemoBanner } from "./Dashboard";
import TaskModal from "./TaskModal";

const COLUMNS = [
  { key: "planlandi", label: "Planlandı", color: "var(--gray-status)" },
  { key: "devam", label: "Devam Ediyor", color: "var(--accent)" },
  { key: "tamamlandi", label: "Tamamlandı", color: "var(--green)" },
];

function sortByDue(a, b) {
  if (!a.due_date) return 1;
  if (!b.due_date) return -1;
  return new Date(a.due_date) - new Date(b.due_date);
}

export default function ThisWeek() {
  const { tasks, clusters, profiles, loading, usingDemoData, updateTaskStatus } = useAppData();
  const [openTaskId, setOpenTaskId] = useState(null);

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Yükleniyor…</p>;

  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));
  const clusterById = Object.fromEntries(clusters.map((c) => [c.id, c]));
  const openTask = tasks.find((t) => t.id === openTaskId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">DDR'de Şu An Yapılacaklar</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Tüm görevler durumlarına göre üç sütunda sınıflandırılır; her sütun teslim tarihine göre sıralı.
      </p>
      {usingDemoData && <DemoBanner />}

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key).sort(sortByDue);
          return (
            <div key={col.key} className="rounded-2xl p-3" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between px-1.5 py-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-bold">{col.label}</span>
                </div>
                <span
                  className="text-xs font-semibold rounded-full px-2 py-0.5"
                  style={{ color: col.color, background: `${col.color}22` }}
                >
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {colTasks.map((t) => {
                  const assignee = profileById[t.assignee_id];
                  const cluster = clusterById[t.cluster_id];
                  return (
                    <Card
                      key={t.id}
                      className="row-card !p-3"
                      onClick={() => setOpenTaskId(t.id)}
                    >
                      <p className="text-sm font-medium leading-snug">{t.title}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {cluster?.title}
                          {t.due_date && (
                            <> · {new Date(t.due_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</>
                          )}
                        </span>
                        <Avatar name={assignee?.display_name} size={26} />
                      </div>
                    </Card>
                  );
                })}
                {colTasks.length === 0 && (
                  <p className="text-xs px-1.5 py-3" style={{ color: "var(--text-muted)" }}>
                    Bu durumda görev yok.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openTask && (
        <TaskModal
          task={openTask}
          assignee={profileById[openTask.assignee_id]}
          onClose={() => setOpenTaskId(null)}
          onStatusChange={(status) => updateTaskStatus(openTask.id, status)}
        />
      )}
    </div>
  );
}
