import { AppShell } from "@/components/AppShell";
import { PrivacyContent } from "@/features/policy/policy-pages";

export const metadata = { title: "Privacy Policy — Know Your IT Hub" };

export default function PrivacyPolicyPage() {
  return (
    <AppShell>
      <PrivacyContent />
    </AppShell>
  );
}
