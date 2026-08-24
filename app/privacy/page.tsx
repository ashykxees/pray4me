export const metadata = {
  title: "Privacy Policy — Pray4Me",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-4xl text-brand-brown-dark">Privacy Policy</h1>
      <p className="mb-8 text-brand-sand">Last updated: August 24, 2026</p>
      <div className="card space-y-8 leading-relaxed text-brand-brown">
        <p className="text-lg">
          Pray4Me is committed to protecting your privacy. This policy explains what information we collect and how we use it.
        </p>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">1. Information We Collect</h2>
          <p>When you sign up, we collect your name, email, age, country, state, phone number, and profile information. We also store prayer requests, questions, answers, and story submissions.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">2. How We Use Your Information</h2>
          <p>We use your information to provide a safe, age-appropriate community, connect you with others for prayer, and coordinate story call bookings.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">3. Sharing</h2>
          <p>We do not sell your information. Moderators may review submissions for safety. Content you choose to share publicly may be visible to other users in your age group.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">4. Your Choices</h2>
          <p>You can update your profile at any time. You may request deletion of your account by contacting us.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">5. Security</h2>
          <p>We use reasonable measures to protect your data, but no system is completely secure.</p>
        </section>
      </div>
    </div>
  )
}
