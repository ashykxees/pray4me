import Image from "next/image"
import Link from "next/link"
import { SignInButton } from "./components/SignInButton"
import { Heart, Users, BookOpen, Compass } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Image
            src="/logo.png"
            alt="Pray4Me logo"
            width={160}
            height={160}
            className="mx-auto mb-8 rounded-full shadow-2xl shadow-brand-brown/20"
            priority
          />
          <h1 className="mb-6 text-5xl leading-tight text-brand-brown-dark sm:text-7xl">
            Pray. Connect. Lift. Together.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-brand-brown sm:text-xl">
            A calm, welcoming community where you can worship, share your struggles,
            ask for prayer, and find help with God — completely free.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignInButton label="Get Started" />
            <Link href="/explore" className="btn-secondary">
              <Compass className="h-4 w-4" />
              Explore
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-sand">
            Already part of the family? Sign in above to pick up where you left off.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card-soft text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl text-brand-brown-dark">Ask for Prayer</h3>
            <p className="text-brand-brown">
              Share what is on your heart and let others pray for you in a safe, moderated space.
            </p>
          </div>
          <div className="card-soft text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl text-brand-brown-dark">Connect Safely</h3>
            <p className="text-brand-brown">
              Meet others in your age group, build friendships, and encourage one another.
            </p>
          </div>
          <div className="card-soft text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-beige text-brand-brown">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="mb-2 text-xl text-brand-brown-dark">Grow in Faith</h3>
            <p className="text-brand-brown">
              Read devotionals, reflect on hard questions, and explore your faith at your pace.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
