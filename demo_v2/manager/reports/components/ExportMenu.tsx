"use client";

import { FileDown } from "lucide-react";
import { toast } from "sonner";

export default function ExportMenu() {
  const onExport = (fmt: string) => {
    toast.success(`${fmt.toUpperCase()} экспорт сформирован (демо)`);
  };

  const Button = ({
    label,
    icon,
    onClick,
  }: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 transition-colors"
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label="Меню экспорта отчётов"
    >
      <Button
        label="CSV"
        icon={<FileDown width={16} height={16} />}
        onClick={() => onExport("csv")}
      />
      <Button label="XLSX" onClick={() => onExport("xlsx")} />
      <Button label="PDF" onClick={() => onExport("pdf")} />
    </div>
  );
}