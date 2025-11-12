import React from "react"
import SectionCard from "../components/SectionCard"
import AddressList from "../components/AddressList"

export default function AddressesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Адреса</h2>
      <SectionCard title="Мои адреса" description="Адреса доставки и пункты самовывоза"><AddressList /></SectionCard>
    </div>
  )
}
