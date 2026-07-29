import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ContactForm } from "@/components/ContactForm";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";
import { SITE_NAME } from "@/lib/site-meta";

export const metadata = {
  title: `Contact — ${SITE_NAME}`,
  description: "Contact Know Your IT Hub for questions, privacy requests, or partnerships.",
};

export default function ContactPage() {
  return (
    <AppShell active="contact">
      <div className="page-narrow">
        <FormPageHeader
          eyebrow="Get in touch"
          title="Contact"
          lead={
            <>
              Questions about the directory, privacy or data requests, or partnerships — send a message
              below. For company add or edit requests, use{" "}
              <Link href="/submit">Submit request</Link> instead.
            </>
          }
        />
        <FormPanel>
          <ContactForm />
        </FormPanel>
      </div>
    </AppShell>
  );
}
