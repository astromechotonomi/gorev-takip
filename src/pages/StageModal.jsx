import React from "react";
import { Panel } from "../components/ui";
import { X, CheckCircle2 } from "lucide-react";

const ODR_SECTIONS = [
  ["Bölüm 1 — Özet", "İHA–İKA koordineli afet-sonrası çözüm konsepti"],
  ["Bölüm 2 — Organizasyonel Yapı", "10 kişilik, rol bazlı takım şeması"],
  ["Bölüm 3 — Proje Takvimi", "7 iş paketi, Gantt planı"],
  ["Bölüm 4 — Bütçe Analizi", "~354.000 TL, 5 alt sistem kalemi"],
  ["Bölüm 5 — Kavramsal Tasarım Yaklaşımı", "İHA, İKA ve mancınık tasarım kararları"],
  ["Bölüm 6 — Fayda Analizi Çalışmaları", "Görev başarım matrisi, puan projeksiyonu, risk matrisi"],
  ["Bölüm 7 — Üretim Planı", "İmalat yöntemleri ve malzeme seçimi"],
  ["Bölüm 8 — Sistem Entegrasyonu ve Test Planı", "4 kademeli doğrulama akışı"],
];

const DDR_SECTIONS = [
  ["Bölüm 1", "Özet", "10"],
  ["Bölüm 2", "Organizasyonel Yapı ve Proje Takvimi", "10"],
  ["Bölüm 3", "Genel Sistem Spesifikasyonları", "60"],
  ["Bölüm 4", "Test Faaliyetleri", "10"],
  ["Bölüm 5", "Gereksinim İzlenebilirliği", "10"],
];

export default function StageModal({ stage, onClose }) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
      style={{ background: "rgba(5,6,12,0.7)" }}
      onClick={onClose}
    >
      <Panel className="modal-pop w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-lg font-bold">
            {stage === "odr" && "ÖDR'de Neler Yaptık?"}
            {stage === "ddr" && "DDR Değerlendirme Kriterleri"}
            {stage === "fdr" && "Final Değerlendirme Raporu (FDR)"}
          </h2>
          <button onClick={onClose} className="focus-ring shrink-0 rounded-lg p-1" style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {stage === "odr" && (
          <>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Ön Değerlendirme Raporu'nda sunulan 8 bölümün özeti.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {ODR_SECTIONS.map(([t, d]) => (
                <div key={t} className="rounded-xl px-3.5 py-2.5" style={{ background: "var(--panel-2)" }}>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{d}</p>
                </div>
              ))}
            </div>
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
              style={{ background: "rgba(52,211,153,0.14)", color: "var(--green)", border: "1px solid rgba(52,211,153,0.35)" }}
            >
              <CheckCircle2 size={18} /> Sonuç: 100 üzerinden 94 ile başarıyla geçildi.
            </div>
          </>
        )}

        {stage === "ddr" && (
          <>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Mevcut aşama — son teslim 15 Temmuz 2026, 17:00.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {DDR_SECTIONS.map(([b, t, p]) => (
                <div key={b} className="flex items-center justify-between rounded-xl px-3.5 py-2.5" style={{ background: "var(--panel-2)" }}>
                  <div>
                    <p className="text-sm font-semibold">{b}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{p} puan</span>
                </div>
              ))}
            </div>
            <ul className="text-xs flex flex-col gap-1.5" style={{ color: "var(--text-muted)" }}>
              <li>• Çalışma ağırlığımızın %65'i Bölüm 3'te.</li>
              <li>• 6 gereksinim (madde 35–40) zorunlu ve eksiksiz karşılanmalı.</li>
              <li>• 196 gereksinimin tamamı izlenebilirlik matrisinde takip ediliyor.</li>
            </ul>
          </>
        )}

        {stage === "fdr" && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Final Değerlendirme Raporu sırada. Son teslim tarihi <strong style={{ color: "var(--text-primary)" }}>21 Eylül 2026, 17:00</strong>,
            sunumlar 30 Eylül – 3 Ekim 2026 tarihlerinde yapılacak. DDR teslimi tamamlanınca bu aşamanın detayları burada güncellenecek.
          </p>
        )}
      </Panel>
    </div>
  );
}
