"use client";

export default function TableBasic({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: { content: React.ReactNode; align?: "left" | "right" }[][];
}) {
  return (
    <section className="rounded-xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 w-full overflow-x-auto">
        <table className="min-w-[560px] w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="text-white/70 border-b border-white/10">
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-2 py-2 text-left font-normal whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-2 py-2 ${
                      cell.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}