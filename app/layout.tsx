import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { AdSenseScript } from "@/components/AdSense";
import { CookieConsent } from "@/components/CookieConsent";
import { SITE_NAME, SITE_TAGLINE, getSiteUrl } from "@/lib/site-meta";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const siteUrl = getSiteUrl("https://knowyourithub.com");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Company type directory`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_TAGLINE}. Product vs service company profiles for job seekers and researchers.`,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon",
  },
  openGraph: {
    title: `${SITE_NAME} — Company type directory`,
    description: "Browse product vs service companies. Submit adds or edits without sign-in.",
    siteName: SITE_NAME,
    url: siteUrl,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <CookieConsent />
        <AdSenseScript />
      </body>
    </html>
  );
}
