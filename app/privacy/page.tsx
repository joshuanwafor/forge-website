import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Backdrop } from "@/components/ui/Backdrop";
import { Container, Eyebrow } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles the information you send through this website.`,
  alternates: { canonical: "/privacy" },
};

/**
 * Describes what this site's forms actually do — the waitlist, tour and
 * newsletter endpoints in app/api. Keep it in step with those routes; it is a
 * plain-language notice, not a substitute for legal review.
 */
export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
          <Backdrop variant="subtle" />
          <Container>
            <div className="max-w-prose">
              <Eyebrow className="mb-5">Privacy</Eyebrow>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                What we do with your details
              </h1>
              <p className="mt-6 text-lg text-ink-300">
                Short version: we collect what the forms on this site ask for, we use it to
                reply to you, and we don&apos;t sell it.
              </p>
            </div>
          </Container>
        </section>

        <Container className="pb-24">
          <article
            className="prose prose-invert max-w-prose
              prose-headings:font-display prose-headings:tracking-tight
              prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-semibold
              prose-p:leading-[1.75]
              prose-a:font-medium prose-a:underline prose-a:decoration-ember-500/40 prose-a:underline-offset-4
              prose-li:marker:text-ember-500/70"
          >
            <h2>What we collect</h2>
            <p>Only what you type into a form on this site:</p>
            <ul>
              <li>
                <strong>Tour requests</strong> — name, email, phone (optional), team size, what
                you&apos;re interested in, your preferred date and time, and any message.
              </li>
              <li>
                <strong>Waitlist</strong> — name, email, phone (optional), what you need, how
                you heard about us, and any message.
              </li>
              <li>
                <strong>Newsletter</strong> — your email address and which page you subscribed
                from.
              </li>
            </ul>
            <p>
              We do not run advertising trackers or third-party analytics scripts on this site.
            </p>

            <h2>Where it goes</h2>
            <p>
              Submissions are stored in our Supabase database. Where you have signed up for
              email from us, your address is also added to our Zoho Campaigns list so we can
              send it. Both are processors acting on our instructions.
            </p>

            <h2>How we use it</h2>
            <p>
              To reply to you, arrange your visit, let you know when a desk frees up, and — only
              if you asked for it — send the newsletter. We don&apos;t sell your details or pass
              them to anyone else for their own marketing.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Tour requests and waitlist entries are kept while they are still relevant and
              reviewed periodically. Newsletter subscriptions are kept until you unsubscribe.
            </p>

            <h2>Your choices</h2>
            <p>
              Every email we send has an unsubscribe link. You can also ask us for a copy of
              what we hold about you, ask us to correct it, or ask us to delete it — email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> and we will action it.
            </p>

            <h2>Cookies</h2>
            <p>
              This site sets no cookies of its own. Some pages remember nothing between visits.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about any of this go to{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>, or ask at the front desk.
            </p>
          </article>
        </Container>
      </main>

      <Footer />
    </>
  );
}
