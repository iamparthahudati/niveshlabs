import React from "react";
import Link from "next/link";

export interface LegalLinkItem {
  label: string;
  href: string;
}

export const DEFAULT_LEGAL_LINKS: LegalLinkItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Contact Us", href: "/contact" },
];

export interface LegalLinksProps {
  links?: LegalLinkItem[];
  className?: string;
}

export function LegalLinks({
  links = DEFAULT_LEGAL_LINKS,
  className = "legal-links",
}: LegalLinksProps) {
  return (
    <nav className={className} aria-label="Legal and policy links">
      <ul className="legal-links-list">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
