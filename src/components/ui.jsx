import React from "react";

export function Card({ children, className = "", style = {}, ...rest }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: "var(--panel-2)", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Panel({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-3xl shadow-2xl ${className}`}
      style={{ background: "var(--panel)", border: "1px solid var(--border)", ...style }}
    >
      {children}
    </div>
  );
}

const STATUS_STYLE = {
  tamamlandi: { color: "var(--green)", label: "Tamamlandı" },
  devam: { color: "var(--accent)", label: "Devam Ediyor" },
  planlandi: { color: "var(--gray-status)", label: "Planlandı" },
};

export function StatusPill({ status, onClick }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.planlandi;
  return (
    <button
      onClick={onClick}
      className="focus-ring rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition hover:brightness-125"
      style={{ color: s.color, background: `${s.color}22`, border: `1px solid ${s.color}55` }}
      title={onClick ? "Durumu değiştirmek için tıkla" : undefined}
    >
      {s.label}
    </button>
  );
}

export function StatusButton({ status, active, onClick }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.planlandi;
  return (
    <button
      onClick={onClick}
      className="focus-ring rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition active:scale-[0.97] hover:brightness-110"
      style={
        active
          ? { color: "var(--bg-dark)", background: s.color, border: `1px solid ${s.color}`, boxShadow: `0 2px 10px ${s.color}55` }
          : { color: s.color, background: "var(--panel-3)", border: `1px solid var(--border)` }
      }
    >
      {s.label}
    </button>
  );
}

export function ProgressBar({ pct, color = "var(--accent)", height = 8 }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: "var(--border)", height }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(pct * 100, 6)}%`, background: color }}
      />
    </div>
  );
}

const AVATAR_COLORS = ["var(--accent)", "var(--purple)", "var(--gray-status)", "var(--green)"];
function colorForId(id) {
  if (!id) return "var(--gray-status)";
  const idx = [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function Avatar({ name, size = 32 }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = colorForId(name);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: "var(--text-primary)",
        background: `${color}33`,
        border: `1.5px solid ${color}`,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

export function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="focus-ring rounded-md flex items-center justify-center shrink-0 transition"
      style={{
        width: 22,
        height: 22,
        background: checked ? "var(--green)" : "var(--panel-3)",
        border: `1px solid ${checked ? "var(--green)" : "var(--border)"}`,
      }}
      aria-label={checked ? "Tamamlandı olarak işaretlendi" : "Tamamlanmadı"}
    >
      {checked && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0b0e1a" strokeWidth="3.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </button>
  );
}

export function IconCircle({ children, size = 38 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: "rgba(79,209,255,0.16)", color: "var(--accent)" }}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...rest }) {
  const base = "focus-ring rounded-xl px-4 py-2.5 font-semibold text-sm transition active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? { background: "var(--accent)", color: "var(--bg-dark)" }
      : { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" };
  return (
    <button className={`${base} ${className}`} style={styles} {...rest}>
      {children}
    </button>
  );
}

export function Input({ icon, ...rest }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3"
      style={{ background: "var(--panel-2)", border: "1px solid var(--border)" }}
    >
      {icon}
      <input
        className="focus-ring w-full bg-transparent py-3 text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
        {...rest}
      />
    </div>
  );
}
