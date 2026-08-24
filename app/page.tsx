import Link from "next/link"
import { auth } from "@/auth"
import { Lock, Heart, Users, BookOpen, ChevronDown } from "lucide-react"
import { NotifyForm } from "./components/NotifyForm"
import { SignInButton } from "./components/SignInButton"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="flex flex-col bg-[#0a0415]">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/60 via-[#0a0415] to-[#0a0415]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] bg-indigo-600/20 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-purple-200 backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" />
            COMING SOON
          </div>

          <h1 className="mb-6 font-heading text-6xl leading-[1.1] text-white sm:text-8xl">
            Pray4Me
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-purple-200/80 sm:text-xl">
            The #1 platform for prayer, community, and faith. We are putting the
            final touches on something special.
          </p>

          {session?.user ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <NotifyForm />
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <span className="text-sm text-white/50">Already part of the family?</span>
                <SignInButton label="Sign in" className="btn-secondary" />
              </div>
            </>
          )}
        </div>

        <Link
          href="#features"
          className="absolute bottom-8 flex flex-col items-center gap-2 text-sm font-medium tracking-widest text-white/40 transition hover:text-white/70"
        >
          EXPLORE
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-16">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl text-white sm:text-4xl">What is Pray4Me?</h2>
          <p className="text-purple-200/70">Everything your faith journey needs, in one place.</p>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="leading-relaxed text-purple-200/70">{description}</p>
    </div>
  )
}
