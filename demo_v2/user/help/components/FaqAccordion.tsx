"use client";

import React, { useState } from "react";

export default function FaqAccordion({ faqs }: any) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((f: any) => (
        <div key={f.id} className="border rounded bg-white">
          <button
            className="w-full text-left p-3"
            onClick={() => setOpen(open === f.id ? null : f.id)}
          >
            <div className="flex justify-between">
              <span>{f.q}</span>
              <span>{open === f.id ? "-" : "+"}</span>
            </div>
          </button>
          {open === f.id && <div className="p-3 text-sm text-gray-700">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}