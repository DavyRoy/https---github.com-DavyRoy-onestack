"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportMenu({
  fileName = "orders-demo.csv",
  data,
  headers,
  children,
}: {
  fileName?: string;
  data?: Record<string, any>[]; // массив объектов (опционально)
  headers?: string[];
  children?: React.ReactNode;
}) {
  const onExport = () => {
    if (!data || data.length === 0) {
      toast.message("CSV сформирован (демо)");
      return;
    }

    try {
      const cols = headers || Object.keys(data[0]);
      const csv =
        [cols.join(","), ...data.map((row) => cols.map((c) => `"${String(row[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Файл CSV успешно сформирован");
    } catch (e) {
      console.error(e);
      toast.error("Ошибка при экспорте CSV");
    }
  };

  return (
    <div className="relative">
      {children ? (
        <div onClick={onExport}>{children}</div>
      ) : (
        <button
          onClick={onExport}
          className="btn flex items-center gap-2"
          aria-label="Экспортировать заказы в CSV"
        >
          <Download width={16} height={16} /> Экспорт
        </button>
      )}
    </div>
  );
}