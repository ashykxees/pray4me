"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function togglePrayerReaction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const id = formData.get("id") as string
  const existing = await prisma.prayerReaction.findUnique({
    where: { prayerRequestId_userId: { prayerRequestId: id, userId: session.user.id } },
  })

  if (existing) {
    await prisma.prayerReaction.delete({ where: { id: existing.id } })
  } else {
    await prisma.prayerReaction.create({
      data: { prayerRequestId: id, userId: session.user.id },
    })
  }

  revalidatePath("/dashboard/prayer")
  return { success: true }
}
