import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { OnboardingForm } from "./OnboardingForm"

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboarded: true },
  })

  if (user?.onboarded) {
    redirect("/dashboard")
  }

  return <OnboardingForm />
}
