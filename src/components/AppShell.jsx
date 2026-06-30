import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { Avatar } from "./ui";
import Countdown from "./Countdown";
import UpdateChecker from "./UpdateChecker";
import logo from "../assets/logo.png";
import { LayoutGrid, CalendarClock, TrendingUp, LogOut, Sun, Moon } from "lucide-react";

const NAV = [
  { to: "/", label: "Görev Kümeleri", icon: LayoutGrid },
  { to: "/bu-hafta", label: "Bu Hafta", icon: CalendarClock },
  { to: "/ilerleme", label: "Genel İlerleme", icon: TrendingUp },
];

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur"
        style={{ background: "color-mix(in srgb, var(--bg-dark) 85%, transparent)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 font-bold text-sm sm:text-base shrink-0 min-w-0">
          <img src={logo} alt="Astromech Otonomi" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0" />
          <span className="truncate hidden sm:inline">Astromech Otonomi</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="focus-ring flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  background: active ? "var(--panel-2)" : "transparent",
                }}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={toggle}
            className="focus-ring rounded-xl p-2 sm:p-2.5 transition hover:brightness-125"
            style={{ color: "var(--text-muted)", background: "var(--panel-2)" }}
            title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Avatar name={user?.email || user?.user_metadata?.display_name || "?"} size={32} />
          <button
            onClick={handleSignOut}
            className="focus-ring rounded-xl p-2 sm:p-2.5 transition hover:brightness-125"
            style={{ color: "var(--text-muted)", background: "var(--panel-2)" }}
            title="Çıkış yap"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-6 pb-24 md:pb-6">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-20 flex items-stretch backdrop-blur"
        style={{ background: "color-mix(in srgb, var(--bg-dark) 92%, transparent)", borderTop: "1px solid var(--border)" }}
      >
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="focus-ring flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
              style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Countdown />
      <UpdateChecker />
    </div>
  );
}
