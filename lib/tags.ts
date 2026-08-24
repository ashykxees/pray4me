import { prisma } from "./prisma"
import { getGuildMember } from "./discord"

export type Tag = {
  id: "verified" | "crown" | "shield" | "bible" | "cross" | "pray"
  label: string
  icon: "verified" | "crown" | "shield" | "bible" | "cross" | "pray"
  color: string
  description: string
}

const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || "dev.jake317@gmail.com"

export async function getUserTags(userId: string): Promise<Tag[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: { where: { provider: "discord" } },
      prayerRequests: { select: { id: true } },
      storyRequests: { select: { id: true, bookingLink: true, status: true } },
    },
  })
  if (!user) return []

  const tags: Tag[] = []

  if (user.email === FOUNDER_EMAIL) {
    tags.push({
      id: "crown",
      label: "Founder",
      icon: "crown",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Site founder",
    })
    // The founder is trusted by default; other users must still verify through Discord.
    tags.push({
      id: "verified",
      label: "Verified",
      icon: "verified",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Verified community member",
    })
  }

  if (user.prayerRequests.length > 0) {
    tags.push({
      id: "pray",
      label: "Prayer",
      icon: "pray",
      color: "bg-rose-100 text-rose-800 border-rose-200",
      description: "Submitted a prayer request",
    })
  }

  if (user.storyRequests.some((s) => s.bookingLink || s.status === "APPROVED")) {
    tags.push({
      id: "cross",
      label: "Testimony",
      icon: "cross",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      description: "Shared a testimony on-call",
    })
  }

  const discordAccount = user.accounts[0]
  if (discordAccount?.providerAccountId) {
    const member = await getGuildMember(discordAccount.providerAccountId).catch(() => null)
    if (member) {
      if (!tags.some((t) => t.id === "verified")) {
        tags.push({
          id: "verified",
          label: "Verified",
          icon: "verified",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          description: "Member of the Discord server",
        })
      }

      const staffRoleId = process.env.DISCORD_STAFF_ROLE_ID
      if (staffRoleId && member.roles.includes(staffRoleId)) {
        tags.push({
          id: "shield",
          label: "Staff",
          icon: "shield",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          description: "Discord staff member",
        })
      }

      const pastorRoleId = process.env.DISCORD_PASTOR_ROLE_ID
      if (pastorRoleId && member.roles.includes(pastorRoleId)) {
        tags.push({
          id: "bible",
          label: "Pastor",
          icon: "bible",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          description: "Discord pastor",
        })
      }
    }
  }

  return tags
}
