"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "./actions"
import { SongAutocomplete } from "./SongAutocomplete"
import { Save, UserCircle2, FileText } from "lucide-react"

export function ProfileForm({
  user,
}: {
  user: {
    firstName?: string | null
    name?: string | null
    image?: string | null
    bio?: string | null
    favoriteSong?: string | null
    favoriteSongUrl?: string | null
    favoriteSongPreviewUrl?: string | null
    prayerRequests: {
      id: string
      title: string
      prayer: string
      status: string
      denialReason?: string | null
      reactions: { id: string }[]
    }[]
  }
}) {
  const router = useRouter()
  const [image, setImage] = useState(user.image || "")
  const [bio, setBio] = useState(user.bio || "")
  const [song, setSong] = useState({
    favoriteSong: user.favoriteSong || "",
    favoriteSongUrl: user.favoriteSongUrl || "",
    favoriteSongPreviewUrl: user.favoriteSongPreviewUrl || "",
  })
  const [message, setMessage] = useState("")

  function updateSong(update: Partial<typeof song>) {
    setSong((prev) => ({ ...prev, ...update }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = new FormData()
    data.set("image", image)
    data.set("bio", bio)
    data.set("favoriteSong", song.favoriteSong)
    data.set("favoriteSongUrl", song.favoriteSongUrl)
    data.set("favoriteSongPreviewUrl", song.favoriteSongPreviewUrl)
    try {
      await updateProfile(data)
      setMessage("Profile saved.")
      router.refresh()
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Could not save profile.")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-4xl text-brand-brown-dark">Edit your profile</h1>
      <p className="mb-8 text-brand-sand">Update how others see you in the community.</p>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="flex items-center gap-5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-beige text-4xl font-bold text-brand-brown shadow-lg">
              {user.firstName?.[0] || user.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1">
            <label className="label flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              Profile Picture URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input min-h-[120px]"
            rows={4}
            placeholder="Share a little about yourself..."
          />
        </div>

        <SongAutocomplete
          value={song.favoriteSong}
          previewUrl={song.favoriteSongPreviewUrl}
          trackUrl={song.favoriteSongUrl}
          onChange={updateSong}
        />

        {message && (
          <p className="rounded-2xl bg-brand-beige p-4 text-brand-brown-dark">
            {message}
          </p>
        )}

        <button type="submit" className="btn-primary">
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </form>

      <div className="mt-8 card">
        <h2 className="mb-4 text-2xl text-brand-brown-dark">Current Prayer Requests</h2>
        {user.prayerRequests.length === 0 ? (
          <p className="text-brand-sand">You have not submitted any prayer requests yet.</p>
        ) : (
          <ul className="space-y-4">
            {user.prayerRequests.map((pr) => (
              <li key={pr.id} className="rounded-2xl border border-brand-tan/40 bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-brand-brown-dark line-clamp-1">
                    {pr.title || pr.prayer.slice(0, 50) + (pr.prayer.length > 50 ? "..." : "")}
                  </span>
                  <span
                    className={`badge ${
                      pr.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : pr.status === "DENIED"
                        ? "bg-red-100 text-red-800"
                        : "bg-brand-beige text-brand-brown"
                    }`}
                  >
                    {pr.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-brand-brown line-clamp-2">{pr.prayer}</p>
                {pr.status === "DENIED" && pr.denialReason && (
                  <p className="mt-2 text-sm text-red-700">Reason: {pr.denialReason}</p>
                )}
                <p className="mt-2 text-xs text-brand-sand">
                  {pr.reactions.length} praying for you
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
