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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full flex-1 rounded-2xl border border-[#c99a6b]/60 bg-[#4a2b1d] px-5 py-3.5 text-[#f4e8d6] placeholder-[#d8c0a3] outline-none transition focus:border-[#c99a6b] focus:bg-[#4a2b1d] focus:ring-2 focus:ring-[#c99a6b]/40"
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c99a6b] px-6 py-3.5 font-semibold text-[#3b2117] shadow-md transition hover:bg-[#e6b58a] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
        >
          <Lock className="h-4 w-4" />
          Notify me
        </button>
      </form>
      {status === "saved" && (
        <p className="mt-3 text-sm text-[#e6b58a]">You are on the list — we will email you when Pray4Me unlocks.</p>
      )}
      {status === "invalid" && (
        <p className="mt-3 text-sm text-[#e6b58a]">Please enter a valid email.</p>
      )}
    </div>
  )
}
