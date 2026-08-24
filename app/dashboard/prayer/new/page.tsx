"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPrayerRequest } from "./actions"

export default function NewPrayerRequestPage() {
  const router = useRouter()
  const [prayer, setPrayer] = useState("")
  const [explanation, setExplanation] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const data = new FormData()
    data.set("prayer", prayer)
    data.set("explanation", explanation)
    try {
      await createPrayerRequest(data)
      router.push("/dashboard/prayer")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit prayer request.")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-brown-dark">Create Prayer Request</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <div>
          <label className="block text-sm font-medium text-brand-brown-dark">Prayer</label>
          <p className="mb-2 text-sm text-brand-sand">What do you need prayer for?</p>
          <textarea
            value={prayer}
            onChange={(e) => setPrayer(e.target.value)}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brown-dark">Explanation (optional)</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            rows={4}
          />
        </div>

        {error && <p className="rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}

        <button
          type="submit"
          className="rounded-full bg-brand-brown px-6 py-2 font-semibold text-brand-cream hover:bg-brand-brown-dark"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
