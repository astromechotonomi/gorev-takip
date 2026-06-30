import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

// During local preview without a .env file, we fall back to a harmless
// placeholder client so the app still renders (with demo data) instead of
// crashing. Real auth/data calls simply won't work until configured.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "public-anon-key-placeholder"
);
