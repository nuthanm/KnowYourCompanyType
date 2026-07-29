import Link from "next/link";
import { CATEGORY_COUNTS, DATA_YEAR } from "@/lib/companies";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-meta";

const PILLARS = [
  {
    title: "Who we are",
    body: `${SITE_NAME} is a community-maintained directory that helps job seekers understand whether a company is product-based, service-based, or hybrid before they apply.`,
  },
  {
    title: "What we publish",
    body: `Verified profiles for ${CATEGORY_COUNTS.total}+ companies in the ${DATA_YEAR} catalog — each with a clear company-type label, structured facts, and links to the official sources we used.`,
  },
  {
    title: "How we verify",
    body: "A human reads official About, careers, and product or services pages. We do not scrape forums or invent leadership titles. If a fact cannot be sourced, we leave it out.",
  },
  {
    title: "What we are not",
    body: "We are not affiliated with listed employers, not a job board, and not official company documentation. Always confirm details on the employer’s own site before you apply.",
  },
] as const;

export function AboutPageContent() {
  return (
    <article className="about-page">
      <header className="about-page-header">
        <p className="eyebrow">About {SITE_NAME}</p>
        <h1 className="page-title">{SITE_TAGLINE}</h1>
        <p className="page-lead">
          We built this directory so candidates can see the kind of company they are joining — not just the
          brand name on a job post.
        </p>
      </header>

      <ol className="about-pillars">
        {PILLARS.map((pillar, index) => (
          <li key={pillar.title}>
            <span className="about-pillar-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{pillar.title}</h2>
              <p>{pillar.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="about-cta" aria-labelledby="about-help-heading">
        <h2 id="about-help-heading">Help keep the catalog accurate</h2>
        <p>
          Spot an outdated fact, or want a company added? Send a correction — no sign-in required. For
          general questions, privacy requests, or partnerships, use Contact.
        </p>
        <div className="about-cta-actions">
          <Link href="/submit" className="app-btn primary">
            Submit a correction
          </Link>
          <Link href="/contact" className="app-btn outline">
            Contact us
          </Link>
        </div>
      </section>
    </article>
  );
}
