"use client"

import Link from "next/link"
import { Heart, BookOpen, HelpCircle, MessageCircle, Bell, PlusCircle } from "lucide-react"
import { ProfileTags } from "./ProfileTags"
import type { Tag } from "@/lib/tags"

type UserPreview = {
  firstName?: string | null
  name?: string | null
  age?: number | null
}

type Notification = {
  id: string
  message: string
}

type CategoryItems = {
  devotional?: { content?: string | null } | null
  personal?: { content?: string | null } | null
  deep?: { content?: string | null } | null
  hard?: { content?: string | null } | null
}

function ageRange(age: number | null | undefined) {
  if (!age) return null
  if (age <= 14) return "13-14"
  if (age <= 17) return "15-17"
  return "18+"
}

export function DashboardView({
  user,
  tags,
  notifications,
  categoryItems,
}: {
  user: UserPreview
  tags: Tag[]
  notifications: Notification[]
  categoryItems: CategoryItems
}) {
  const pinned = [
    { label: "Daily Devotional", icon: BookOpen, href: "/dashboard/devotional", item: categoryItems.devotional, hint: "Start your day with reflection." },
    { label: "Personal Questions", icon: HelpCircle, href: "/dashboard/personal", item: categoryItems.personal, hint: "Explore what's on your heart." },
    { label: "Deep Thought", icon: MessageCircle, href: "/dashboard/deep", item: categoryItems.deep, hint: "Pause and reflect deeply." },
    { label: "Hard Questions", icon: Heart, href: "/dashboard/questions", item: categoryItems.hard, hint: "View what others have on their mind." },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl text-brand-brown-dark">Dashboard</h1>
          <p className="mt-1 text-brand-brown">
            Welcome back, {user.firstName || user.name || "friend"}.
            {user.age && <span className="ml-2 rounded-full bg-brand-beige px-2.5 py-0.5 text-xs font-semibold text-brand-brown">{ageRange(user.age)}</span>}
          </p>
          <div className="mt-2">
            <ProfileTags tags={tags} />
          </div>
        </div>
        <Link href="/dashboard/prayer/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" />
          Create Prayer Request
        </Link>
      </div>

      {notifications.length > 0 && (
        <div className="mb-8 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-2xl border-l-4 border-brand-warm-tan bg-white p-4 text-brand-deep-brown shadow-sm"
            >
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-brand-warm-tan" />
              {n.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pinned.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="card-soft group flex flex-col justify-between"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-sand">{card.label}</span>
              <card.icon className="h-5 w-5 text-brand-brown transition group-hover:text-brand-brown-dark" />
            </div>
            <p className="mb-3 line-clamp-3 text-brand-brown-dark">
              {card.item?.content || card.hint}
            </p>
            <span className="mt-auto text-xs font-semibold text-brand-sand">
              {card.item ? (card.label === "Hard Questions" ? "View what others have on their mind" : "Pinned") : "Be the first to share"}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl text-brand-brown-dark">Prayer Requests</h2>
            <p className="text-sm text-brand-sand">
              View prayer requests from others in your age group and let them know you are praying.
            </p>
          </div>
        </div>
        <Link href="/dashboard/prayer" className="btn-secondary">
          View Prayer Requests
        </Link>
      </div>
    </div>
  )
}
