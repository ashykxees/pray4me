"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPrayerRequest } from "./actions"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/dashboard/prayer" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </Link>
      <h1 className="mb-2 text-4xl text-brand-brown-dark">Create Prayer Request</h1>
      <p className="mb-8 text-brand-sand">Share what is on your heart. Our moderators will review it quickly.</p>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Prayer</label>
          <p className="mb-2 text-sm text-brand-sand">What do you need prayer for?</p>
          <textarea
            value={prayer}
            onChange={(e) => setPrayer(e.target.value)}
            className="input min-h-[140px]"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="label">Explanation (optional)</label>
          <p className="mb-2 text-sm text-brand-sand">Add context if you feel comfortable.</p>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="input min-h-[100px]"
            rows={4}
          />
        </div>

        {error && <p className="rounded-2xl border border-brand-warm-tan bg-white p-4 text-brand-deep-brown">{error}</p>}

        <button type="submit" className="btn-primary">
          <Send className="h-4 w-4" />
          Submit Request
        </button>
      </form>
    </div>
  )
}
