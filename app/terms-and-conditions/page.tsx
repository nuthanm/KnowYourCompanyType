import { AppShell } from "@/components/AppShell";
import { TermsContent } from "@/features/policy/policy-pages";

export const metadata = { title: "Terms and Conditions — Know Your Company Type" };

export default function TermsPage() {
  return (
    <AppShell>
      <TermsContent />
    </AppShell>
  );
}
