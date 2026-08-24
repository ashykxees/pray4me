import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileForm } from "./ProfileForm"
import { getUserTags } from "@/lib/tags"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      prayerRequests: {
        orderBy: { createdAt: "desc" },
        include: { reactions: true },
      },
    },
  })

  if (!user) redirect("/")

  if (!user.onboarded) {
    redirect("/onboarding")
  }

  const tags = await getUserTags(user.id)

  return <ProfileForm user={user} tags={tags} />
}
