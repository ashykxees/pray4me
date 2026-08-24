const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.once("ready", () => {
  console.log(`Discord gateway bot logged in as ${client.user?.tag || "unknown"}`)
  if (client.user) {
    client.user.setActivity("Pray4Me", { type: 3 })
  }
})

if (!process.env.DISCORD_BOT_TOKEN) {
  console.warn("DISCORD_BOT_TOKEN is not set. Discord gateway bot will not start.")
  process.exit(0)
}

client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
  console.error("Discord bot failed to log in:", err)
  process.exit(1)
})
