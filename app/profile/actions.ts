"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const image = formData.get("image") as string
  const bio = formData.get("bio") as string
  const favoriteSong = formData.get("favoriteSong") as string

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      image: image || undefined,
      bio,
      favoriteSong,
    },
  })

  return { success: true }
}

export async function getUserWithPrayers() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      prayerRequests: {
        orderBy: { createdAt: "desc" },
        include: { reactions: true },
      },
    },
  })
}
