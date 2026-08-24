"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { completeOnboarding } from "./actions"

const purposeOptions = ["Pray for others", "Ask for prayer", "Praise God"]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    age: "",
    country: "",
    state: "",
    phone: "",
    purpose: [] as string[],
    tos: false,
  })

  const ageNum = Number(form.age)
  const tooYoung = ageNum > 0 && ageNum < 13

  const canNext = () => {
    switch (step) {
      case 0:
        return form.firstName.trim().length > 0
      case 1:
        return form.age.trim().length > 0 && ageNum >= 13
      case 2:
        return form.country.trim().length > 0 && form.state.trim().length > 0
      case 3:
        return form.phone.trim().length > 0
      case 4:
        return form.purpose.length > 0
      case 5:
        return form.tos
      default:
        return true
    }
  }

  const togglePurpose = (value: string) => {
    setForm((f) => ({
      ...f,
      purpose: f.purpose.includes(value)
        ? f.purpose.filter((p) => p !== value)
        : [...f.purpose, value],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const data = new FormData()
    data.set("firstName", form.firstName)
    data.set("age", form.age)
    data.set("country", form.country)
    data.set("state", form.state)
    data.set("phone", form.phone)
    data.set("purpose", form.purpose.join(", "))
    data.set("tos", form.tos ? "on" : "")
    try {
      await completeOnboarding(data)
      router.push("/profile")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  const steps = [
    <div key="name" className="space-y-4">
      <label className="block text-brand-brown-dark font-medium">What is your name?</label>
      <input
        type="text"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark placeholder:text-brand-tan focus:outline-none focus:ring-2 focus:ring-brand-sand"
        placeholder="First name"
        required
      />
    </div>,
    <div key="age" className="space-y-4">
      <label className="block text-brand-brown-dark font-medium">How old are you?</label>
      <input
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark placeholder:text-brand-tan focus:outline-none focus:ring-2 focus:ring-brand-sand"
        placeholder="Age"
        min={1}
        required
      />
      {tooYoung && (
        <p className="rounded-lg bg-red-100 p-3 text-red-800">
          You must be 13 or older to create an account with us.
        </p>
      )}
      <p className="text-sm text-brand-sand">
        We ask for your age to connect you safely with others in your age group.
      </p>
    </div>,
    <div key="location" className="space-y-4">
      <label className="block text-brand-brown-dark font-medium">Where are you from?</label>
      <input
        type="text"
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
        className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark placeholder:text-brand-tan focus:outline-none focus:ring-2 focus:ring-brand-sand"
        placeholder="Country"
        required
      />
      <input
        type="text"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
        className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark placeholder:text-brand-tan focus:outline-none focus:ring-2 focus:ring-brand-sand"
        placeholder="State / Province"
        required
      />
    </div>,
    <div key="phone" className="space-y-4">
      <label className="block text-brand-brown-dark font-medium">Phone Number</label>
      <input
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark placeholder:text-brand-tan focus:outline-none focus:ring-2 focus:ring-brand-sand"
        placeholder="Phone number"
        required
      />
    </div>,
    <div key="purpose" className="space-y-4">
      <label className="block text-brand-brown-dark font-medium">What are you here for?</label>
      <div className="grid gap-3">
        {purposeOptions.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
              form.purpose.includes(option)
                ? "border-brand-sand bg-brand-beige"
                : "border-brand-tan bg-brand-cream"
            }`}
          >
            <input
              type="checkbox"
              checked={form.purpose.includes(option)}
              onChange={() => togglePurpose(option)}
              className="h-5 w-5 accent-brand-brown"
            />
            <span className="text-brand-brown-dark">{option}</span>
          </label>
        ))}
      </div>
    </div>,
    <div key="tos" className="space-y-4">
      <p className="text-brand-brown-dark">
        Do you agree to our{" "}
        <Link href="/terms" className="underline text-brand-sand">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline text-brand-sand">
          Privacy Policy
        </Link>
        ?
      </p>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-tan bg-brand-cream p-3">
        <input
          type="checkbox"
          checked={form.tos}
          onChange={(e) => setForm({ ...form, tos: e.target.checked })}
          className="h-5 w-5 accent-brand-brown"
          required
        />
        <span className="text-brand-brown-dark">I agree to the Terms of Service and Privacy Policy.</span>
      </label>
    </div>,
  ]

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {steps[step]}
          {error && <p className="rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-full px-4 py-2 text-brand-brown-dark hover:bg-brand-beige"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => canNext() && setStep(step + 1)}
                className="rounded-full bg-brand-brown px-6 py-2 text-brand-cream disabled:opacity-50 hover:bg-brand-brown-dark"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canNext()}
                className="rounded-full bg-brand-sand px-6 py-2 font-semibold text-brand-brown-dark disabled:opacity-50 hover:bg-brand-tan"
              >
                Complete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
