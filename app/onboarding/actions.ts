"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isDiscordConfigured, sendProfileModeration } from "@/lib/discord"
import { validatePhone } from "@/lib/phone"

export async function completeOnboarding(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized. Please sign in again." }
    }

    const firstName = (formData.get("firstName") as string) || ""
    const age = Number(formData.get("age"))
    const country = (formData.get("country") as string) || ""
    const state = (formData.get("state") as string) || ""
    const phoneRaw = (formData.get("phone") as string) || ""
    const purposeRaw = (formData.get("purpose") as string) || ""
    const tos = formData.get("tos") === "on"

    if (!firstName.trim()) {
      return { error: "Please enter your first name." }
    }
    if (!age || age < 13) {
      return { error: "You must be 13 or older to create an account." }
    }
    if (!country.trim() || !state.trim()) {
      return { error: "Please enter your country and state or province." }
    }
    if (!tos) {
      return { error: "You must agree to the Terms of Service and Privacy Policy." }
    }

    const phoneCheck = validatePhone(phoneRaw, country)
    if (!phoneCheck.valid) {
      console.error("Phone validation failed:", { phoneRaw, country, iso: phoneCheck.countryCode })
      if (!phoneCheck.countryCode) {
        return { error: `Please select a valid country (received "${country}").` }
      }
      return { error: `Please enter a valid phone number for ${country}.` }
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboarded: true },
    })

    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {
        firstName,
        age,
        country,
        state,
        phone: phoneCheck.formatted,
        purpose: purposeRaw,
        tosAgreed: true,
        onboarded: true,
      },
      create: {
        id: session.user.id,
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        image: session.user.image ?? undefined,
        firstName,
        age,
        country,
        state,
        phone: phoneCheck.formatted,
        purpose: purposeRaw,
        tosAgreed: true,
        onboarded: true,
      },
    })

    if (isDiscordConfigured() && !existingUser?.onboarded) {
      try {
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
      } catch (e) {
        console.error("Discord profile moderation failed:", e)
      }
    }

    return { success: true }
  } catch (err) {
    console.error("completeOnboarding error:", err)
    return {
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    }
  }
}
