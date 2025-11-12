"use client";

import React, { useState } from "react";

export default function FeedbackWidget() {
  const [helpful, setHelpful] = useState<null | boolean>(null);
  const [comment, setComment] = useState("");
  return (
    <div className="p-3 border rounded bg-white">
      <div>Полезно?</div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setHelpful(true)} className="p-2 border rounded">
          Да
        </button>
        <button onClick={() => setHelpful(false)} className="p-2 border rounded">
          Нет
        </button>
      </div>
      {helpful === false && (
        <div className="mt-2">
          <textarea
            className="w-full border p-2"
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="mt-2 text-sm text-gray-500">
            Спасибо — ваша обратная связь поможет улучшить статьи.
          </div>
        </div>
      )}
    </div>
  );
}