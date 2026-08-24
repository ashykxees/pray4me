"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitStory } from "./actions"
import { Send, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/stories" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Back to Stories
      </Link>
      <h1 className="mb-2 text-4xl text-brand-brown-dark">Share your story</h1>
      <p className="mb-8 text-brand-sand">Book a call and tell us a little about yourself.</p>

      <div className="card">
        {calendarUrl ? (
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-brand-brown-dark">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Book a call</span>
            </div>
            <iframe
              src={calendarUrl}
              className="h-[28rem] w-full rounded-2xl border border-brand-tan/50 shadow-inner"
              title="Book a call"
            />
          </div>
        ) : (
          <p className="mb-8 rounded-2xl bg-brand-beige p-4 text-brand-brown">
            Calendar booking not configured. Add your Google Calendar scheduling link to the environment variables.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="input"
            placeholder="Age"
            min={13}
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="input"
            placeholder="Spoken Language"
            required
          />
          <input
            type="url"
            value={form.bookingLink}
            onChange={(e) => setForm({ ...form, bookingLink: e.target.value })}
            className="input"
            placeholder="Paste your booked call link here"
            required
          />
          {error && <p className="rounded-2xl bg-red-100 p-4 text-red-800">{error}</p>}
          <button type="submit" className="btn-primary">
            <Send className="h-4 w-4" />
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
