import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "./supabase";
import { useAuth } from "./AuthContext";
import { DEMO_CLUSTERS, DEMO_PROFILES, DEMO_TASKS } from "./demoData";

const AppDataContext = createContext(null);

// Tek bir veri kaynağı: önceden her sayfa (Dashboard, ClusterDetail, ThisWeek,
// Progress) kendi useAppData() çağrısıyla clusters/profiles/tasks'i ayrı ayrı
// Supabase'den çekiyordu — sayfa değiştirdiğinde her seferinde 3 sorgu daha
// atılıyordu. Artık veri bir kere burada yükleniyor, Context ile paylaşılıyor,
// ve sayfalar arası geçişte yeniden çekilmiyor.
//
// Bu provider main.jsx'te AuthProvider'ın hemen altında, tüm uygulamanın
// tepesinde TEK SEFER mount edilir (route değişiminde yeniden mount olmaz).
// Veri çekimini auth durumuna göre kendi içinde tetikler: kullanıcı giriş
// yapmadan sorgu atmaz, giriş yapınca otomatik yükler, çıkış yapınca temizler.
export function AppDataProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [clusters, setClusters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(!supabaseConfigured);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    if (!loadedOnce.current) setLoading(true);
    if (!supabaseConfigured) {
      setClusters(DEMO_CLUSTERS);
      setProfiles(DEMO_PROFILES);
      setTasks(DEMO_TASKS);
      setUsingDemoData(true);
      setLoading(false);
      loadedOnce.current = true;
      return;
    }
    try {
      const [{ data: c, error: ce }, { data: p, error: pe }, { data: t, error: te }] = await Promise.all([
        supabase.from("clusters").select("*").order("sort_order"),
        supabase.from("profiles").select("*"),
        supabase.from("tasks").select("*").order("order_index"),
      ]);
      if (ce || pe || te) throw ce || pe || te;
      setClusters(c || []);
      setProfiles(p || []);
      setTasks(t || []);
      setUsingDemoData(false);
    } catch (err) {
      console.warn("Supabase verisi alınamadı, demo veriye dönülüyor:", err.message);
      setClusters(DEMO_CLUSTERS);
      setProfiles(DEMO_PROFILES);
      setTasks(DEMO_TASKS);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
      loadedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    if (authLoading) return; // auth durumu netleşmeden sorgu atma
    if (!supabaseConfigured || user) {
      load();
    } else {
      // Supabase bağlı ama kullanıcı çıkış yapmış: bir önceki oturumun
      // verisini ekranda bırakmayalım.
      setClusters([]);
      setProfiles([]);
      setTasks([]);
      setLoading(false);
      loadedOnce.current = false;
    }
  }, [authLoading, user, load]);

  // Canlı güncelleme: bir takım arkadaşı görev durumunu/tarihini değiştirdiğinde
  // sayfayı yenilemeden herkesin ekranına otomatik yansır. Bunun çalışması için
  // Supabase Dashboard > Database > Replication kısmından "tasks" tablosunda
  // Realtime'ın açık olması gerekir (genelde varsayılan olarak kapalı gelir).
  useEffect(() => {
    if (!supabaseConfigured || !user) return;
    const channel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        setTasks((prev) => {
          if (payload.eventType === "DELETE") {
            return prev.filter((t) => t.id !== payload.old.id);
          }
          const exists = prev.some((t) => t.id === payload.new.id);
          if (exists) return prev.map((t) => (t.id === payload.new.id ? payload.new : t));
          return [...prev, payload.new];
        });
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    if (!supabaseConfigured) return;
    const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
    if (error) console.error("Görev güncellenemedi:", error.message);
  }, []);

  const value = { clusters, profiles, tasks, loading, usingDemoData, reload: load, updateTaskStatus };
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData, AppDataProvider içinde kullanılmalı");
  return ctx;
}
