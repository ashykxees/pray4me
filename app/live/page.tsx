import { Lock } from "lucide-react"

export const metadata = {
  title: "Live Sermons — Pray4Me",
}

export default function LiveSermonsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <Lock className="mx-auto mb-4 h-12 w-12 text-brand-sand" />
        <h1 className="mb-2 text-4xl font-bold text-brand-brown-dark">COMING SOON</h1>
        <p className="text-brand-brown">Watch live sermons and join the community in worship.</p>
      </div>
    </div>
  )
}
