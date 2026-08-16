import React from "react";
import { NavLink } from "@/components/ui/NavLink";

export interface NavItem {
  label: string;
  href: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Calculators", href: "/calculators" },
  { label: "Markets", href: "/#markets" },
  { label: "Stocks", href: "/#stocks" },
  { label: "Mutual Funds", href: "/#mutual-funds" },
  { label: "Credit Cards", href: "/#credit-cards" },
  { label: "Learn", href: "/#learn" },
  { label: "News", href: "/#news" },
];

export interface PrimaryNavProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export function PrimaryNav({
  items = DEFAULT_NAV_ITEMS,
  className = "desktop-nav",
  onItemClick,
}: PrimaryNavProps) {
  return (
    <nav className={className} aria-label="Primary navigation">
      {items.map((item) => (
        <NavLink key={item.label} href={item.href} onClick={onItemClick}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
