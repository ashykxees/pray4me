import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PrayerList } from "./PrayerList"
import { PlusCircle } from "lucide-react"

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-brand-brown-dark">Prayer Requests</h1>
          <p className="mt-1 text-brand-sand">
            Showing prayers from ages {range.min}-{range.max === 120 ? "18+" : range.max}.
          </p>
        </div>
        <Link href="/dashboard/prayer/new" className="btn-secondary">
          <PlusCircle className="h-4 w-4" />
          Create
        </Link>
      </div>
      <PrayerList requests={requests} currentUserId={user.id} />
    </div>
  )
}
