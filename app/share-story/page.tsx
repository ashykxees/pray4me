"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitStory } from "./actions"

export default function ShareStoryPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    language: "",
    bookingLink: "",
  })
  const [error, setError] = useState("")

  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const data = new FormData()
    data.set("name", form.name)
    data.set("age", form.age)
    data.set("email", form.email)
    data.set("language", form.language)
    data.set("bookingLink", form.bookingLink)
    try {
      await submitStory(data)
      router.push("/stories")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit story request.")
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-brown-dark">Share your story</h1>
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        {calendarUrl ? (
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-brand-brown-dark">Book a call</p>
            <iframe
              src={calendarUrl}
              className="h-96 w-full rounded-xl border border-brand-tan"
              title="Book a call"
            />
          </div>
        ) : (
          <p className="mb-6 rounded-lg bg-brand-beige p-4 text-brand-brown">
            Calendar booking not configured. Add your Google Calendar scheduling link to the environment variables.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            placeholder="Age"
            min={13}
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            placeholder="Spoken Language"
            required
          />
          <input
            type="url"
            value={form.bookingLink}
            onChange={(e) => setForm({ ...form, bookingLink: e.target.value })}
            className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
            placeholder="Paste your booked call link here"
            required
          />
          {error && <p className="rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
          <button
            type="submit"
            className="rounded-full bg-brand-brown px-6 py-2 font-semibold text-brand-cream hover:bg-brand-brown-dark"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
