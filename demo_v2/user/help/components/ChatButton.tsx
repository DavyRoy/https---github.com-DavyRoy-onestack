import React from "react"

export default function ChatButton() {
  const open = () => alert('Открыть чат — демо')
  return (
    <button onClick={open} className="bg-green-600 text-white px-3 py-2 rounded">Открыть чат с поддержкой</button>
  )
}
