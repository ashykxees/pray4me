import { Lock, Video } from "lucide-react"

export const metadata = {
  title: "Live Sermons — Pray4Me",
}

export default function LiveSermonsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="card">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
          <Video className="h-10 w-10" />
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-beige px-3 py-1 text-sm font-semibold text-brand-brown">
          <Lock className="h-4 w-4" />
          Coming soon
        </div>
        <h1 className="mb-3 text-5xl text-brand-brown-dark">Live Sermons</h1>
        <p className="text-lg text-brand-brown">
          Watch live sermons and join the community in worship.
        </p>
      </div>
    </div>
  )
}
