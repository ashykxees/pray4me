"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendStorySubmission } from "@/lib/discord"

export async function submitStory(formData: FormData) {
  const session = await auth()
  const name = formData.get("name") as string
  const age = Number(formData.get("age"))
  const email = formData.get("email") as string
  const language = formData.get("language") as string
  const bookingLink = formData.get("bookingLink") as string

  const story = await prisma.storyRequest.create({
    data: {
      name,
      age,
      email,
      language,
      bookingLink,
      userId: session?.user?.id || null,
    },
  })

  await sendStorySubmission({
    id: story.id,
    name,
    age,
    email,
    language,
    bookingLink,
  })

  return { success: true }
}
