import React, { useEffect, useRef, useState } from "react";

const STATUS_COLOR = {
  tamamlandi: "var(--green)",
  devam: "var(--accent)",
  planlandi: "var(--gray-status)",
};

const DAY_MS = 86400000;
const HEADER_ROW_H = 20;
const ROW_H = 26;
const MIN_PX_PER_DAY = 14; // ~1 hafta ≈ 98px — bu ölçeğin altına inmiyoruz,
// çizgiler/etiketler okunmaz hale gelmesin diye. Veri bu ölçekte konteynere
// sığıyorsa günler orana göre GENİŞLER (boşluk kalmaz, tam dolu görünür).
// Veri büyüyüp (yeni aylar eklenince) bu ölçekte konteynerden taşarsa,
// ölçek MIN_PX_PER_DAY'e kilitlenir ve yatay kaydırma devreye girer.

function dayDiff(a, b) {
  return (b.getTime() - a.getTime()) / DAY_MS;
}

function fmt(d) {
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Fixed-width label columns on the left. The optional ones collapse on
// narrow screens so the timeline always has room to breathe.
const SUBCOLS = [
  { key: "id", width: 22, cls: "" },
  { key: "title", width: 130, cls: "" },
  { key: "start", width: 58, cls: "hidden sm:flex" },
  { key: "finish", width: 58, cls: "hidden sm:flex" },
  { key: "duration", width: 36, cls: "hidden md:flex" },
];

function LabelRow({ id, title, start, finish, duration, bold, muted }) {
  return (
    <div className="flex items-center" style={{ height: ROW_H }}>
      {SUBCOLS.map((c) => (
        <div
          key={c.key}
          className={`shrink-0 truncate text-xs pr-1 ${c.cls}`}
          style={{
            width: c.width,
            fontWeight: bold ? 700 : 400,
            color: muted ? "var(--text-muted)" : "var(--text-primary)",
          }}
          title={c.key === "title" ? title : undefined}
        >
          {c.key === "id" && id}
          {c.key === "title" && title}
          {c.key === "start" && start}
          {c.key === "finish" && finish}
          {c.key === "duration" && duration}
        </div>
      ))}
    </div>
  );
}

export default function Gantt({ clusters, tasks }) {
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dated = tasks.filter((t) => t.start_date && t.due_date);

  if (!dated.length) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Zaman çizelgesi için başlangıç/bitiş tarihi girilmiş görev yok.
      </p>
    );
  }

  const allDates = dated.flatMap((t) => [new Date(t.start_date), new Date(t.due_date)]);
  const rangeStart = startOfDay(new Date(Math.min(...allDates.map((d) => d.getTime()))));
  const rangeEnd = startOfDay(new Date(Math.max(...allDates.map((d) => d.getTime()))));
  const totalDays = Math.max(1, dayDiff(rangeStart, rangeEnd));

  // Veri konteynerin tamamını dolduracak kadar küçükse günleri genişlet
  // (boşluk bırakma); değilse minimum okunabilir ölçeğe kilitle (kaydırma
  // gerekir). containerWidth ilk render'da 0 olabilir — o anda minimum
  // ölçek kullanılır, ResizeObserver gelince doğru değere geçer.
  const pxPerDay = containerWidth > 0 ? Math.max(MIN_PX_PER_DAY, containerWidth / totalDays) : MIN_PX_PER_DAY;
  const timelineWidth = totalDays * pxPerDay;

  const pxFor = (date) => dayDiff(rangeStart, new Date(date)) * pxPerDay;

  // Pick a tick spacing that stays readable whether the project spans
  // three weeks or a full year — fewer labels on a wider range.
  const tickStepDays = totalDays <= 42 ? 7 : totalDays <= 120 ? 14 : 30;
  const ticks = [];
  for (let t = new Date(rangeStart); t <= rangeEnd; t = new Date(t.getTime() + tickStepDays * DAY_MS)) {
    ticks.push(new Date(t));
  }

  // Month bands for the top header row, clipped to the actual data range.
  const monthBands = [];
  let cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  while (cursor <= rangeEnd) {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    const segStart = cursor < rangeStart ? rangeStart : cursor;
    const segEndDate = next < rangeEnd ? next : new Date(rangeEnd.getTime() + DAY_MS);
    monthBands.push({
      label: cursor.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
      left: pxFor(segStart),
      width: Math.max(pxFor(segEndDate) - pxFor(segStart), 0),
    });
    cursor = next;
  }

  const today = startOfDay(new Date());
  const todayPx = pxFor(today);
  const showToday = today >= rangeStart && today <= rangeEnd;
  const daysToProjectEnd = Math.round(dayDiff(today, rangeEnd));

  const overallMaxDue = rangeEnd;
  let seq = 0;

  return (
    <div className="rounded-xl overflow-hidden flex" style={{ border: "1px solid var(--border)" }}>
      {/* LEFT: fixed-width label columns, never scrolls */}
      <div className="shrink-0">
        <div style={{ background: "var(--panel-2)" }}>
          <div style={{ height: HEADER_ROW_H }} />
          <LabelRow id="#" title="Görev Adı" start="Başlangıç" finish="Bitiş" duration="Süre" bold muted />
        </div>
        <div style={{ background: "var(--panel)" }}>
          {clusters.map((c) => {
            const cTasks = dated.filter((t) => t.cluster_id === c.id);
            if (!cTasks.length) return null;
            return (
              <div key={c.id}>
                <div
                  className="text-xs font-bold truncate px-1 flex items-center"
                  style={{ height: ROW_H, background: "var(--panel-3)", width: "100%" }}
                >
                  {c.title}
                </div>
                {cTasks.map((t) => {
                  seq += 1;
                  const dur = Math.max(1, Math.round(dayDiff(new Date(t.start_date), new Date(t.due_date))));
                  return (
                    <LabelRow
                      key={t.id}
                      id={seq}
                      title={t.title}
                      start={fmt(new Date(t.start_date))}
                      finish={fmt(new Date(t.due_date))}
                      duration={`${dur}g`}
                    />
                  );
                })}
              </div>
            );
          })}
          <LabelRow
            id=""
            title="Toplam Proje Süresi"
            start={fmt(rangeStart)}
            finish={fmt(overallMaxDue)}
            duration={`${Math.round(totalDays)}g`}
            bold
          />
        </div>
      </div>

      {/* RIGHT: single scroll container holding BOTH the header (months/days)
          and the body (bars) stacked together, so they always scroll in
          sync. The inner content width matches pxPerDay exactly — no
          stretched-but-empty trailing space, no squish. */}
      <div ref={scrollRef} className="flex-1 min-w-0 overflow-x-auto">
        <div className="relative" style={{ width: timelineWidth }}>
          <div style={{ background: "var(--panel-2)" }}>
            <div className="relative" style={{ height: HEADER_ROW_H, borderBottom: "1px solid var(--border)" }}>
              {monthBands.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] font-bold truncate capitalize"
                  style={{
                    left: m.left,
                    width: m.width,
                    top: 2,
                    paddingLeft: 4,
                    color: "var(--text-primary)",
                    borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className="relative" style={{ height: ROW_H, borderBottom: "1px solid var(--border)" }}>
              {ticks.map((d, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] whitespace-nowrap"
                  style={{ left: Math.max(pxFor(d), 0), top: 5, paddingLeft: 2, color: "var(--text-muted)" }}
                >
                  {d.toLocaleDateString("tr-TR", { day: "numeric", month: "numeric" })}
                </span>
              ))}
              {showToday && (
                <div
                  className="absolute z-10 text-[10px] font-bold whitespace-nowrap rounded px-1.5 py-0.5"
                  style={{
                    left: todayPx,
                    top: -2,
                    transform: "translateX(2px)",
                    background: "var(--accent)",
                    color: "var(--bg-dark)",
                  }}
                >
                  Bugün · {daysToProjectEnd >= 0 ? `${daysToProjectEnd}g kaldı` : `${-daysToProjectEnd}g geçti`}
                </div>
              )}
            </div>
          </div>

          <div className="relative" style={{ background: "var(--panel)" }}>
            {showToday && (
              <div
                className="absolute top-0 bottom-0 z-10"
                style={{ left: todayPx, width: 1.5, background: "var(--accent)" }}
              />
            )}
            {clusters.map((c) => {
              const cTasks = dated.filter((t) => t.cluster_id === c.id);
              if (!cTasks.length) return null;
              return (
                <div key={c.id}>
                  <div style={{ height: ROW_H, borderBottom: "1px solid var(--border)" }} />
                  {cTasks.map((t) => {
                    const left = pxFor(t.start_date);
                    const right = pxFor(t.due_date);
                    const width = Math.max(right - left, 8);

                    let badge = null;
                    if (t.status !== "tamamlandi") {
                      const daysLeft = Math.round(dayDiff(today, new Date(t.due_date)));
                      if (today < new Date(t.start_date)) {
                        const daysToStart = Math.round(dayDiff(today, new Date(t.start_date)));
                        badge = { text: `${daysToStart}g sonra başlar`, color: "var(--text-muted)" };
                      } else if (daysLeft < 0) {
                        badge = { text: `${-daysLeft}g gecikti`, color: "#f87171" };
                      } else if (t.status === "devam") {
                        badge = { text: daysLeft === 0 ? "bugün bitiyor" : `${daysLeft}g kaldı`, color: "var(--text-muted)" };
                      }
                    }
                    const labelOnLeft = right > timelineWidth - 90;

                    return (
                      <div key={t.id} className="relative" style={{ height: ROW_H, borderBottom: "1px solid var(--border)" }}>
                        <div
                          className="absolute rounded-md"
                          style={{
                            left,
                            width,
                            top: 4,
                            bottom: 4,
                            background: STATUS_COLOR[t.status] || STATUS_COLOR.planlandi,
                            opacity: 0.92,
                          }}
                          title={`${t.title} (${fmt(new Date(t.start_date))} → ${fmt(new Date(t.due_date))})`}
                        />
                        {badge && (
                          <span
                            className="absolute text-[10px] whitespace-nowrap"
                            style={{
                              left: labelOnLeft ? left : right,
                              top: 6,
                              transform: labelOnLeft ? "translateX(calc(-100% - 4px))" : "translateX(4px)",
                              color: badge.color,
                            }}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="relative" style={{ height: ROW_H }}>
              <div
                className="absolute rounded-md"
                style={{ left: 0, width: timelineWidth, top: 6, bottom: 6, background: "var(--purple)", opacity: 0.85 }}
                title={`Toplam proje süresi (${fmt(rangeStart)} → ${fmt(overallMaxDue)})`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
