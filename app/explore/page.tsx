import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Heart, BookOpen, Calendar, Globe, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ExplorePage() {
  const [prayers, stories] = await Promise.all([
    prisma.prayerRequest.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { firstName: true, age: true } },
        reactions: { select: { id: true } },
      },
    }),
    prisma.storyRequest.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { firstName: true } },
      },
    }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl text-brand-brown-dark sm:text-5xl">Explore</h1>
        <p className="mx-auto max-w-2xl text-lg text-brand-brown">
          Read prayers shared by the community and discover testimony recordings.
        </p>
      </div>

      <section className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-brand-brown-dark">Prayer Requests</h2>
          <Link href="/dashboard/prayer/new" className="btn-secondary text-sm">
            Share a prayer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {prayers.length === 0 ? (
          <div className="card text-center">
            <p className="text-brand-brown">No public prayer requests yet.</p>
            <p className="mt-1 text-sm text-brand-sand">Be the first to ask for prayer.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {prayers.map((r) => (
              <div key={r.id} className="card">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige font-heading text-lg font-semibold text-brand-brown">
                    {(r.user?.firstName || "A")[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-brown-dark">
                      {r.user?.firstName || "Anonymous"}
                    </p>
                    <p className="text-xs text-brand-sand">
                      {r.user?.age ? `Age ${r.user.age}` : ""} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-brand-brown-dark">{r.prayer}</p>
                {r.explanation && (
                  <p className="mt-3 rounded-2xl bg-brand-beige/50 p-3 text-sm text-brand-brown">
                    {r.explanation}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-sm text-brand-rose">
                  <Heart className="h-4 w-4 fill-current" />
                  <span>{r.reactions.length} praying4you</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-brand-brown-dark">Testimony Recordings</h2>
          <Link href="/share-story" className="btn-secondary text-sm">
            Share your story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {stories.length === 0 ? (
          <div className="card text-center">
            <p className="text-brand-brown">No testimony recordings yet.</p>
            <p className="mt-1 text-sm text-brand-sand">Be the first to share your story.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {stories.map((s) => (
              <div key={s.id} className="card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-xl text-brand-brown-dark">{s.name}</h3>
                <p className="mb-3 text-sm text-brand-sand">
                  {s.age} years old · {s.language}
                </p>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-brand-brown">
                  {s.user?.firstName && (
                    <span className="rounded-full bg-brand-beige px-3 py-1">
                      Shared by {s.user.firstName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-beige px-3 py-1">
                    <Globe className="h-3.5 w-3.5" />
                    {s.language}
                  </span>
                </div>
                <a
                  href={s.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Book a recording session
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
