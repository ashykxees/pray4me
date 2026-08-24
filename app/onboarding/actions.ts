"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendProfileModeration } from "@/lib/discord"

export async function completeOnboarding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const age = Number(formData.get("age"))
  const country = formData.get("country") as string
  const state = formData.get("state") as string
  const phone = formData.get("phone") as string
  const purposeRaw = formData.get("purpose") as string
  const tos = formData.get("tos") === "on"

  if (age < 13) throw new Error("You must be 13 or older to create an account.")
  if (!tos) throw new Error("You must agree to the Terms of Service and Privacy Policy.")

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      age,
      country,
      state,
      phone,
      purpose: purposeRaw,
      tosAgreed: true,
      onboarded: true,
    },
  })

  await sendProfileModeration({
    id: user.id,
    firstName: user.firstName,
    name: user.name,
    age: user.age,
    email: user.email,
    country: user.country,
    state: user.state,
    phone: user.phone,
  })

  return { success: true }
}
