import Link from "next/link"
import { Lock, Heart, Users, BookOpen, ChevronDown } from "lucide-react"
import { NotifyForm } from "./components/NotifyForm"

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#f4e8d6]">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden bg-[#3b2117] px-4 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#4a2b1d_0%,_#3b2117_55%,_#3b2117_100%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-[#c99a6b]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c99a6b]/40 bg-[#4a2b1d]/60 px-4 py-1.5 text-sm font-medium tracking-wide text-[#f4e8d6] backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" />
            COMING SOON
          </div>

          <h1 className="mb-6 font-heading text-6xl leading-[1.1] text-white sm:text-8xl">
            Pray4Me
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#d8c0a3] sm:text-xl">
            The #1 platform for prayer, community, and faith. We are putting the
            final touches on something special.
          </p>

          <NotifyForm />
        </div>

        <Link
          href="#features"
          className="absolute bottom-8 flex flex-col items-center gap-2 text-sm font-medium tracking-widest text-[#c99a6b] transition hover:text-[#e6b58a]"
        >
          EXPLORE
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-16">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl text-[#3b2117] sm:text-4xl">What is Pray4Me?</h2>
          <p className="text-[#76543d]">Everything your faith journey needs, in one place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Heart className="h-7 w-7" />}
            title="Ask for Prayer"
            description="Share what is on your heart and let others pray for you in a safe, moderated space."
          />
          <FeatureCard
            icon={<Users className="h-7 w-7" />}
            title="Connect Safely"
            description="Meet others in your age group, build friendships, and encourage one another."
          />
          <FeatureCard
            icon={<BookOpen className="h-7 w-7" />}
            title="Grow in Faith"
            description="Read devotionals, reflect on hard questions, and explore your faith at your pace."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-[#d8c0a3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c99a6b] text-[#3b2117]">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[#3b2117]">{title}</h3>
      <p className="leading-relaxed text-[#76543d]">{description}</p>
    </div>
  )
}
