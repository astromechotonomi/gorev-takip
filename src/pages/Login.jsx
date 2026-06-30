import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabase";
import { Button, Input, Panel } from "../components/ui";
import logo from "../assets/logo.png";
import iha from "../assets/iha.jpg";
import { User, Lock } from "lucide-react";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const stars = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 3,
      })),
    []
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Kullanıcı adı veya şifre hatalı." : error.message);
      return;
    }
    navigate("/");
  }

  return (
    <div
      data-theme="dark"
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{ background: "var(--bg-dark)", backgroundImage: "var(--bg-image)", color: "var(--text-primary)" }}
    >
      <div className="hero-stage">
        <div className="radar-sweep" />
        <div className="radar-ring" />
        <div className="radar-ring delay-1" />
        <div className="radar-ring delay-2" />

        {stars.map((s, i) => (
          <span
            key={i}
            className="twinkle"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}

        <img src={iha} alt="" className="orbit-drone trail-2" />
        <img src={iha} alt="" className="orbit-drone trail-1" />
        <img src={iha} alt="" className="orbit-drone" />
      </div>

      <Panel className="w-full max-w-sm p-8 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Astromech Otonomi"
            className="w-16 h-16 rounded-full mb-4 pulse-glow float-y"
            style={{ boxShadow: "0 0 24px rgba(79,209,255,0.45)" }}
          />
          <h1 className="text-lg font-bold">Takım Üyesi Girişi</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Astromech Otonomi · Görev Takip
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            icon={<User size={16} color="var(--text-muted)" />}
            type="email"
            placeholder={supabaseConfigured ? "E-posta adresin" : "E-posta (demo modda her şey kabul edilir)"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={<Lock size={16} color="var(--text-muted)" />}
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={supabaseConfigured}
          />
          {error && <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
          <Button type="submit" disabled={busy} className="mt-2">
            {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>

        {!supabaseConfigured && (
          <p className="text-xs mt-5 text-center" style={{ color: "var(--text-muted)" }}>
            Demo modu — Supabase henüz bağlı değil, herhangi bir e-posta/şifreyle devam edebilirsin.
          </p>
        )}
      </Panel>
    </div>
  );
}
