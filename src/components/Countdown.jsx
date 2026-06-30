import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";

const DEADLINES = [
  { label: "İç Teslim", date: "2026-07-13T17:00:00", color: "var(--accent)" },
  { label: "DDR Resmi Teslim", date: "2026-07-15T17:00:00", color: "var(--purple)" },
];

function remaining(targetIso) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [, setTick] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const items = DEADLINES.map((d) => ({ ...d, left: remaining(d.date) })).filter((d) => d.left);
  if (items.length === 0) return null;
  const next = items[0];

  return (
    <div className="fixed bottom-20 md:bottom-5 right-3 sm:right-5 z-30 select-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex items-center gap-2 sm:gap-3 rounded-2xl px-3.5 sm:px-5 py-3 sm:py-4 shadow-2xl transition hover:brightness-110"
        style={{ background: "var(--panel)", border: `1.5px solid ${next.color}66` }}
      >
        <Timer size={18} color={next.color} />
        <span className="text-xs sm:text-base font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
          {next.label}: {next.left.days}g {pad(next.left.hours)}:{pad(next.left.minutes)}:{pad(next.left.seconds)}
        </span>
      </button>

      {open && (
        <div
          className="mt-2.5 rounded-2xl p-4 shadow-2xl w-72 sm:w-80"
          style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
        >
          {items.map((d) => (
            <div key={d.label} className="flex items-center justify-between py-2.5 text-sm">
              <span style={{ color: "var(--text-muted)" }}>{d.label}</span>
              <span className="font-bold text-base tabular-nums" style={{ color: d.color }}>
                {d.left.days}g {pad(d.left.hours)}:{pad(d.left.minutes)}:{pad(d.left.seconds)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
