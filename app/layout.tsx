import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: `${site.name} | ${site.title}`,
  description: site.pitch,
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  openGraph: { title: `${site.name} | ${site.title}`, description: site.pitch, type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} antialiased`}>{children}</body>
    </html>
  );
}
