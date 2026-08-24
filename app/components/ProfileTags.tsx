"use client"

import { BadgeCheck, Crown, Shield, BookOpen, Cross, Heart } from "lucide-react"
import type { Tag } from "@/lib/tags"

const iconMap = {
  verified: BadgeCheck,
  crown: Crown,
  shield: Shield,
  bible: BookOpen,
  cross: Cross,
  pray: Heart,
}

export function ProfileTags({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const Icon = iconMap[tag.icon]
        return (
          <span
            key={tag.id}
            title={tag.description}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${tag.color}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {tag.label}
          </span>
        )
      })}
    </div>
  )
}
