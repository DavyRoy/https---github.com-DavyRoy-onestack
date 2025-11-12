"use client";

export default function FormRow({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/70">{label}</span>
      {children}
      {help && <span className="text-[11px] text-white/60">{help}</span>}
    </label>
  );
}