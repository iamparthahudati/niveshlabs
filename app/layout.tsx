import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niveshlabs.com"),
  title: "NiveshLabs — Markets, Tools and Insights",
  description:
    "Track Indian markets, explore mutual funds, compare credit cards and use practical finance calculators.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "NiveshLabs — Markets, Tools and Insights",
    description:
      "Track Indian markets, explore mutual funds, compare credit cards and use practical finance calculators.",
    url: "https://niveshlabs.com",
    siteName: "NiveshLabs",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NiveshLabs — Markets, Tools and Insights",
    description:
      "Track Indian markets, explore mutual funds, compare credit cards and use practical finance calculators.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
