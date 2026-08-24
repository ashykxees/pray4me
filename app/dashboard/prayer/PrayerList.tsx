"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { togglePrayerReaction } from "./actions"
import { Heart, MessageSquareWarning } from "lucide-react"

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
    <div className="space-y-5">
      {error && (
        <p className="flex items-center gap-2 rounded-2xl bg-brand-soft-peach/20 p-4 text-brand-deep-brown">
          <MessageSquareWarning className="h-5 w-5 text-brand-warm-tan" />
          {error}
        </p>
      )}
      {requests.length === 0 ? (
        <div className="card text-center">
          <p className="text-brand-brown">No prayer requests yet in your age group.</p>
          <p className="mt-2 text-sm text-brand-sand">Be the first to share a prayer.</p>
        </div>
      ) : (
        requests.map((r) => {
          const hasPrayed = r.reactions.some((reaction) => reaction.userId === currentUserId)
          const count = r.reactions.length
          return (
            <div key={r.id} className="card">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige font-heading text-lg font-semibold text-brand-brown">
                    {(r.user.firstName || "A")[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-brown-dark">
                      {r.user.firstName || "Anonymous"}
                    </p>
                    <p className="text-xs text-brand-sand">
                      {r.user.age ? `Age ${r.user.age}` : ""} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-brand-brown-dark">{r.prayer}</p>
              {r.explanation && (
                <p className="mt-3 rounded-2xl bg-brand-beige/50 p-3 text-sm text-brand-brown">
                  {r.explanation}
                </p>
              )}
              <button
                onClick={() => handlePray(r.id)}
                className={`mt-5 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  hasPrayed
                    ? "bg-brand-soft-peach/30 text-brand-deep-brown"
                    : "border border-brand-warm-beige bg-white text-brand-brown hover:bg-brand-warm-beige/40"
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
