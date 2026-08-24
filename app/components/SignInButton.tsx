"use client"

import { signIn } from "next-auth/react"

export function SignInButton({ label = "Sign in with Google" }: { label?: string }) {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="btn-primary"
    >
      {label}
    </button>
  )
}
