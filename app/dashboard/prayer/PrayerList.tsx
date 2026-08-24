"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { togglePrayerReaction } from "./actions"
import { Heart } from "lucide-react"

export function PrayerList({
  requests,
  currentUserId,
}: {
  requests: {
    id: string
    title: string
    prayer: string
    explanation?: string | null
    createdAt: Date
    user: { firstName?: string | null; age?: number | null }
    reactions: { userId: string }[]
  }[]
  currentUserId: string
}) {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handlePray(id: string) {
    setError("")
    const data = new FormData()
    data.set("id", id)
    try {
      await togglePrayerReaction(data)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not react.")
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
      {requests.length === 0 ? (
        <p className="text-brand-sand">No prayer requests yet in your age group.</p>
      ) : (
        requests.map((r) => {
          const hasPrayed = r.reactions.some((reaction) => reaction.userId === currentUserId)
          const count = r.reactions.length
          return (
            <div key={r.id} className="rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-brand-brown-dark">
                  {r.user.firstName || "Anonymous"} {r.user.age ? `· ${r.user.age}` : ""}
                </span>
                <span className="text-xs text-brand-sand">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-brand-brown-dark">{r.prayer}</p>
              {r.explanation && (
                <p className="mt-2 text-sm text-brand-sand">{r.explanation}</p>
              )}
              <button
                onClick={() => handlePray(r.id)}
                className={`mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  hasPrayed
                    ? "bg-red-100 text-red-700"
                    : "border border-brand-tan text-brand-brown hover:bg-brand-beige"
                }`}
              >
                <Heart className={`h-4 w-4 ${hasPrayed ? "fill-current" : ""}`} />
                I&apos;m praying4you {count > 0 && `(${count})`}
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}
