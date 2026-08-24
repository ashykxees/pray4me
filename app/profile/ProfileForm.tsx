"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"
import { updateProfile } from "./actions"

export function ProfileForm({
  user,
}: {
  user: {
    firstName?: string | null
    name?: string | null
    image?: string | null
    bio?: string | null
    favoriteSong?: string | null
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
  const [favoriteSong, setFavoriteSong] = useState(user.favoriteSong || "")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = new FormData()
    data.set("image", image)
    data.set("bio", bio)
    data.set("favoriteSong", favoriteSong)
    try {
      await updateProfile(data)
      setMessage("Profile saved.")
      router.refresh()
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Could not save profile.")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-brand-brown-dark">Edit your profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-beige text-2xl font-bold text-brand-brown">
              {user.firstName?.[0] || user.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1">
            <label className="block text-sm font-medium text-brand-brown-dark">Profile Picture URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-tan bg-brand-cream p-2.5 text-brand-brown-dark"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brown-dark">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-tan bg-brand-cream p-2.5 text-brand-brown-dark"
            rows={4}
            placeholder="Share a little about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brown-dark">Favorite Worship Song</label>
          <input
            type="text"
            value={favoriteSong}
            onChange={(e) => setFavoriteSong(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-tan bg-brand-cream p-2.5 text-brand-brown-dark"
            placeholder="Song title / artist"
          />
        </div>

        {message && <p className="rounded-lg bg-brand-beige p-3 text-brand-brown-dark">{message}</p>}

        <button
          type="submit"
          className="rounded-full bg-brand-brown px-6 py-2 text-brand-cream hover:bg-brand-brown-dark"
        >
          Save Profile
        </button>
      </form>

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-brand-brown-dark">Current Prayer Requests</h2>
        {user.prayerRequests.length === 0 ? (
          <p className="text-brand-sand">You have not submitted any prayer requests yet.</p>
        ) : (
          <ul className="space-y-4">
            {user.prayerRequests.map((pr) => (
              <li key={pr.id} className="rounded-xl border border-brand-tan p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-brown-dark">
                    {pr.title || pr.prayer.slice(0, 50) + (pr.prayer.length > 50 ? "..." : "")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
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
                <p className="mt-2 text-sm text-brand-brown">{pr.prayer}</p>
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
