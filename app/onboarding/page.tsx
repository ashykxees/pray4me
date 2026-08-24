"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { completeOnboarding } from "./actions"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

const purposeOptions = ["Pray for others", "Ask for prayer", "Praise God"]

const stepTitles = [
  "What is your name?",
  "How old are you?",
  "Where are you from?",
  "Phone number",
  "What are you here for?",
  "Almost done",
]

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
      <label className="label">What is your name?</label>
      <input
        type="text"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className="input"
        placeholder="First name"
        required
      />
    </div>,
    <div key="age" className="space-y-4">
      <label className="label">How old are you?</label>
      <input
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        className="input"
        placeholder="Age"
        min={1}
        required
      />
      {tooYoung && (
        <p className="rounded-2xl bg-red-100 p-4 text-red-800">
          You must be 13 or older to create an account with us.
        </p>
      )}
      <p className="text-sm leading-relaxed text-brand-sand">
        We ask for your age to connect you safely with others in your age group.
      </p>
    </div>,
    <div key="location" className="space-y-4">
      <label className="label">Where are you from?</label>
      <input
        type="text"
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
        className="input"
        placeholder="Country"
        required
      />
      <input
        type="text"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
        className="input"
        placeholder="State / Province"
        required
      />
    </div>,
    <div key="phone" className="space-y-4">
      <label className="label">Phone Number</label>
      <input
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="input"
        placeholder="Phone number"
        required
      />
    </div>,
    <div key="purpose" className="space-y-4">
      <label className="label">What are you here for?</label>
      <div className="grid gap-3">
        {purposeOptions.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
              form.purpose.includes(option)
                ? "border-brand-sand bg-brand-beige"
                : "border-brand-tan/60 bg-white/70 hover:bg-brand-beige/50"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                form.purpose.includes(option)
                  ? "border-brand-brown bg-brand-brown text-white"
                  : "border-brand-tan"
              }`}
            >
              {form.purpose.includes(option) && <Check className="h-3.5 w-3.5" />}
            </div>
            <input
              type="checkbox"
              checked={form.purpose.includes(option)}
              onChange={() => togglePurpose(option)}
              className="sr-only"
            />
            <span className="text-brand-brown-dark">{option}</span>
          </label>
        ))}
      </div>
    </div>,
    <div key="tos" className="space-y-6">
      <p className="text-lg text-brand-brown-dark">
        Do you agree to our{" "}
        <Link href="/terms" className="underline decoration-brand-sand underline-offset-4 text-brand-brown hover:text-brand-brown-dark">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline decoration-brand-sand underline-offset-4 text-brand-brown hover:text-brand-brown-dark">
          Privacy Policy
        </Link>
        ?
      </p>
      <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-brand-tan/60 bg-white/70 p-4 transition hover:bg-brand-beige/50">
        <div
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition ${
            form.tos ? "border-brand-brown bg-brand-brown text-white" : "border-brand-tan"
          }`}
        >
          {form.tos && <Check className="h-3.5 w-3.5" />}
        </div>
        <input
          type="checkbox"
          checked={form.tos}
          onChange={(e) => setForm({ ...form, tos: e.target.checked })}
          className="sr-only"
          required
        />
        <span className="text-brand-brown-dark">
          I agree to the Terms of Service and Privacy Policy.
        </span>
      </label>
    </div>,
  ]

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="card">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between">
          {stepTitles.map((_, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                  i <= step ? "bg-brand-brown text-white" : "bg-brand-beige text-brand-sand"
                }`}
              >
                {i + 1}
              </div>
              {i < stepTitles.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded-full transition ${
                    i < step ? "bg-brand-brown" : "bg-brand-beige"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <h1 className="mb-2 text-3xl text-brand-brown-dark">Create your account</h1>
        <p className="mb-6 text-brand-sand">{stepTitles[step]}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {steps[step]}
          {error && <p className="rounded-2xl bg-red-100 p-4 text-red-800">{error}</p>}
          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-ghost"
              >
                <ChevronLeft className="h-4 w-4" />
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
                className="btn-primary"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={!canNext()} className="btn-primary">
                Complete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
