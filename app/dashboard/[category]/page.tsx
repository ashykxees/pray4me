import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { CategoryView } from "./CategoryView"

const CATEGORIES: Record<string, string> = {
  devotional: "Daily Devotional",
  personal: "Personal Questions",
  deep: "Deep Thought",
  hard: "Hard Questions",
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) notFound()

  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.onboarded) redirect("/onboarding")

  const questions = await prisma.question.findMany({
    where: { category: category.toUpperCase() },
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { firstName: true, name: true } } },
      },
    },
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <CategoryView category={category} label={label} questions={questions} />
    </div>
  )
}
