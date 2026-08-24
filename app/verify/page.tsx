"use client"

import { signIn } from "next-auth/react"
import { Shield } from "lucide-react"

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 py-12 text-center">
      <div className="card w-full max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-beige text-brand-brown-dark">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-semibold text-brand-brown-dark">Verify with Discord</h1>
        <p className="text-brand-sand">
          At pray4me we extremely value your security and privacy. Click below to verify your
          account through Discord and receive the Verified badge.
        </p>
        <button
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          className="btn-primary w-full"
        >
          Verify with Discord
        </button>
      </div>
    </main>
  )
}
