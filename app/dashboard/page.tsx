import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getUserTags } from "@/lib/tags"
import { redirect } from "next/navigation"
import { DashboardView } from "../components/DashboardView"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.onboarded) redirect("/onboarding")

  const tags = await getUserTags(user.id)

  const [notifications, devotional, personal, deep, hard] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.findFirst({ where: { category: "DEVOTIONAL" }, orderBy: { createdAt: "desc" } }),
    prisma.question.findFirst({ where: { category: "PERSONAL" }, orderBy: { createdAt: "desc" } }),
    prisma.question.findFirst({ where: { category: "DEEP" }, orderBy: { createdAt: "desc" } }),
    prisma.question.findFirst({ where: { category: "HARD" }, orderBy: { createdAt: "desc" } }),
  ])

  return (
    <DashboardView
      user={{ firstName: user.firstName, name: user.name, age: user.age }}
      tags={tags}
      notifications={notifications}
      categoryItems={{ devotional, personal, deep, hard }}
    />
  )
}
