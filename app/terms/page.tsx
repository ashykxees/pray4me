export const metadata = {
  title: "Terms of Service — Pray4Me",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-4xl text-brand-brown-dark">Terms of Service</h1>
      <p className="mb-8 text-brand-sand">Last updated: August 24, 2026</p>
      <div className="card space-y-8 leading-relaxed text-brand-brown">
        <p className="text-lg">
          Welcome to Pray4Me. By creating an account or using our services, you agree to these Terms of Service.
        </p>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">1. Eligibility</h2>
          <p>You must be at least 13 years old to use Pray4Me. Users between 13 and 17 may only interact with content from users in their age group.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">2. Acceptable Use</h2>
          <p>Pray4Me is a place for prayer, worship, encouragement, and safe community. Do not post harmful, hateful, abusive, or explicit content. Do not share personal information of others without consent.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">3. Moderation</h2>
          <p>All prayer requests, profile updates, and story submissions are reviewed by moderators. We reserve the right to approve or deny any content at our discretion.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">4. Privacy</h2>
          <p>Your personal information is handled in accordance with our Privacy Policy.</p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl text-brand-brown-dark">5. Changes</h2>
          <p>We may update these terms from time to time. Continued use of Pray4Me means you accept the updated terms.</p>
        </section>
      </div>
    </div>
  )
}
