import { AppShell } from "@/components/AppShell";
import { AboutPageContent } from "@/features/about/about-page";
import { SITE_NAME } from "@/lib/site-meta";

export const metadata = {
  title: `About — ${SITE_NAME}`,
  description:
    "Learn who runs Know Your IT Hub, how we verify product vs service company profiles, and how to contact us.",
};

export default function AboutPage() {
  return (
    <AppShell active="about">
      <AboutPageContent />
    </AppShell>
  );
}
