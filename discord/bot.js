const { Client, GatewayIntentBits } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

const token = process.env.DISCORD_BOT_TOKEN
const rest = token ? new REST({ version: "10" }).setToken(token) : null
const verificationChannelId = process.env.DISCORD_VERIFICATION_CHANNEL_ID
const appUrl = process.env.PUBLIC_APP_URL || "https://pray4me.cc"

async function ensureVerificationMessage() {
  if (!rest || !verificationChannelId) {
    console.log("DISCORD_VERIFICATION_CHANNEL_ID not set; skipping verification embed.")
    return
  }

  try {
    const messages = (await rest.get(`${Routes.channelMessages(verificationChannelId)}?limit=50`)) || []

    // Remove any previous verification embeds from this bot so the latest copy is reposted.
    if (Array.isArray(messages)) {
      for (const message of messages) {
        if (
          message.author?.bot &&
          message.embeds?.some((embed) => embed.title?.includes("Welcome to pray4me"))
        ) {
          try {
            await rest.delete(Routes.channelMessage(verificationChannelId, message.id))
          } catch (err) {
            console.error("Failed to delete old verification message:", err)
          }
        }
      }
    }

    await rest.post(Routes.channelMessages(verificationChannelId), {
      body: {
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
      },
    })

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
  void ensureVerificationMessage()
})

if (!token) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord gateway bot will not start.")
  process.exit(0)
}

client.login(token).catch((err) => {
  console.error("Discord bot failed to log in:", err)
  process.exit(1)
})
