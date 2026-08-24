"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendPrayerModeration } from "@/lib/discord"

export async function createPrayerRequest(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const prayer = formData.get("prayer") as string
  const explanation = formData.get("explanation") as string

  const title = prayer.length > 50 ? prayer.slice(0, 50) + "..." : prayer

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.age) throw new Error("Please complete onboarding first.")

  const request = await prisma.prayerRequest.create({
    data: {
      title,
      prayer,
      explanation: explanation || null,
      userId: session.user.id,
    },
  })

  await sendPrayerModeration({
    id: request.id,
    title: request.title,
    prayer: request.prayer,
    explanation: request.explanation,
    email: user.email,
    firstName: user.firstName,
    phone: user.phone,
  })

  return { success: true, id: request.id }
}
