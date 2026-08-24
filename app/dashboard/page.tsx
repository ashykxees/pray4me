import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Heart, BookOpen, HelpCircle, MessageCircle } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.onboarded) redirect("/onboarding")

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

  const pinned = [
    { label: "Daily Devotional", icon: BookOpen, href: "/dashboard/devotional", item: devotional },
    { label: "Personal Questions", icon: HelpCircle, href: "/dashboard/personal", item: personal },
    { label: "Deep Thought", icon: MessageCircle, href: "/dashboard/deep", item: deep },
    { label: "Hard Questions", icon: Heart, href: "/dashboard/questions", item: hard },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown-dark">Dashboard</h1>
          <p className="text-brand-brown">Welcome back, {user.firstName || user.name || "friend"}.</p>
        </div>
        <Link
          href="/dashboard/prayer/new"
          className="rounded-full bg-brand-brown px-5 py-2.5 font-semibold text-brand-cream hover:bg-brand-brown-dark"
        >
          + Create Prayer Request
        </Link>
      </div>

      {notifications.length > 0 && (
        <div className="mb-8 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border-l-4 border-red-400 bg-red-50 p-4 text-red-900 shadow-sm"
            >
              {n.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pinned.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-sand">
                {card.label}
              </span>
              <card.icon className="h-5 w-5 text-brand-brown" />
            </div>
            <p className="text-brand-brown-dark">
              {card.item?.content || "Nothing pinned yet."}
            </p>
            {card.item && (
              <span className="mt-3 text-xs text-brand-sand">{card.label === "Hard Questions" ? "View what others have on their mind" : "Pinned"}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-brand-brown-dark">Prayer Requests</h2>
        <p className="mb-4 text-brand-brown">
          View prayer requests from others in your age group and let them know you are praying.
        </p>
        <Link
          href="/dashboard/prayer"
          className="inline-block rounded-full border border-brand-brown px-4 py-2 text-sm font-medium text-brand-brown hover:bg-brand-brown hover:text-brand-cream"
        >
          View Prayer Requests
        </Link>
      </div>
    </div>
  )
}
