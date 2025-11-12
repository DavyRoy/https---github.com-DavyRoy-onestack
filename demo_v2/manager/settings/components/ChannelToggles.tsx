"use client";

export default function ChannelToggles({
  email,
  messenger,
  toast,
  onChange,
}: {
  email: boolean;
  messenger: boolean;
  toast: boolean;
  onChange: (v: { email: boolean; messenger: boolean; toast: boolean }) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={email} onChange={(e)=>onChange({ email: e.target.checked, messenger, toast })}/>
        E-mail
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={messenger} onChange={(e)=>onChange({ email, messenger: e.target.checked, toast })}/>
        Мессенджер (демо)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={toast} onChange={(e)=>onChange({ email, messenger, toast: e.target.checked })}/>
        Внутренние тосты
      </label>
    </div>
  );
}