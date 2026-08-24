"use client"

import { signIn } from "next-auth/react"
import { Headphones, Mic, Radio } from "lucide-react"

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="card">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
          <Headphones className="h-10 w-10" />
        </div>
        <h1 className="mb-3 text-5xl text-brand-brown-dark">COMING SOON</h1>
        <p className="mb-8 text-lg text-brand-brown">
          Listen to other&apos;s stories and share your own.
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="card-soft text-center">
            <Mic className="mx-auto mb-2 h-6 w-6 text-brand-sand" />
            <p className="text-sm text-brand-brown">Share your testimony with the community.</p>
          </div>
          <div className="card-soft text-center">
            <Radio className="mx-auto mb-2 h-6 w-6 text-brand-sand" />
            <p className="text-sm text-brand-brown">Hear how God is moving in others&apos; lives.</p>
          </div>
        </div>

        <button
          onClick={() => signIn("discord", { callbackUrl: "/share-story" })}
          className="btn-primary"
        >
          <Mic className="h-4 w-4" />
          Share your story
        </button>
      </div>
    </div>
  )
}
