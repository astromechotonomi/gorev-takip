import React from "react";
import { Avatar, StatusButton, StatusPill, Panel } from "../components/ui";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabase";
import { X, CalendarDays, Lock } from "lucide-react";

const STATUS_OPTIONS = ["planlandi", "devam", "tamamlandi"];

export default function TaskModal({ task, assignee, onClose, onStatusChange }) {
  const { user } = useAuth();
  const canEdit = !supabaseConfigured || user?.id === task.assignee_id;

  const due = task.due_date
    ? new Date(task.due_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "Belirtilmedi";

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
      style={{ background: "rgba(5,6,12,0.7)" }}
      onClick={onClose}
    >
      <Panel className="modal-pop w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold leading-snug">{task.title}</h2>
          <button onClick={onClose} className="focus-ring shrink-0 rounded-lg p-1" style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <Avatar name={assignee?.display_name} size={34} />
          <div>
            <p className="text-sm font-medium">{assignee?.display_name || "Atanmamış"}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{assignee?.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          <CalendarDays size={16} color="var(--accent)" />
          Teslim: {due}
        </div>

        <div className="h-px mb-5" style={{ background: "var(--border)" }} />

        {canEdit ? (
          <>
            <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--text-muted)" }}>DURUMU GÜNCELLE</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <StatusButton key={opt} status={opt} active={task.status === opt} onClick={() => onStatusChange(opt)} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <Lock size={12} /> DURUM (SALT OKUNUR)
            </p>
            <div className="flex items-center gap-2">
              <StatusPill status={task.status} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Sadece {assignee?.display_name || "sorumlu kişi"} bu görevi güncelleyebilir.
              </span>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
