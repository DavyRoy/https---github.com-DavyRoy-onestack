import { ArrowUpRight, ExternalLink, Mail, Phone } from 'lucide-react';
import type { ModuleContent } from '@/app/demo/social/types';
import SpotlightCard from '@/components/demo/social/SpotlightCard';
import MagicBento from '@/components/demo/social/MagicBento';

export default function ModulePage({ content }: { content: ModuleContent }) {
  return (
    <div className="space-y-10">
      <SpotlightCard className="bg-gradient-to-br from-slate-950/80 to-slate-900/60">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
            {content.hero.badge}
          </span>
          <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
            {content.status === 'stable' ? 'В продакшене' : content.status === 'beta' ? 'Бета' : 'Внутренний релиз'}
          </span>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-3xl font-semibold text-white">{content.hero.title}</h1>
            <p className="mt-4 max-w-2xl text-white/75">{content.hero.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.hero.actions.map(action => (
                <a
                  key={action.label}
                  href={action.href ?? '#'}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${
                    action.variant === 'secondary'
                      ? 'border border-white/20 text-white/80 hover:bg-white/10'
                      : 'bg-white text-slate-900 shadow-lg shadow-white/30 hover:-translate-y-0.5'
                  }`}
                >
                  {action.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-white/80">
              {content.hero.metadata.map(item => (
                <SpotlightCard key={item.label} spotlightColor="rgba(132, 255, 210, 0.15)" className="p-4 text-white">
                  <dt className="text-xs uppercase text-white/60">{item.label}</dt>
                  <dd className="mt-1 text-base text-white">{item.value}</dd>
                </SpotlightCard>
              ))}
            </dl>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-3">
            <MagicBento enableTilt enableMagnetism glowColor="132, 0, 255" />
          </div>
        </div>
      </SpotlightCard>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SpotlightCard className="bg-slate-950/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Ключевые показатели</p>
                <p className="text-lg text-white">{content.hero.title}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-xs text-white/70">
                Экспорт
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {content.metrics.map(metric => (
                <SpotlightCard
                  key={metric.id}
                  spotlightColor="rgba(59, 130, 246, 0.25)"
                  className="border-white/5 bg-slate-900/70 p-4"
                >
                  <p className="text-sm text-white/70">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-white/60">{metric.hint}</span>
                    <span
                      className={
                        metric.trend === 'up'
                          ? 'text-emerald-300'
                          : metric.trend === 'down'
                          ? 'text-rose-300'
                          : 'text-slate-300'
                      }
                    >
                      {metric.change > 0 ? '+' : ''}
                      {metric.change}%
                    </span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-slate-950/50">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Рабочая витрина</p>
              <span className="text-xs text-white/50">{content.table.subtitle}</span>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-sm text-white/80">
                <thead>
                  <tr className="bg-white/5 text-left text-xs uppercase text-white/60">
                    {content.table.columns.map(column => (
                      <th key={column} className="px-3 py-2">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.table.rows.map((row, idx) => (
                    <tr key={`${row.ID}-${idx}`} className="border-t border-white/5">
                      {content.table.columns.map(column => (
                        <td key={`${column}-${idx}`} className="px-3 py-3">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-white/50">{content.table.footnote}</p>
          </SpotlightCard>

          <div className="grid gap-6 md:grid-cols-2">
            <SpotlightCard className="bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Таймлайн</p>
              <div className="mt-4 space-y-4">
                {content.timeline.map(item => (
                  <SpotlightCard key={item.id} className="border-white/5 bg-white/5 p-4" spotlightColor="rgba(248, 113, 113, 0.2)">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{item.time}</span>
                      <span>{item.status}</span>
                    </div>
                    <p className="mt-2 text-base font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/70">{item.description}</p>
                    <p className="mt-2 text-xs text-white/50">{item.owner}</p>
                  </SpotlightCard>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-slate-950/50">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Обновления</p>
              <div className="mt-4 space-y-4">
                {content.updates.map(update => (
                  <SpotlightCard key={update.id} className="border-white/5 bg-white/5 p-4" spotlightColor="rgba(168, 85, 247, 0.2)">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{update.timestamp}</span>
                      <span>{update.channel}</span>
                    </div>
                    <p className="mt-2 text-base font-semibold text-white">{update.title}</p>
                    <p className="text-sm text-white/70">{update.summary}</p>
                    <p className="mt-2 text-xs text-white/50">Ответственный: {update.owner}</p>
                  </SpotlightCard>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>

        <div className="space-y-6">
          <SpotlightCard className="bg-slate-950/50">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Инсайты</p>
            <div className="mt-4 space-y-3">
              {content.insights.map(insight => (
                <SpotlightCard key={insight.id} className="border-white/5 bg-slate-900/70 p-4" spotlightColor="rgba(20, 184, 166, 0.3)">
                  <p className="text-sm text-white/70">{insight.title}</p>
                  <p className="text-lg font-semibold text-white">{insight.value}</p>
                  <p
                    className={`text-xs ${
                      insight.trend === 'up'
                        ? 'text-emerald-300'
                        : insight.trend === 'down'
                        ? 'text-rose-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {insight.change > 0 ? '+' : ''}
                    {insight.change}%
                  </p>
                  <p className="text-xs text-white/60">{insight.description}</p>
                </SpotlightCard>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-slate-950/50">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Ресурсы</p>
            <div className="mt-4 space-y-3">
              {content.resources.map(resource => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
                >
                  <div>
                    <p className="text-white">{resource.label}</p>
                    <p className="text-xs text-white/50">
                      {resource.type} • обновлено {resource.updated}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/40" />
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Контакт</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
                  {content.contact.avatar}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{content.contact.owner}</p>
                  <p className="text-sm text-white/70">{content.contact.role}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-white/50" />
                  {content.contact.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/50" />
                  {content.contact.phone}
                </p>
                <p className="text-xs text-white/60">
                  График: {content.contact.shift} • SLA {content.contact.responseTime}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
