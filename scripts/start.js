const { spawn } = require("child_process")

function run(command, args) {
  const child = spawn(command, args, { stdio: "inherit", env: process.env })
  child.on("exit", (code) => {
    process.exit(code || 0)
  })
  return child
}

function startDiscordBot() {
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.log("DISCORD_BOT_TOKEN not set, skipping Discord gateway bot.")
    return
  }
  console.log("Starting Discord gateway bot...")
  const bot = spawn("node", ["./discord/bot.js"], { stdio: "inherit", env: process.env })
  bot.on("exit", (code) => {
    console.log(`Discord gateway bot exited with code ${code}`)
  })
}

console.log("Running Prisma migrations...")
const migrate = spawn("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit", env: process.env })

migrate.on("close", (code) => {
  if (code !== 0) {
    console.error("Prisma migrations failed.")
    process.exit(code || 1)
  }
  console.log("Migrations applied. Starting Next.js and Discord bot...")
  startDiscordBot()
  run("npx", ["next", "start"])
})
