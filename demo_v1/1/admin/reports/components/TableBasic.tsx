"use client";

export default function TableBasic({
  columns,
  rows,
}: {
  columns: string[];
  rows: any[];
}) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
      {/* локальный скролл только внутри таблицы */}
      <div className="-mx-2 md:mx-0">
        <div className="overflow-x-auto px-2 md:px-0">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                {columns.map((c, i) => (
                  <th key={i} className="text-left py-2 pr-3">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-white/5 align-top">
                  {Object.values(r).map((v, idx) => (
                    <td
                      key={idx}
                      className="py-2 pr-3 min-w-0 break-words whitespace-normal"
                    >
                      {String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}