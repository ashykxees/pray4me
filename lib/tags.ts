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

const badgeBase = "bg-[#f4e8d6] text-[#3b2117] border-[#c99a6b]"
const badgeMuted = "bg-[#d8c0a3]/40 text-[#3b2117] border-[#c99a6b]"
const badgeAccent = "bg-[#e6b58a]/30 text-[#3b2117] border-[#c99a6b]"
const badgeDark = "bg-[#3b2117] text-[#f4e8d6] border-[#c99a6b]"

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
      color: badgeAccent,
      description: "Site founder",
    })
    tags.push({
      id: "verified",
      label: "Verified",
      icon: "verified",
      color: badgeBase,
      description: "Verified community member",
    })
  }

  if (user.prayerRequests.length > 0) {
    tags.push({
      id: "pray",
      label: "Prayer",
      icon: "pray",
      color: badgeBase,
      description: "Submitted a prayer request",
    })
  }

  if (user.storyRequests.some((s) => s.bookingLink || s.status === "APPROVED")) {
    tags.push({
      id: "cross",
      label: "Testimony",
      icon: "cross",
      color: badgeAccent,
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
          color: badgeBase,
          description: "Member of the Discord server",
        })
      }

      const staffRoleId = process.env.DISCORD_STAFF_ROLE_ID
      if (staffRoleId && member.roles.includes(staffRoleId)) {
        tags.push({
          id: "shield",
          label: "Staff",
          icon: "shield",
          color: badgeMuted,
          description: "Discord staff member",
        })
      }

      const pastorRoleId = process.env.DISCORD_PASTOR_ROLE_ID
      if (pastorRoleId && member.roles.includes(pastorRoleId)) {
        tags.push({
          id: "bible",
          label: "Pastor",
          icon: "bible",
          color: badgeDark,
          description: "Discord pastor",
        })
      }
    }
  }

  return tags
}
