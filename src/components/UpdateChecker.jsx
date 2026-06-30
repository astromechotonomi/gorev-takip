import React, { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 dakikada bir kontrol et
const CURRENT_BUILD_ID = import.meta.env.VITE_BUILD_ID || "dev";

// Tarayıcılar/CDN'ler sabit isimli index.html'i cache'leyip eski JS
// bundle'ına işaret etmeyi sürdürebilir — bu durumda kullanıcı manuel
// hard-refresh (Ctrl+Shift+R) yapmadan yeni sürümü göremez. Bu bileşen
// her deploy'da değişen version.json'ı (cache'siz) periyodik olarak çekip,
// derlenmiş haldeki ID'den farklıysa küçük bir "Yenile" rozeti gösterir.
export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const firstCheckDone = useRef(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const { buildId } = await res.json();
        if (firstCheckDone.current && buildId && buildId !== CURRENT_BUILD_ID) {
          setUpdateAvailable(true);
        }
        firstCheckDone.current = true;
      } catch {
        // Ağ sorunuysa sessizce geç, kullanıcıyı rahatsız etmeyelim.
      }
    }

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 md:bottom-5 left-3 sm:left-5 z-30">
      <button
        onClick={() => window.location.reload()}
        className="focus-ring flex items-center gap-2 rounded-2xl px-4 py-3 shadow-2xl transition hover:brightness-110"
        style={{ background: "var(--accent)", color: "var(--bg-dark)", fontWeight: 700, fontSize: 13 }}
      >
        <RefreshCw size={15} />
        Yeni güncelleme var · Yenile
      </button>
    </div>
  );
}
