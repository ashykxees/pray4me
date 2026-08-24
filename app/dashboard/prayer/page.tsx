import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PrayerList } from "./PrayerList"

function ageRange(age: number) {
  if (age <= 14) return { min: 13, max: 14 }
  if (age <= 17) return { min: 15, max: 17 }
  return { min: 18, max: 120 }
}

export default async function PrayerRequestsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.age) redirect("/onboarding")

  const range = ageRange(user.age)

  const requests = await prisma.prayerRequest.findMany({
    where: {
      status: "APPROVED",
      user: { age: { gte: range.min, lte: range.max } },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, age: true } },
      reactions: { select: { userId: true } },
    },
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-brown-dark">Prayer Requests</h1>
        <Link
          href="/dashboard/prayer/new"
          className="rounded-full bg-brand-brown px-4 py-2 text-sm font-semibold text-brand-cream hover:bg-brand-brown-dark"
        >
          Create Request
        </Link>
      </div>
      <p className="mb-6 text-brand-sand">
        Showing prayers from ages {range.min}-{range.max === 120 ? "18+" : range.max}.
      </p>
      <PrayerList requests={requests} currentUserId={user.id} />
    </div>
  )
}
