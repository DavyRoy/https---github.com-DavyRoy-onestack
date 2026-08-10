"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ChevronRight } from "lucide-react";

const FEATURES = [
  "Kanban-доска по статусам заявок",
  "Управление приоритетами и типами",
  "Чат с клиентом в реальном времени",
  "Подзадачи, файлы, этапы проекта",
  "Аналитика и таймлайн статусов",
  "Печать наряд-заказов формата A4",
];

export default function CrmLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/manager/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Неверные данные"); return; }
      localStorage.setItem("mgr_token", data.token);
      router.push("/crm/dashboard");
    } catch {
      setError("Ошибка соединения");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[460px] flex-shrink-0 p-12"
        style={{ background:"linear-gradient(160deg,#0d1e19 0%,#07100e 100%)", borderRight:"1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ background:"rgba(45,212,191,0.12)", border:"1px solid rgba(45,212,191,0.25)", color:"var(--primary)" }}>
            OS
          </div>
          <div>
            <div className="font-bold text-[15px]">OneStack</div>
            <div className="text-xs" style={{ color:"var(--muted-foreground)" }}>CRM панель</div>
          </div>
        </div>

        <div>
          <h1 className="text-[38px] font-black tracking-tight leading-[1.1] mb-4">
            Рабочее<br />пространство<br />
            <span style={{ color:"var(--primary)" }}>команды</span>
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color:"var(--muted-foreground)" }}>
            Единая система для работы с заявками,<br />клиентами и командой.
          </p>
          <div className="flex flex-col gap-2.5">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"var(--primary)" }} />
                <span className="text-sm" style={{ color:"rgba(244,250,248,0.55)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color:"var(--muted-foreground)" }}>
          © 2025 OneStack · hello@onestack.ru
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background:"rgba(45,212,191,0.12)", border:"1px solid rgba(45,212,191,0.25)", color:"var(--primary)" }}>
              OS
            </div>
            <span className="font-bold">OneStack CRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Вход в систему</h2>
            <p className="text-sm" style={{ color:"var(--muted-foreground)" }}>Введите данные менеджера</p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color:"var(--muted-foreground)" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="manager@onestack.ru" autoComplete="email" required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ background:"var(--input)", border:"1px solid var(--border)", color:"var(--foreground)", outline:"none" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(45,212,191,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "var(--border)")} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:"var(--muted-foreground)" }}>
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color:"var(--muted-foreground)" }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ background:"var(--input)", border:"1px solid var(--border)", color:"var(--foreground)", outline:"none" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(45,212,191,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "var(--border)")} />
              </div>
            </div>

            {error && (
              <p className="text-sm px-3 py-2.5 rounded-xl" style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color:"var(--destructive)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all mt-1 disabled:opacity-40 cursor-pointer"
              style={{ background:"var(--primary)", color:"var(--primary-foreground)" }}>
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><span>Войти</span><ChevronRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
