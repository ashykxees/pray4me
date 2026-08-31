const { Client, GatewayIntentBits, Events } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

const token = process.env.DISCORD_BOT_TOKEN
const rest = token ? new REST({ version: "10" }).setToken(token) : null
const verificationChannelId = process.env.DISCORD_VERIFICATION_CHANNEL_ID
const appUrl = process.env.PUBLIC_APP_URL || "https://pray4me.cc"
const applicationId = process.env.DISCORD_APPLICATION_ID
const guildId = process.env.DISCORD_GUILD_ID
const unverifiedRoleId = process.env.DISCORD_UNVERIFIED_ROLE_ID || "1541282402582663208"

function buildVerificationBody() {
  return {
    embeds: [
      {
        title: "__Welcome to pray4me!__",
        description:
          "> At pray4me we extremley value your security and privacy. So, we require all users to verify themselves using our system. You will be redirected to an authorization page to become verified.",
        color: 0x5d4037,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Verify with Discord",
            url: `${appUrl}/verify`,
          },
        ],
      },
    ],
  }
}

async function registerCommands() {
  if (!rest || !applicationId) {
    console.warn("DISCORD_BOT_TOKEN or DISCORD_APPLICATION_ID not set. Skipping slash-command registration.")
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
      await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands })
      console.log(`Registered guild slash commands in ${guildId}`)
    } else {
      await rest.put(Routes.applicationCommands(applicationId), { body: commands })
      console.log("Registered global slash commands")
    }
  } catch (err) {
    console.error("Failed to register slash commands:", err)
  }
}

async function ensureVerificationMessage() {
  if (!rest || !verificationChannelId) {
    console.log("DISCORD_VERIFICATION_CHANNEL_ID not set; skipping verification embed.")
    return
  }

  try {
    const messages = (await rest.get(`${Routes.channelMessages(verificationChannelId)}?limit=50`)) || []

    const matching = Array.isArray(messages)
      ? messages.filter(
          (message) =>
            message.author?.bot &&
            message.embeds?.some((embed) => embed.title?.includes("Welcome to pray4me"))
        )
      : []

    if (matching.length > 0) {
      const [primary, ...duplicates] = matching
      // Edit the existing welcome embed so the link stays current.
      await rest.patch(Routes.channelMessage(verificationChannelId, primary.id), {
        body: buildVerificationBody(),
      })
      console.log(`Verification embed updated in channel ${verificationChannelId}`)

      // Clean up any duplicate welcome messages from previous deploys.
      for (const duplicate of duplicates) {
        try {
          await rest.delete(Routes.channelMessage(verificationChannelId, duplicate.id))
        } catch (err) {
          console.error("Failed to delete duplicate verification message:", err)
        }
      }
      return
    }

    await rest.post(Routes.channelMessages(verificationChannelId), { body: buildVerificationBody() })
    console.log(`Verification embed posted in channel ${verificationChannelId}`)
  } catch (err) {
    console.error("Failed to post verification embed:", err)
  }
}

client.once("ready", () => {
  console.log(`Discord gateway bot logged in as ${client.user?.tag || "unknown"}`)
  if (client.user) {
    client.user.setActivity("Pray4Me", { type: 3 })
  }
  void registerCommands()
  void ensureVerificationMessage()
})

client.on(Events.GuildMemberAdd, async (member) => {
  if (!unverifiedRoleId || member.user.bot) return
  try {
    await member.roles.add(unverifiedRoleId)
    console.log(`Assigned unverified role to ${member.user.tag}`)
  } catch (err) {
    console.error("Failed to assign unverified role:", err)
  }
})

if (!token) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord gateway bot will not start.")
  process.exit(0)
}

client.login(token).catch((err) => {
  console.error("Discord bot failed to log in:", err)
  process.exit(1)
})
