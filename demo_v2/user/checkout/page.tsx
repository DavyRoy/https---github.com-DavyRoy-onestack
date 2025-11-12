"use client"
import React, { useMemo, useState } from "react"
import CheckoutHeader from "./components/CheckoutHeader"
import ContactBlock from "./components/ContactBlock"
import DeliveryBlock from "./components/DeliveryBlock"
import CouponPointsBlock from "./components/CouponPointsBlock"
import PaymentMethods from "./components/PaymentMethods"
import TermsCheckbox from "./components/TermsCheckbox"
import PayButton from "./components/PayButton"
import SummaryBlock from "./components/SummaryBlock"
import PrivacyNote from "./components/PrivacyNote"
import { mockCheckout } from "./data/mockCheckout"

export default function CheckoutPage() {
  const [contact, setContact] = useState({
    name: mockCheckout.prefillName,
    email: mockCheckout.prefillEmail,
    phone: mockCheckout.prefillPhone,
    save: false,
  })

  const [delivery, setDelivery] = useState({ method: mockCheckout.hasDelivery ? "courier" : "pickup", address: "" })
  const [coupon, setCoupon] = useState("")
  const [points, setPoints] = useState(0)
  const [payment, setPayment] = useState({ method: "card", cardNumber: "", expiry: "", cvv: "", token: null })
  const [agree, setAgree] = useState(false)
  const [processing, setProcessing] = useState(false)

  const subtotal = useMemo(() => mockCheckout.items.reduce((s, it) => s + it.price * it.qty, 0), [])

  const total = useMemo(() => {
    // Деморules: coupon - 300, points - value, delivery 200, tax 10%
    const couponDisc = coupon ? 300 : 0
    const pointsDisc = points
    const deliveryFee = mockCheckout.hasDelivery ? 200 : 0
    const tax = Math.round((subtotal - couponDisc - pointsDisc) * 0.1)
    return subtotal - couponDisc - pointsDisc + deliveryFee + tax
  }, [subtotal, coupon, points])

  const canPay = agree && contact.email && (payment.method !== "card" || (payment.cardNumber.length >= 12 && payment.cvv.length >= 3))

  const handlePay = async () => {
    setProcessing(true)
    // Деморут: если card and number starts with 4000 -> success, 4001 -> fail, else redirect to 3DS
    const num = payment.cardNumber.replace(/\s+/g, "")
    await new Promise((r) => setTimeout(r, 700))
    if (payment.method !== "card") {
      window.location.href = "/demo/user/checkout/success"
      return
    }
    if (num.startsWith("4000")) {
      window.location.href = "/demo/user/checkout/success"
    } else if (num.startsWith("4001")) {
      window.location.href = "/demo/user/checkout/fail"
    } else {
      window.location.href = "/demo/user/checkout/confirm-3ds"
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <CheckoutHeader step={1} />

      {mockCheckout.fromCart && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded">Вы почти у цели, осталось оплатить <strong>{total} ₽</strong></div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ContactBlock value={contact} onChange={setContact} />
          {mockCheckout.hasDelivery && <DeliveryBlock value={delivery} onChange={setDelivery} />}
          <CouponPointsBlock coupon={coupon} setCoupon={setCoupon} points={points} setPoints={setPoints} maxPoints={mockCheckout.pointsBalance} />
          <PaymentMethods value={payment} onChange={setPayment} />
          <TermsCheckbox checked={agree} onChange={setAgree} />
          <div className="mt-3">
            <PayButton disabled={!canPay || processing} onClick={handlePay} amount={total} loading={processing} />
          </div>
          <div className="mt-2"><PrivacyNote /></div>
        </div>

        <aside className="lg:col-span-1">
          <SummaryBlock items={mockCheckout.items} subtotal={subtotal} coupon={coupon} points={points} delivery={mockCheckout.hasDelivery ? 200 : 0} total={total} currency={mockCheckout.currency} />
        </aside>
      </div>
    </div>
  )
}
