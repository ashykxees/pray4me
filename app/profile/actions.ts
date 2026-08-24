"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export interface SongResult {
  trackName: string
  artistName: string
  trackViewUrl: string
  previewUrl?: string
  artworkUrl100?: string
}

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const image = formData.get("image") as string
  const bio = formData.get("bio") as string
  const favoriteSong = formData.get("favoriteSong") as string
  const favoriteSongUrl = (formData.get("favoriteSongUrl") as string) || null
  const favoriteSongPreviewUrl = (formData.get("favoriteSongPreviewUrl") as string) || null

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      image: image || undefined,
      bio,
      favoriteSong,
      favoriteSongUrl,
      favoriteSongPreviewUrl,
    },
  })

  return { success: true }
}

export async function searchSongs(query: string): Promise<SongResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=15&explicit=No`

  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return []

    const data = await res.json()
    const results = (data.results || []).sort((a: { primaryGenreName?: string }, b: { primaryGenreName?: string }) => {
      const aWorship = /Christian|Gospel|Worship/i.test(a.primaryGenreName || "") ? 1 : 0
      const bWorship = /Christian|Gospel|Worship/i.test(b.primaryGenreName || "") ? 1 : 0
      return bWorship - aWorship
    })

    return results.slice(0, 10).map((item: {
      trackName: string
      artistName: string
      trackViewUrl: string
      previewUrl?: string
      artworkUrl100?: string
    }) => ({
      trackName: item.trackName,
      artistName: item.artistName,
      trackViewUrl: item.trackViewUrl,
      previewUrl: item.previewUrl,
      artworkUrl100: item.artworkUrl100,
    }))
  } catch {
    return []
  }
}

export async function getUserWithPrayers() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      prayerRequests: {
        orderBy: { createdAt: "desc" },
        include: { reactions: true },
      },
    },
  })
}
