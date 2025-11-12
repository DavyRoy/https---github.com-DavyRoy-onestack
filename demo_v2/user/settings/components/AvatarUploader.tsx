import React, { useState } from "react"

export default function AvatarUploader() {
  const [src, setSrc] = useState<string | null>(null)
  const upload = () => alert('Загрузить аватар — демо')
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">{src ? <img src={src} alt="avatar" /> : 'Аватар'}</div>
      <div>
        <div className="text-sm">Кружок 96px (демо)</div>
        <button onClick={upload} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Загрузить</button>
      </div>
    </div>
  )
}
