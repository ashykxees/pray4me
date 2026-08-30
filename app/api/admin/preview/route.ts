import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const ADMIN_PASSWORD = "1225"

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const [devotional, personal, deep, hard] = await Promise.all([
      prisma.question.findFirst({ where: { category: "DEVOTIONAL" }, orderBy: { createdAt: "desc" } }),
      prisma.question.findFirst({ where: { category: "PERSONAL" }, orderBy: { createdAt: "desc" } }),
      prisma.question.findFirst({ where: { category: "DEEP" }, orderBy: { createdAt: "desc" } }),
      prisma.question.findFirst({ where: { category: "HARD" }, orderBy: { createdAt: "desc" } }),
    ])

    return NextResponse.json({
      user: { firstName: "Admin", name: "Admin", age: null },
      tags: [
        {
          id: "crown",
          label: "Founder",
          icon: "crown",
          color: "bg-[#e6b58a]/30 text-[#3b2117] border-[#c99a6b]",
          description: "Site founder",
        },
      ],
      notifications: [],
      categoryItems: { devotional, personal, deep, hard },
    })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
