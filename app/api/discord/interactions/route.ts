import { NextRequest } from "next/server"
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const publicKey = process.env.DISCORD_PUBLIC_KEY || ""

type Embed = {
  title?: string
  color?: number
  fields?: { name: string; value: string; inline?: boolean }[]
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-signature-ed25519") || ""
  const timestamp = request.headers.get("x-signature-timestamp") || ""
  const body = await request.text()

  const isValid = await verifyKey(body, signature, timestamp, publicKey)
  if (!isValid) {
    return new Response("Invalid request signature", { status: 401 })
  }

  const interaction: Record<string, unknown> = JSON.parse(body)

  if (interaction.type === InteractionType.PING) {
    return Response.json({ type: InteractionResponseType.PONG })
  }

  const message = (interaction.message as Record<string, unknown>) || {}
  const originalEmbeds = (message.embeds as Embed[]) || []

  function respondUpdate(updatedEmbeds: Embed[], components: unknown[] = []) {
    return Response.json({
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: { embeds: updatedEmbeds, components },
    })
  }

  function ephemeral(content: string) {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content, flags: 64 },
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

  async function notifyPrayerDenial(id: string, reason: string) {
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

  async function notifyStoryDenial(id: string, reason: string) {
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

  async function notifyProfileDenial(id: string, reason: string) {
    await prisma.notification.create({
      data: {
        userId: id,
        message: `Your profile was denied for ${reason}`,
      },
    })
  }

  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const data = interaction.data as Record<string, unknown>
    const [kind, action, id] = ((data.custom_id as string) || "").split(":")

    if (action === "pass") {
      try {
        if (kind === "prayer") {
          await prisma.prayerRequest.update({ where: { id }, data: { status: "APPROVED" } })
        } else if (kind === "story") {
          await prisma.storyRequest.update({ where: { id }, data: { status: "APPROVED" } })
        } else if (kind === "profile") {
          await prisma.user.update({ where: { id }, data: { role: "approved" } })
        }
        return respondUpdate(updateEmbedStatus("Approved", undefined, 0x2ecc71))
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return ephemeral(`Failed to approve: ${message}`)
      }
    }

    if (action === "deny") {
      return modal(kind, id)
    }
  }

  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const data = interaction.data as Record<string, unknown>
    const [kind] = ((data.custom_id as string) || "").split(":")
    const id = ((data.custom_id as string) || "").split(":")[2]
    const components = (data.components as { components: { value?: string }[] }[]) || []
    const reasonRow = components[0]?.components?.[0]
    const reason = reasonRow?.value || "No reason given"

    try {
      if (kind === "prayer") {
        await prisma.prayerRequest.update({
          where: { id },
          data: { status: "DENIED", denialReason: reason },
        })
        await notifyPrayerDenial(id, reason)
      } else if (kind === "story") {
        await prisma.storyRequest.update({
          where: { id },
          data: { status: "DENIED", denialReason: reason },
        })
        await notifyStoryDenial(id, reason)
      } else if (kind === "profile") {
        await prisma.user.update({ where: { id }, data: { role: "denied" } })
        await notifyProfileDenial(id, reason)
      }
      return respondUpdate(updateEmbedStatus("Denied", reason, 0xe74c3c))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return ephemeral(`Failed to deny: ${message}`)
    }
  }

  return new Response("Unhandled interaction type", { status: 400 })
}
