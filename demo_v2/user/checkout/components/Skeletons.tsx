import React from "react"

export function FieldSkeleton() {
  return <div className="h-8 bg-gray-100 rounded animate-pulse" />
}

export default function Skeletons() {
  return (
    <div className="space-y-2">
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
    </div>
  )
}
