import { AppShell } from "@/components/AppShell";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FormPageHeader, FormPanel } from "@/components/FormLayout";

export const metadata = {
  title: "Feedback — Know Your Company Type",
  description: "Share whether Know Your Company Type helped you pick the right company for your career.",
};

export default function FeedbackPage() {
  return (
    <AppShell active="feedback">
      <div className="page-narrow">
        <FormPageHeader
          eyebrow="Your opinion matters"
          title="Site feedback"
          lead={
            <>
              Did Know Your Company Type help you understand whether a company is{" "}
              <strong>product-based or service-based</strong> before applying? We read every
              response.
            </>
          }
        />
        <FormPanel>
          <FeedbackForm />
        </FormPanel>
      </div>
    </AppShell>
  );
}
