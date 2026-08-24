import { NextRequest } from "next/server"
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions"
import type { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

const publicKey = process.env.DISCORD_PUBLIC_KEY?.trim() || ""
if (!publicKey) {
  console.error("DISCORD_PUBLIC_KEY is not set. Discord interactions will fail with 401.")
} else {
  console.log("DISCORD_PUBLIC_KEY loaded (prefix):", publicKey.slice(0, 8))
}

type Embed = {
  title?: string
  color?: number
  fields?: { name: string; value: string; inline?: boolean }[]
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  const signature = request.headers.get("x-signature-ed25519") || ""
  const timestamp = request.headers.get("x-signature-timestamp") || ""
  const body = await request.text()

  const isValid = await verifyKey(body, signature, timestamp, publicKey)
  if (!isValid) {
    console.error("Invalid Discord signature — check that DISCORD_PUBLIC_KEY matches the key in your Discord app's General Information.")
    return new Response("Invalid request signature", { status: 401 })
  }

  const interaction: Record<string, unknown> = JSON.parse(body)
  console.log("Discord interaction received:", interaction.type, interaction.id)

  if (interaction.type === InteractionType.PING) {
    return Response.json({ type: InteractionResponseType.PONG })
  }

  const message = (interaction.message as Record<string, unknown>) || {}
  const originalEmbeds = (message.embeds as Embed[]) || []
  const channelId = (interaction.channel_id as string) || ""
  const messageId = (message.id as string) || ""

  function respondUpdate(updatedEmbeds: Embed[], components: unknown[] = []) {
    return Response.json({
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: { embeds: updatedEmbeds, components },
    })
  }

  function modal(kind: string, id: string) {
    return Response.json({
      type: InteractionResponseType.MODAL,
      data: {
        custom_id: `${kind}:deny_modal:${id}`,
        title: "Deny submission",
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: "reason",
                label: "Explain why you are denying",
                style: 2,
                min_length: 1,
                max_length: 500,
                required: true,
              },
            ],
          },
        ],
      },
    })
  }

  function updateEmbedStatus(status: string, reason?: string, color?: number): Embed[] {
    const embed: Embed = { ...originalEmbeds[0] }
    if (color !== undefined) embed.color = color
    embed.fields = embed.fields?.filter((f) => f.name !== "Status" && f.name !== "Denial Reason")
    embed.fields = [
      ...(embed.fields || []),
      { name: "Status", value: status, inline: true },
    ]
    if (reason) {
      embed.fields.push({ name: "Denial Reason", value: reason, inline: false })
    }
    return [embed]
  }

  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const data = interaction.data as Record<string, unknown>
    const [kind, action, id] = ((data.custom_id as string) || "").split(":")

    if (action === "pass") {
      const processing = updateEmbedStatus("Processing...", undefined, 0xf1c40f)

      void (async () => {
        try {
          const { prisma } = await import("@/lib/prisma")
          const { updateChannelMessage } = await import("@/lib/discord")
          await approveSubmission(prisma, kind, id)
          const approved = updateEmbedStatus("Approved", undefined, 0x2ecc71)
          await updateChannelMessage(channelId, messageId, { embeds: approved, components: [] })
        } catch (err) {
          console.error("Failed to approve submission:", err)
          try {
            const { updateChannelMessage } = await import("@/lib/discord")
            const failed = updateEmbedStatus("Approval failed — please retry", undefined, 0xe74c3c)
            await updateChannelMessage(channelId, messageId, { embeds: failed, components: [] })
          } catch (e) {
            console.error("Failed to update message after approval error:", e)
          }
        }
      })()

      console.log("Responding to pass interaction in", Date.now() - start, "ms")
      return respondUpdate(processing, [])
    }

    if (action === "deny") {
      return modal(kind, id)
    }
  }

  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const data = interaction.data as Record<string, unknown>
    const customId = (data.custom_id as string) || ""
    const [kind] = customId.split(":")
    const id = customId.split(":")[2] ?? ""
    const components = (data.components as { components: { value?: string }[] }[]) || []
    const reasonRow = components[0]?.components?.[0]
    const reason = reasonRow?.value || "No reason given"

    const processing = updateEmbedStatus("Processing...", reason, 0xf1c40f)

    void (async () => {
      try {
        const { prisma } = await import("@/lib/prisma")
        const { updateChannelMessage } = await import("@/lib/discord")
        await denySubmission(prisma, kind, id, reason)
        const denied = updateEmbedStatus("Denied", reason, 0xe74c3c)
        await updateChannelMessage(channelId, messageId, { embeds: denied, components: [] })
      } catch (err) {
        console.error("Failed to deny submission:", err)
        try {
          const { updateChannelMessage } = await import("@/lib/discord")
          const failed = updateEmbedStatus("Denial failed — please retry", reason, 0xe74c3c)
          await updateChannelMessage(channelId, messageId, { embeds: failed, components: [] })
        } catch (e) {
          console.error("Failed to update message after denial error:", e)
        }
      }
    })()

    console.log("Responding to modal submit in", Date.now() - start, "ms")
    return respondUpdate(processing, [])
  }

  return new Response("Unhandled interaction type", { status: 400 })
}

async function approveSubmission(prisma: PrismaClient, kind: string, id: string) {
  if (kind === "prayer") {
    await prisma.prayerRequest.update({ where: { id }, data: { status: "APPROVED" } })
  } else if (kind === "story") {
    await prisma.storyRequest.update({ where: { id }, data: { status: "APPROVED" } })
  } else if (kind === "profile") {
    await prisma.user.update({ where: { id }, data: { role: "approved" } })
  }
}

async function denySubmission(prisma: PrismaClient, kind: string, id: string, reason: string) {
  if (kind === "prayer") {
    await prisma.prayerRequest.update({
      where: { id },
      data: { status: "DENIED", denialReason: reason },
    })
    await notifyPrayerDenial(prisma, id, reason)
  } else if (kind === "story") {
    await prisma.storyRequest.update({
      where: { id },
      data: { status: "DENIED", denialReason: reason },
    })
    await notifyStoryDenial(prisma, id, reason)
  } else if (kind === "profile") {
    await prisma.user.update({ where: { id }, data: { role: "denied" } })
    await notifyProfileDenial(prisma, id, reason)
  }
}

async function notifyPrayerDenial(prisma: PrismaClient, id: string, reason: string) {
  const pr = await prisma.prayerRequest.findUnique({
    where: { id },
    include: { user: true },
  })
  if (pr?.userId) {
    await prisma.notification.create({
      data: {
        userId: pr.userId,
        message: `Your ${pr.title || "prayer request"} was denied for ${reason}`,
      },
    })
  }
}

async function notifyStoryDenial(prisma: PrismaClient, id: string, reason: string) {
  const sr = await prisma.storyRequest.findUnique({ where: { id } })
  if (sr?.userId) {
    await prisma.notification.create({
      data: {
        userId: sr.userId,
        message: `Your story submission was denied for ${reason}`,
      },
    })
  }
}

async function notifyProfileDenial(prisma: PrismaClient, id: string, reason: string) {
  await prisma.notification.create({
    data: {
      userId: id,
      message: `Your profile was denied for ${reason}`,
    },
  })
}
