"use client"
import React from "react"
import ThreeDSCard from "../components/ThreeDSCard"

export default function Confirm3DS() {
  const handle = () => {
    // после успешного ввода кода — redirect
    window.location.href = "/demo/user/checkout/success"
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <ThreeDSCard onSubmit={handle} />
    </div>
  )
}
