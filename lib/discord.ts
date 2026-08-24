import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

const token = process.env.DISCORD_BOT_TOKEN

const rest = token ? new REST({ version: "10" }).setToken(token) : null

export function isDiscordConfigured() {
  return !!rest
}

type GuildMember = {
  user?: { id: string }
  roles: string[]
}

export async function getGuildMember(userId: string): Promise<GuildMember | null> {
  const guildId = process.env.DISCORD_GUILD_ID
  if (!rest || !guildId) return null

  try {
    const member = (await rest.get(Routes.guildMember(guildId, userId))) as GuildMember
    return member
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404) {
      return null
    }
    console.error("Failed to fetch Discord guild member:", err)
    return null
  }
}

type ActionRow = {
  type: number
  components: { type: number; style: number; label: string; custom_id: string }[]
}

async function sendChannelMessage(channelId: string, body: object) {
  if (!rest || !channelId) {
    console.warn("Discord bot token or channel ID not configured. Message not sent.")
    return null
  }
  return rest.post(Routes.channelMessages(channelId), { body }) as Promise<unknown>
}

export async function updateChannelMessage(channelId: string, messageId: string, body: object) {
  if (!rest || !channelId || !messageId) return null
  return rest.patch(Routes.channelMessage(channelId, messageId), { body }) as Promise<unknown>
}

function passDenyButtons(type: "prayer" | "story", id: string): ActionRow[] {
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 3,
          label: "Pass",
          custom_id: `${type}:pass:${id}`,
        },
        {
          type: 2,
          style: 4,
          label: "Deny",
          custom_id: `${type}:deny:${id}`,
        },
      ],
    },
  ]
}

export async function sendProfileModeration(user: {
  id: string
  firstName?: string | null
  name?: string | null
  age?: number | null
  email?: string | null
  country?: string | null
  state?: string | null
  phone?: string | null
}) {
  const channelId = process.env.DISCORD_PROFILE_MODERATION_CHANNEL_ID
  return sendChannelMessage(channelId!, {
    embeds: [
      {
        title: "New user profile",
        color: 0xc9a689,
        fields: [
          { name: "Name", value: user.firstName || user.name || "N/A", inline: true },
          { name: "Age", value: String(user.age ?? "N/A"), inline: true },
          { name: "Email", value: user.email || "N/A", inline: false },
          { name: "Country & State", value: `${user.country || "N/A"}, ${user.state || "N/A"}`, inline: false },
          { name: "Phone", value: user.phone || "N/A", inline: true },
          { name: "Agreed to ToS/Privacy", value: "Yes", inline: true },
        ],
      },
    ],
  })
}

export async function sendPrayerModeration(request: {
  id: string
  title?: string
  prayer: string
  explanation?: string | null
  email?: string | null
  firstName?: string | null
  phone?: string | null
}) {
  const channelId = process.env.DISCORD_PRAYER_MODERATION_CHANNEL_ID
  return sendChannelMessage(channelId!, {
    embeds: [
      {
        title: request.title || "New Prayer Request",
        color: 0x5d4037,
        fields: [
          { name: "Submitted by", value: `${request.firstName || "N/A"} (${request.email || "N/A"})`, inline: false },
          { name: "Phone", value: request.phone || "N/A", inline: true },
          { name: "Prayer", value: request.prayer, inline: false },
          { name: "Explanation", value: request.explanation || "None provided", inline: false },
        ],
      },
    ],
    components: passDenyButtons("prayer", request.id),
  })
}

export async function sendStorySubmission(story: {
  id: string
  name: string
  age: number
  email: string
  language: string
  bookingLink: string
}) {
  const channelId = process.env.DISCORD_STORY_MODERATION_CHANNEL_ID
  return sendChannelMessage(channelId!, {
    embeds: [
      {
        title: "New Story Submission",
        color: 0x8d6e63,
        fields: [
          { name: "Name", value: story.name, inline: true },
          { name: "Age", value: String(story.age), inline: true },
          { name: "Email", value: story.email, inline: false },
          { name: "Spoken Language", value: story.language, inline: true },
          { name: "Booking Link", value: story.bookingLink, inline: false },
        ],
      },
    ],
    components: passDenyButtons("story", story.id),
  })
}
