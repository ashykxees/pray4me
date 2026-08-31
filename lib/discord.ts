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

export async function addGuildMemberRole(guildId: string, userId: string, roleId: string) {
  if (!rest || !guildId || !userId || !roleId) {
    console.warn("Discord bot token or IDs missing. Role not added.")
    return null
  }
  return rest.put(Routes.guildMemberRole(guildId, userId, roleId)) as Promise<unknown>
}

export async function removeGuildMemberRole(guildId: string, userId: string, roleId: string) {
  if (!rest || !guildId || !userId || !roleId) {
    console.warn("Discord bot token or IDs missing. Role not removed.")
    return null
  }
  return rest.delete(Routes.guildMemberRole(guildId, userId, roleId)) as Promise<unknown>
}

export async function addReaction(channelId: string, messageId: string, emoji: string) {
  if (!rest || !channelId || !messageId) {
    console.warn("Discord bot token or IDs missing. Reaction not added.")
    return null
  }
  return rest.put(`${Routes.channelMessageReaction(channelId, messageId, encodeURIComponent(emoji))}/@me`) as Promise<unknown>
}

export async function updateChannelMessage(channelId: string, messageId: string, body: object) {
  if (!rest || !channelId || !messageId) return null
  return rest.patch(Routes.channelMessage(channelId, messageId), { body }) as Promise<unknown>
}

function passDenyButtons(type: "prayer" | "story" | "request", id: string): ActionRow[] {
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

export async function registerSlashCommands() {
  if (!rest) {
    console.warn("DISCORD_BOT_TOKEN not set. Skipping slash-command registration.")
    return
  }

  const appId = process.env.DISCORD_APPLICATION_ID
  const guildId = process.env.DISCORD_GUILD_ID
  if (!appId) {
    console.warn("DISCORD_APPLICATION_ID not set. Skipping slash-command registration.")
    return
  }

  const commands = [
    {
      name: "request",
      description: "Submit a prayer request to Pray4Me",
      options: [
        {
          type: 3,
          name: "request",
          description: "what is your prayer request?",
          required: true,
        },
      ],
    },
  ]

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
      console.log(`Registered guild slash commands in ${guildId}`)
    } else {
      await rest.put(Routes.applicationCommands(appId), { body: commands })
      console.log("Registered global slash commands")
    }
  } catch (err) {
    console.error("Failed to register slash commands:", err)
  }
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

export async function sendDiscordRequestModeration(request: {
  id: string
  discordUserId: string
  discordUsername?: string | null
  request: string
}) {
  const channelId = process.env.DISCORD_REQUEST_MODERATION_CHANNEL_ID || "1541276732777299998"
  return sendChannelMessage(channelId, {
    embeds: [
      {
        title: "New Discord Prayer Request",
        color: 0x5d4037,
        fields: [
          { name: "Submitted by", value: request.discordUsername || `<@${request.discordUserId}>`, inline: false },
          { name: "Prayer Request", value: request.request, inline: false },
        ],
      },
    ],
    components: passDenyButtons("request", request.id),
  })
}

export async function sendApprovedDiscordRequest(request: {
  discordUserId: string
  discordUsername?: string | null
  request: string
}) {
  const channelId = process.env.DISCORD_REQUEST_APPROVAL_CHANNEL_ID || "1541284127335120968"
  return sendChannelMessage(channelId, {
    embeds: [
      {
        title: "Prayer Request",
        color: 0x2ecc71,
        fields: [
          { name: "Submitted by", value: request.discordUsername || `<@${request.discordUserId}>`, inline: false },
          { name: "Request", value: request.request, inline: false },
        ],
      },
    ],
  })
}
