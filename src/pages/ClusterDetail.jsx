import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../lib/useAppData";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabase";
import { Card, StatusPill, Checkbox, Avatar } from "../components/ui";
import { DemoBanner } from "./Dashboard";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";
import TaskModal from "./TaskModal";

const STATUS_CYCLE = ["planlandi", "devam", "tamamlandi"];

export default function ClusterDetail() {
  const { clusterId } = useParams();
  const { user } = useAuth();
  const { clusters, tasks, profiles, loading, usingDemoData, updateTaskStatus } = useAppData();
  const [openTaskId, setOpenTaskId] = useState(null);

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Yükleniyor…</p>;

  const cluster = clusters.find((c) => c.id === clusterId);
  const clusterTasks = tasks.filter((t) => t.cluster_id === clusterId);
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));
  const openTask = clusterTasks.find((t) => t.id === openTaskId);

  function cycleStatus(task) {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length];
    updateTaskStatus(task.id, next);
  }

  return (
    <div>
      <Link to="/" className="focus-ring inline-flex items-center gap-1 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        <ChevronLeft size={15} /> Görev Kümeleri
      </Link>
      <h1 className="text-2xl font-bold mb-1">{cluster?.title || "Küme bulunamadı"}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Küçük görevler, sorumlu kişi ve durum etiketiyle birlikte listelenir. Sadece kendi görevini güncelleyebilirsin.
      </p>
      {usingDemoData && <DemoBanner />}

      <div className="flex flex-col gap-2.5">
        {clusterTasks.map((t) => {
          const assignee = profileById[t.assignee_id];
          const canEdit = !supabaseConfigured || user?.id === t.assignee_id;
          return (
            <Card
              key={t.id}
              className="row-card flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              onClick={() => setOpenTaskId(t.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {canEdit ? (
                  <Checkbox
                    checked={t.status === "tamamlandi"}
                    onChange={(e) => {
                      e.stopPropagation();
                      cycleStatus(t);
                    }}
                  />
                ) : (
                  <span title="Sadece sorumlu kişi güncelleyebilir">
                    <Checkbox checked={t.status === "tamamlandi"} onChange={(e) => e.stopPropagation()} />
                  </span>
                )}
                <p className="flex-1 font-medium text-sm min-w-0">{t.title}</p>
                {!canEdit && <Lock size={13} style={{ color: "var(--text-muted)" }} className="shrink-0" />}
              </div>
              <div className="flex items-center gap-3 pl-9 sm:pl-0 shrink-0">
                <Avatar name={assignee?.display_name} size={32} />
                <StatusPill status={t.status} />
                <ChevronRight size={16} color="var(--text-muted)" className="hidden sm:block" />
              </div>
            </Card>
          );
        })}
        {clusterTasks.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Bu kümede henüz görev yok.
          </p>
        )}
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
