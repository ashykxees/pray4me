"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function postQuestion(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const category = formData.get("category") as string
  const content = formData.get("content") as string

  await prisma.question.create({
    data: { content, category, userId: session.user.id },
  })

  revalidatePath(`/dashboard/${category.toLowerCase()}`)
  return { success: true }
}

export async function postAnswer(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const questionId = formData.get("questionId") as string
  const content = formData.get("content") as string

  await prisma.answer.create({
    data: { content, questionId, userId: session.user.id },
  })

  revalidatePath("/dashboard/questions")
  return { success: true }
}
