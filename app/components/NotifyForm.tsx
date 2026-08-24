"use client"

import { useState } from "react"
import { Lock } from "lucide-react"

export function NotifyForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "saved" | "invalid">("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes("@") || !email.includes(".")) {
      setStatus("invalid")
      return
    }
    const list = JSON.parse(localStorage.getItem("pray4me-notify") || "[]") as string[]
    if (!list.includes(email)) {
      list.push(email)
      localStorage.setItem("pray4me-notify", JSON.stringify(list))
    }
    setStatus("saved")
    setEmail("")
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-white/50 outline-none backdrop-blur-sm transition focus:border-purple-400 focus:bg-white/15 focus:ring-2 focus:ring-purple-400/30"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Lock className="h-4 w-4" />
          Notify me
        </button>
      </form>
      {status === "saved" && (
        <p className="mt-3 text-sm text-emerald-300">You are on the list — we will email you when Pray4Me unlocks.</p>
      )}
      {status === "invalid" && (
        <p className="mt-3 text-sm text-rose-300">Please enter a valid email.</p>
      )}
    </div>
  )
}
