"use client";

type User = {
  twoFA?: boolean;
};

export default function UserSecurityCard({ user }: { user: User }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Безопасность</div>

      <div className="text-sm text-white/90">
        2FA:{" "}
        <span
          className={`font-medium ${
            user.twoFA ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {user.twoFA ? "включена" : "не включена"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition">
          {user.twoFA ? "Отключить 2FA (демо)" : "Включить 2FA (демо)"}
        </button>

        <button className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition">
          Сброс пароля (демо)
        </button>
      </div>
    </section>
  );
}