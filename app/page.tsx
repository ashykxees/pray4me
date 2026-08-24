import Image from "next/image"
import { SignInButton } from "./components/SignInButton"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <Image
        src="/logo.png"
        alt="Pray4Me logo"
        width={140}
        height={140}
        className="mb-6 rounded-full shadow-lg"
        priority
      />
      <h1 className="mb-4 text-4xl font-bold text-brand-brown-dark sm:text-5xl">
        Pray. Connect. Lift. Together.
      </h1>
      <p className="mb-8 max-w-xl text-lg text-brand-brown">
        Join a calm, welcoming community where you can worship, share your struggles,
        ask for prayer, and find help with God — completely free.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SignInButton />
      </div>
      <p className="mt-6 text-sm text-brand-sand">
        Already part of the family? Sign in above to pick up where you left off.
      </p>
    </div>
  )
}
