import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SubscriberPill } from "@/components/SubscriberPill";
import stats from "@/data/site-stats.json";

type AppShellProps = {
  children: React.ReactNode;
  active?: "home" | "companies" | "queue" | "brief" | "submit" | "feedback" | "about" | "contact";
  wide?: boolean;
};

export function AppShell({ children, active, wide }: AppShellProps) {
  const showSubscriberPill =
    stats.showSubscriberCount && stats.subscriberCount > 0;

  return (
    <div className="app-shell">
      <header className="app-nav">
        <AppHeader
          active={active === "about" || active === "contact" ? undefined : active}
          trailing={showSubscriberPill ? <SubscriberPill /> : undefined}
        />
      </header>
      <main className={`app-main ${wide ? "app-main-wide" : ""}`.trim()}>{children}</main>
      <footer className="app-footer">
        <p>
          Know your company type before you apply — manually verified profiles from official sources.
        </p>
        <div className="app-footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/companies">Companies</Link>
          <Link href="/coming-soon">Review queue</Link>
          <Link href="/brief">The Brief</Link>
          <Link href="/submit">Submit request</Link>
          <Link href="/feedback">Feedback</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms</Link>
        </div>
        {showSubscriberPill && <SubscriberPill />}
        <p className="app-footer-note">Community directory. Not affiliated with listed companies.</p>
      </footer>
    </div>
  );
}
