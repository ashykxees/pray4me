"use client"

import { signIn } from "next-auth/react"

export function SignInButton({ label = "Sign in with Google", className }: { label?: string; className?: string }) {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className={className ?? "btn-primary"}
    >
      {label}
    </button>
  )
}
