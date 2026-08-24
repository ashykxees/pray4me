"use client"

import { signIn } from "next-auth/react"
import { Headphones } from "lucide-react"

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <Headphones className="mx-auto mb-4 h-12 w-12 text-brand-sand" />
        <h1 className="mb-2 text-4xl font-bold text-brand-brown-dark">COMING SOON</h1>
        <p className="mb-8 text-brand-brown">Listen to other&apos;s stories and share your own.</p>
        <button
          onClick={() => signIn("discord", { callbackUrl: "/share-story" })}
          className="rounded-full bg-brand-brown px-6 py-3 font-semibold text-brand-cream hover:bg-brand-brown-dark"
        >
          Share your story
        </button>
      </div>
    </div>
  )
}
