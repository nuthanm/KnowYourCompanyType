import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CompanyDetail } from "@/features/company/company-detail";
import { CompanyPipelineDetail } from "@/features/company/company-pipeline-detail";
import { getCompanyBySlug, getCompanyEntryBySlug, ALL_COMPANY_SLUGS } from "@/lib/companies";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ALL_COMPANY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = getCompanyEntryBySlug(slug);
  if (!entry) return { title: "Company not found — Know Your IT Hub" };
  const company = getCompanyBySlug(slug);
  return {
    title: `${entry.name} — Know Your IT Hub`,
    description: company?.tagline ?? entry.note ?? `${entry.name} on Know Your IT Hub`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const entry = getCompanyEntryBySlug(slug);
  if (!entry) notFound();

  const company = getCompanyBySlug(slug);

  return (
    <AppShell active="companies" wide>
      {company ? <CompanyDetail company={company} /> : <CompanyPipelineDetail entry={entry} />}
    </AppShell>
  );
}
